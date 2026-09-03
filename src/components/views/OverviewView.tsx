import React from 'react';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Percent,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency, formatNumber } from '../../utils/analytics';
import { KPICard } from '../KPICard';
import { MonthlyRevenueChart } from '../charts/MonthlyRevenueChart';
import { CategorySalesChart } from '../charts/CategorySalesChart';
import { CitySalesChart } from '../charts/CitySalesChart';
import { TopProductsChart } from '../charts/TopProductsChart';
import { OrderStatusChart } from '../charts/OrderStatusChart';
import { OrdersTable } from '../OrdersTable';

export const OverviewView: React.FC = () => {
  const { kpiSummary, setCurrentTab } = useDashboard();

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <section id="kpi-summary-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Total Revenue */}
        <KPICard
          id="kpi-total-revenue"
          title="Total Revenue"
          value={formatCurrency(kpiSummary.totalRevenue)}
          change={kpiSummary.totalRevenueChange}
          icon={DollarSign}
          sparklineData={kpiSummary.revenueSparkline}
          accentColor="indigo"
          highlight={true}
          secondaryText={`AOV: ${formatCurrency(kpiSummary.avgOrderValue)}`}
        />

        {/* 2. Total Orders */}
        <KPICard
          id="kpi-total-orders"
          title="Total Orders"
          value={formatNumber(kpiSummary.totalOrders)}
          change={kpiSummary.totalOrdersChange}
          icon={ShoppingCart}
          sparklineData={kpiSummary.ordersSparkline}
          accentColor="sky"
          secondaryText="Fulfillment: 91%"
        />

        {/* 3. Total Customers */}
        <KPICard
          id="kpi-total-customers"
          title="Total Customers"
          value={formatNumber(kpiSummary.totalCustomers)}
          change={kpiSummary.totalCustomersChange}
          icon={Users}
          sparklineData={kpiSummary.customersSparkline}
          accentColor="emerald"
          secondaryText="Repeat rate: 42%"
        />

        {/* 4. Total Products */}
        <KPICard
          id="kpi-total-products"
          title="Total Products"
          value={formatNumber(kpiSummary.totalProducts)}
          change={8.5}
          icon={Package}
          accentColor="violet"
          secondaryText="Active in catalog"
        />

        {/* 5. Total Profit */}
        <KPICard
          id="kpi-total-profit"
          title="Total Profit"
          value={formatCurrency(kpiSummary.totalProfit)}
          change={kpiSummary.totalProfitChange}
          icon={TrendingUp}
          sparklineData={kpiSummary.profitSparkline}
          accentColor="emerald"
          secondaryText={`Margin: ${kpiSummary.profitMarginPct}%`}
        />
      </section>

      {/* Row 1: Monthly Trend (8 cols) + Order Status (4 cols) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <MonthlyRevenueChart />
        </div>
        <div className="lg:col-span-4">
          <OrderStatusChart />
        </div>
      </section>

      {/* Row 2: Sales by Category (6 cols) + Sales by City (6 cols) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <CategorySalesChart />
        </div>
        <div className="lg:col-span-6">
          <CitySalesChart />
        </div>
      </section>

      {/* Row 3: Top 10 Products (5 cols) + Recent Orders Table (7 cols) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <TopProductsChart />
        </div>
        <div className="lg:col-span-7">
          <OrdersTable limitDefault={8} isFullPage={false} />
        </div>
      </section>
    </div>
  );
};
