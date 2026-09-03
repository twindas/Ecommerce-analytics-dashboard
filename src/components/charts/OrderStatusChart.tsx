import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency, formatNumber } from '../../utils/analytics';
import { CheckCircle2, Clock, Truck, XCircle, RotateCcw } from 'lucide-react';
import { OrderStatus } from '../../types';

export const OrderStatusChart: React.FC = () => {
  const { orderStatus, filters, setStatusFilter } = useDashboard();

  const statusIcons: Record<OrderStatus, React.ElementType> = {
    Delivered: CheckCircle2,
    Shipped: Truck,
    Processing: Clock,
    Cancelled: XCircle,
    Returned: RotateCcw,
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#121215] p-3 rounded-xl shadow-2xl border border-white/15 text-xs min-w-[170px]">
          <div className="font-semibold text-white mb-1.5 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.status}</span>
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-zinc-400">Order Count:</span>
              <span className="font-semibold text-white">{data.count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Share of Total:</span>
              <span className="font-semibold text-blue-400">
                {data.percentage}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Associated Value:</span>
              <span className="text-emerald-400 font-medium">
                {formatCurrency(data.revenue)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalOrdersCount = orderStatus.reduce((sum, item) => sum + item.count, 0);
  const deliveredCount = orderStatus.find((s) => s.status === 'Delivered')?.count || 0;
  const fulfillmentRate = totalOrdersCount > 0 ? ((deliveredCount / totalOrdersCount) * 100).toFixed(1) : '0';

  return (
    <div
      id="order-status-chart-card"
      className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Order Status Distribution
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Fulfillment pipeline & lifecycle conversion
          </p>
        </div>
        {filters.status !== 'all' && (
          <button
            onClick={() => setStatusFilter('all')}
            className="text-[11px] font-medium text-blue-400 hover:text-blue-300"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center flex-1">
        {/* Chart */}
        <div className="md:col-span-5 h-[180px] relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={orderStatus}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="count"
                cursor="pointer"
                onClick={(entry: any) => {
                  if (entry && entry.status) {
                    setStatusFilter(entry.status);
                  }
                }}
              >
                {orderStatus.map((entry, index) => {
                  const isSelected = filters.status === entry.status;
                  return (
                    <Cell
                      key={`status-cell-${index}`}
                      fill={entry.color}
                      stroke={isSelected ? '#ffffff' : 'transparent'}
                      strokeWidth={isSelected ? 2 : 0}
                    />
                  );
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase font-medium text-zinc-500">Delivered</span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              {fulfillmentRate}%
            </span>
          </div>
        </div>

        {/* Status List */}
        <div className="md:col-span-7 space-y-1.5">
          {orderStatus.map((item) => {
            const Icon = statusIcons[item.status] || CheckCircle2;
            const isSelected = filters.status === item.status;

            return (
              <button
                key={item.status}
                onClick={() => setStatusFilter(isSelected ? 'all' : item.status)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all border ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500/30 text-white'
                    : 'border-transparent hover:bg-white/5 text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium">
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="font-semibold text-white">
                    {item.count} orders
                  </span>
                  <span className="text-zinc-500 font-medium w-8 text-right">
                    {item.percentage}%
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
