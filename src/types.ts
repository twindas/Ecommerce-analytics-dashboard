export type OrderStatus = 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled' | 'Returned';

export type ProductCategory = 
  | 'Electronics'
  | 'Computing'
  | 'Audio & Video'
  | 'Smart Home'
  | 'Office & Ergonomics'
  | 'Wearables'
  | 'Gaming Accessories';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerAvatar: string;
  product: string;
  productId: string;
  category: ProductCategory;
  city: string;
  state: string;
  orderDate: string; // ISO date string YYYY-MM-DD
  quantity: number;
  unitPrice: number;
  cost: number;
  revenue: number;
  profit: number;
  profitMargin: number; // Percentage (e.g. 34.5)
  status: OrderStatus;
  paymentMethod: 'Credit Card' | 'PayPal' | 'Apple Pay' | 'Bank Transfer';
  shippingType: 'Standard' | 'Express' | 'Next Day' | 'Free';
}

export interface KPISummary {
  totalRevenue: number;
  totalRevenueChange: number; // percentage change vs previous period
  totalOrders: number;
  totalOrdersChange: number;
  totalCustomers: number;
  totalCustomersChange: number;
  totalProducts: number;
  totalProfit: number;
  totalProfitChange: number;
  avgOrderValue: number;
  avgOrderValueChange: number;
  profitMarginPct: number;
  revenueSparkline: number[];
  ordersSparkline: number[];
  customersSparkline: number[];
  profitSparkline: number[];
}

export interface MonthlyTrendData {
  month: string; // "Jan", "Feb", etc.
  fullMonth: string; // "Jan 2025"
  monthKey: string; // "2025-01"
  revenue: number;
  profit: number;
  cost: number;
  orders: number;
  avgOrderValue: number;
  prevRevenue?: number;
}

export interface CategorySalesData {
  category: ProductCategory;
  revenue: number;
  profit: number;
  orders: number;
  units: number;
  percentage: number;
  color: string;
}

export interface CitySalesData {
  city: string;
  state: string;
  revenue: number;
  profit: number;
  orders: number;
  avgOrderValue: number;
  customers: number;
  percentage: number;
}

export interface TopProductData {
  id: string;
  name: string;
  category: ProductCategory;
  unitsSold: number;
  revenue: number;
  profit: number;
  profitMargin: number;
  avgPrice: number;
  stock: number;
  rating: number;
}

export interface OrderStatusData {
  status: OrderStatus;
  count: number;
  revenue: number;
  percentage: number;
  color: string;
}

export type DateRangePreset = '7d' | '30d' | '90d' | 'ytd' | '12m' | 'all' | 'custom';

export interface FilterState {
  dateRange: DateRangePreset;
  startDate: string | null;
  endDate: string | null;
  category: string; // 'all' or specific
  city: string; // 'all' or specific
  status: string; // 'all' or specific
  searchQuery: string;
}

export type NavigationTab = 
  | 'overview' 
  | 'orders' 
  | 'products' 
  | 'regional' 
  | 'insights' 
  | 'settings';

export interface AIExecutiveInsight {
  headline: string;
  summary: string;
  keyDrivers: {
    title: string;
    description: string;
    impact: 'positive' | 'neutral' | 'negative';
  }[];
  recommendations: string[];
  anomaliesDetected: {
    metric: string;
    observation: string;
    severity: 'low' | 'medium' | 'high';
  }[];
}
