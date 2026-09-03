import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency, formatNumber } from '../../utils/analytics';
import { TrendingUp, Layers, BarChart3, LineChart } from 'lucide-react';

export const MonthlyRevenueChart: React.FC = () => {
  const { monthlyTrend, isDarkMode } = useDashboard();
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [viewMetric, setViewMetric] = useState<'both' | 'revenue' | 'profit'>('both');

  const gridColor = 'rgba(255, 255, 255, 0.06)';
  const textColor = '#71717a';

  // Custom rich tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const margin = data.revenue > 0 ? ((data.profit / data.revenue) * 100).toFixed(1) : '0.0';

      return (
        <div className="bg-[#121215] p-3.5 rounded-xl shadow-2xl border border-white/15 text-xs min-w-[200px]">
          <div className="font-semibold text-white mb-2 pb-1.5 border-b border-white/10 flex items-center justify-between">
            <span>{data.fullMonth || label}</span>
            <span className="font-mono text-[11px] text-zinc-400">{data.orders} orders</span>
          </div>

          <div className="space-y-1.5 font-mono">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-500 inline-block" />
                Revenue:
              </span>
              <span className="font-semibold text-white">
                {formatCurrency(data.revenue)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400 inline-block" />
                Gross Profit:
              </span>
              <span className="font-semibold text-emerald-400">
                {formatCurrency(data.profit)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-zinc-600 inline-block" />
                Cost of Goods:
              </span>
              <span className="text-zinc-300">
                {formatCurrency(data.cost)}
              </span>
            </div>

            <div className="pt-1.5 mt-1.5 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-zinc-500">Operating Margin:</span>
              <span className="font-semibold text-blue-400">{margin}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="monthly-revenue-chart-card"
      className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors"
    >
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Monthly Revenue & Profit Trajectory
            </h2>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Historical 12-month performance, gross margins, and volume cadence
          </p>
        </div>

        {/* View Mode Switches */}
        <div className="flex items-center gap-2">
          {/* Metric Selector */}
          <div className="flex items-center bg-white/5 p-0.5 rounded-lg border border-white/10 text-[11px] font-medium">
            <button
              onClick={() => setViewMetric('both')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMetric === 'both'
                  ? 'bg-white/10 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setViewMetric('revenue')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMetric === 'revenue'
                  ? 'bg-white/10 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setViewMetric('profit')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMetric === 'profit'
                  ? 'bg-white/10 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Profit
            </button>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center bg-white/5 p-0.5 rounded-lg border border-white/10">
            <button
              onClick={() => setChartType('area')}
              className={`p-1.5 rounded-md transition-colors ${
                chartType === 'area'
                  ? 'bg-white/10 text-blue-400 shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Area Chart"
              aria-label="Area Chart"
            >
              <LineChart className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-1.5 rounded-md transition-colors ${
                chartType === 'bar'
                  ? 'bg-white/10 text-blue-400 shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Bar Chart"
              aria-label="Bar Chart"
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis
                dataKey="month"
                stroke={textColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={textColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => formatCurrency(val, true)}
              />
              <Tooltip content={<CustomTooltip />} />
              {(viewMetric === 'both' || viewMetric === 'revenue') && (
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                />
              )}
              {(viewMetric === 'both' || viewMetric === 'profit') && (
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#profitGrad)"
                />
              )}
            </AreaChart>
          ) : (
            <BarChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis
                dataKey="month"
                stroke={textColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={textColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => formatCurrency(val, true)}
              />
              <Tooltip content={<CustomTooltip />} />
              {(viewMetric === 'both' || viewMetric === 'revenue') && (
                <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={30} />
              )}
              {(viewMetric === 'both' || viewMetric === 'profit') && (
                <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Legend Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-white/10 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-500" />
            <span className="text-zinc-300 font-medium">Gross Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
            <span className="text-zinc-300 font-medium">Net Profit</span>
          </div>
        </div>

        <div className="text-[11px] text-zinc-400 font-medium">
          Target Revenue Velocity: <span className="font-semibold text-blue-400">94.2%</span> of quarterly goal
        </div>
      </div>
    </div>
  );
};
