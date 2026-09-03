import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency, formatNumber } from '../../utils/analytics';
import { Tag, ArrowUpRight } from 'lucide-react';

export const CategorySalesChart: React.FC = () => {
  const { categoryBreakdown, filters, setCategoryFilter } = useDashboard();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#121215] p-3 rounded-xl shadow-2xl border border-white/15 text-xs min-w-[170px]">
          <div className="font-semibold text-white mb-1.5 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.category}</span>
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-zinc-400">Revenue:</span>
              <span className="font-semibold text-white">
                {formatCurrency(data.revenue)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Share:</span>
              <span className="font-semibold text-blue-400">
                {data.percentage}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Units Sold:</span>
              <span className="text-zinc-300">
                {formatNumber(data.units)}
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
      id="category-sales-chart-card"
      className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Sales by Category
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Revenue distribution and volume mix
          </p>
        </div>
        {filters.category !== 'all' && (
          <button
            onClick={() => setCategoryFilter('all')}
            className="text-[11px] font-medium text-blue-400 hover:text-blue-300"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Donut Chart and Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center flex-1">
        {/* Chart Canvas */}
        <div className="md:col-span-6 h-[200px] relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={82}
                paddingAngle={3}
                dataKey="revenue"
                cursor="pointer"
                onClick={(entry: any) => {
                  if (entry && entry.category) {
                    setCategoryFilter(entry.category);
                  }
                }}
              >
                {categoryBreakdown.map((entry, index) => {
                  const isSelected = filters.category === entry.category;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={isSelected ? '#ffffff' : 'transparent'}
                      strokeWidth={isSelected ? 2 : 0}
                      className="transition-all hover:opacity-80"
                    />
                  );
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Donut Metric */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase font-medium text-zinc-500 tracking-wider">
              Categories
            </span>
            <span className="text-lg font-bold text-white font-mono">
              {categoryBreakdown.length}
            </span>
          </div>
        </div>

        {/* Categories Legend List */}
        <div className="md:col-span-6 space-y-1.5 overflow-y-auto max-h-[220px] pr-1">
          {categoryBreakdown.map((cat) => {
            const isSelected = filters.category === cat.category;
            return (
              <button
                key={cat.category}
                onClick={() => setCategoryFilter(isSelected ? 'all' : cat.category)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all border ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500/30 text-white'
                    : 'border-transparent hover:bg-white/5 text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-medium truncate">
                    {cat.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
                  <span className="font-semibold text-white">
                    {formatCurrency(cat.revenue, true)}
                  </span>
                  <span className="text-zinc-500 font-medium w-9 text-right">
                    {cat.percentage}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
