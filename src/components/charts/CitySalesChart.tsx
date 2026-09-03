import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency, formatNumber } from '../../utils/analytics';
import { MapPin } from 'lucide-react';

export const CitySalesChart: React.FC = () => {
  const { citySales, filters, setCityFilter, isDarkMode } = useDashboard();

  const topCities = citySales.slice(0, 7);
  const gridColor = 'rgba(255, 255, 255, 0.06)';
  const textColor = '#71717a';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#121215] p-3 rounded-xl shadow-2xl border border-white/15 text-xs min-w-[180px]">
          <div className="font-semibold text-white mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>{data.city}, {data.state}</span>
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-zinc-400">Revenue:</span>
              <span className="font-semibold text-white">
                {formatCurrency(data.revenue)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Orders:</span>
              <span className="text-zinc-300">
                {formatNumber(data.orders)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Avg Basket (AOV):</span>
              <span className="font-medium text-emerald-400">
                {formatCurrency(data.avgOrderValue)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Revenue Share:</span>
              <span className="font-semibold text-blue-400">
                {data.percentage}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="city-sales-chart-card"
      className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Sales by City / Region
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Top metropolitan markets ranked by gross revenue
          </p>
        </div>
        {filters.city !== 'all' && (
          <button
            onClick={() => setCityFilter('all')}
            className="text-[11px] font-medium text-blue-400 hover:text-blue-300"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Horizontal Bar Chart */}
      <div className="h-[250px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={topCities}
            margin={{ top: 5, right: 20, left: 35, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
            <XAxis
              type="number"
              stroke={textColor}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => formatCurrency(val, true)}
            />
            <YAxis
              type="category"
              dataKey="city"
              stroke={textColor}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="revenue"
              radius={[0, 4, 4, 0]}
              maxBarSize={22}
              cursor="pointer"
              onClick={(entry) => setCityFilter(entry.city)}
            >
              {topCities.map((entry, index) => {
                const isSelected = filters.city === entry.city;
                return (
                  <Cell
                    key={`city-cell-${index}`}
                    fill={isSelected ? '#3b82f6' : '#2563eb'}
                    opacity={isSelected ? 1 : 0.75}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-500">
        <span>Click any metropolitan bar to filter</span>
        <span className="font-mono text-zinc-400">
          Leading Market: <strong className="text-white">{topCities[0]?.city || 'N/A'}</strong>
        </span>
      </div>
    </div>
  );
};
