import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { OrdersTable } from '../OrdersTable';
import { CheckCircle2, Clock, Truck, XCircle, RotateCcw, ShoppingBag, DollarSign } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/analytics';
import { OrderStatus } from '../../types';

export const OrdersView: React.FC = () => {
  const { filteredOrders, orderStatus, filters, setStatusFilter } = useDashboard();

  const totalRevenueInFiltered = filteredOrders.reduce((s, o) => s + (o.status !== 'Cancelled' ? o.revenue : 0), 0);
  const totalProfitInFiltered = filteredOrders.reduce((s, o) => s + (o.status !== 'Cancelled' ? o.profit : 0), 0);

  const statusIcons: Record<OrderStatus, React.ElementType> = {
    Delivered: CheckCircle2,
    Shipped: Truck,
    Processing: Clock,
    Cancelled: XCircle,
    Returned: RotateCcw,
  };

  return (
    <div className="space-y-6">
      {/* Quick Status Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {orderStatus.map((item) => {
          const Icon = statusIcons[item.status] || CheckCircle2;
          const isSelected = filters.status === item.status;

          return (
            <button
              key={item.status}
              onClick={() => setStatusFilter(isSelected ? 'all' : item.status)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500/40 text-white'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-xs font-medium">
                  {item.status}
                </span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
              <div className="text-lg font-semibold text-white font-mono">
                {item.count} <span className="text-xs font-normal text-zinc-500">orders</span>
              </div>
              <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                {formatCurrency(item.revenue, true)} ({item.percentage}%)
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Table */}
      <OrdersTable limitDefault={15} isFullPage={true} />
    </div>
  );
};
