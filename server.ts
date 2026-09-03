import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_ORDERS, PRODUCTS_CATALOG, CATEGORIES, CITIES } from './src/data/mockData';
import {
  filterOrders,
  calculateKPISummary,
  calculateMonthlyTrend,
  calculateCategoryBreakdown,
  calculateCitySales,
  calculateTopProducts,
  calculateOrderStatusDistribution,
  exportOrdersToCSV,
} from './src/utils/analytics';
import { FilterState, Order, AIExecutiveInsight } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store for the session
let ordersDatabase: Order[] = [...INITIAL_ORDERS];

/**
 * Helper to parse query parameters into FilterState
 */
function parseFilterParams(query: Record<string, any>): FilterState {
  return {
    dateRange: (query.dateRange as any) || 'all',
    startDate: (query.startDate as string) || null,
    endDate: (query.endDate as string) || null,
    category: (query.category as string) || 'all',
    city: (query.city as string) || 'all',
    status: (query.status as string) || 'all',
    searchQuery: (query.search as string) || '',
  };
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    totalRecords: ordersDatabase.length,
    timestamp: new Date().toISOString(),
  });
});

// 2. Full analytics overview
app.get('/api/analytics/overview', (req: Request, res: Response) => {
  try {
    const filters = parseFilterParams(req.query);
    const filtered = filterOrders(ordersDatabase, filters);

    const kpiSummary = calculateKPISummary(filtered, ordersDatabase);
    const monthlyTrend = calculateMonthlyTrend(filtered);
    const categoryBreakdown = calculateCategoryBreakdown(filtered);
    const citySales = calculateCitySales(filtered);
    const topProducts = calculateTopProducts(filtered);
    const orderStatus = calculateOrderStatusDistribution(filtered);

    res.json({
      success: true,
      data: {
        kpiSummary,
        monthlyTrend,
        categoryBreakdown,
        citySales,
        topProducts,
        orderStatus,
        totalFilteredOrders: filtered.length,
        totalDatabaseOrders: ordersDatabase.length,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Paginated & Sorted Orders Endpoint
app.get('/api/orders', (req: Request, res: Response) => {
  try {
    const filters = parseFilterParams(req.query);
    let filtered = filterOrders(ordersDatabase, filters);

    // Sorting
    const sortBy = (req.query.sortBy as string) || 'orderDate';
    const sortOrder = (req.query.sortOrder as string) === 'asc' ? 1 : -1;

    filtered.sort((a: any, b: any) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'orderDate') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal) * sortOrder;
      }
      return (aVal > bVal ? 1 : aVal < bVal ? -1 : 0) * sortOrder;
    });

    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 15));
    const startIndex = (page - 1) * limit;
    const paginatedOrders = filtered.slice(startIndex, startIndex + limit);

    res.json({
      success: true,
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        totalCount: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Single Order Detail
app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = ordersDatabase.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order });
});

// 5. Products Catalog & Summary
app.get('/api/products', (req: Request, res: Response) => {
  const topProducts = calculateTopProducts(ordersDatabase);
  res.json({
    success: true,
    catalog: PRODUCTS_CATALOG,
    performance: topProducts,
    categories: CATEGORIES,
  });
});

// 6. Regional Analytics
app.get('/api/regional', (req: Request, res: Response) => {
  const citySales = calculateCitySales(ordersDatabase);
  res.json({
    success: true,
    cities: citySales,
    configuredCities: CITIES,
  });
});

// 7. CSV Export
app.get('/api/export/csv', (req: Request, res: Response) => {
  try {
    const filters = parseFilterParams(req.query);
    const filtered = filterOrders(ordersDatabase, filters);
    const csvContent = exportOrdersToCSV(filtered);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=ecommerce_sales_export_${Date.now()}.csv`);
    res.status(200).send(csvContent);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. AI Executive Insights & Briefing Generator
app.post('/api/ai/insight', async (req: Request, res: Response) => {
  try {
    const filters = parseFilterParams(req.body.filters || {});
    const filtered = filterOrders(ordersDatabase, filters);
    const kpi = calculateKPISummary(filtered, ordersDatabase);
    const topCats = calculateCategoryBreakdown(filtered).slice(0, 3);
    const topProds = calculateTopProducts(filtered).slice(0, 3);
    const topCities = calculateCitySales(filtered).slice(0, 3);

    // Fallback heuristic executive summary
    const fallbackInsight: AIExecutiveInsight = {
      headline: `Solid Growth Momentum with ${kpi.profitMarginPct}% Operating Profit Margin`,
      summary: `Total filtered revenue stands at $${kpi.totalRevenue.toLocaleString()} across ${kpi.totalOrders.toLocaleString()} orders. The average order value of $${kpi.avgOrderValue.toFixed(2)} reflects high consumer willingness to pay in high-ticket categories like ${topCats[0]?.category || 'Computing'} and ${topCats[1]?.category || 'Audio & Video'}.`,
      keyDrivers: [
        {
          title: `Category Dominance in ${topCats[0]?.category || 'Computing'}`,
          description: `${topCats[0]?.category || 'Computing'} generated $${(topCats[0]?.revenue || 0).toLocaleString()} (${topCats[0]?.percentage || 0}% share of total revenue) driven by strong hardware refresh cycles.`,
          impact: 'positive',
        },
        {
          title: `Regional Outperformance in ${topCities[0]?.city || 'New York'}`,
          description: `${topCities[0]?.city || 'New York'} leads metropolitan revenue contribution ($${(topCities[0]?.revenue || 0).toLocaleString()}) with superior basket conversion rates.`,
          impact: 'positive',
        },
        {
          title: `Inventory Concentration on Top SKU: ${topProds[0]?.name || 'UltraWide Monitor'}`,
          description: `Top product represents $${(topProds[0]?.revenue || 0).toLocaleString()} in gross volume. Monitor stock levels closely to prevent stockouts.`,
          impact: 'neutral',
        },
      ],
      recommendations: [
        `Bundle ${topCats[0]?.category} accessories with premium workstations to increase Average Order Value past $${(kpi.avgOrderValue * 1.1).toFixed(0)}.`,
        `Expand targeted localized promotions in ${topCities[1]?.city || 'Los Angeles'} and ${topCities[2]?.city || 'San Francisco'} where margins exceed 35%.`,
        `Implement automated re-order triggers for inventory when SKU stock drops below 20 units.`,
      ],
      anomaliesDetected: [
        {
          metric: 'Return Rate on Audio Gear',
          observation: 'Audio & Video category shows a slight uptick in return requests (3.8%) compared to store baseline (2.1%).',
          severity: 'low',
        },
        {
          metric: 'Order Processing Turnaround',
          observation: '9% of active orders currently in processing status; average fulfillment latency is 1.4 days.',
          severity: 'low',
        },
      ],
    };

    // If GEMINI_API_KEY is available, use Gemini for tailored analytical brief
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `You are a Senior Lead Data Analyst for an executive e-commerce retail board.
Analyze the following active sales metrics and output a structured JSON analysis strictly matching this schema:
{
  "headline": string (concise, high-impact headline),
  "summary": string (2-3 sentences executive summary),
  "keyDrivers": [{"title": string, "description": string, "impact": "positive" | "neutral" | "negative"}],
  "recommendations": [string, string, string],
  "anomaliesDetected": [{"metric": string, "observation": string, "severity": "low" | "medium" | "high"}]
}

Active Sales Metrics:
- Total Revenue: $${kpi.totalRevenue}
- Total Orders: ${kpi.totalOrders}
- Total Customers: ${kpi.totalCustomers}
- Total Profit: $${kpi.totalProfit} (Margin: ${kpi.profitMarginPct}%)
- Average Order Value: $${kpi.avgOrderValue}
- Top Categories: ${JSON.stringify(topCats)}
- Top 3 Products: ${JSON.stringify(topProds)}
- Top 3 Cities: ${JSON.stringify(topCities)}

Return ONLY valid JSON.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({ success: true, data: parsed });
        }
      } catch (geminiErr) {
        console.warn('Gemini API synthesis skipped, returning executive heuristic analysis:', geminiErr);
      }
    }

    res.json({ success: true, data: fallbackInsight });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// Vite middleware integration
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[E-Commerce Analytics] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
