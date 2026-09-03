import React from 'react';
import {
  X,
  Package,
  Calendar,
  CreditCard,
  Truck,
  MapPin,
  DollarSign,
  TrendingUp,
  User,
  Mail,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatCurrency } from '../utils/analytics';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const statusBadges: Record<OrderStatus, { bg: string; text: string; icon: React.ElementType }> = {
    Delivered: { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', icon: CheckCircle2 },
    Shipped: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', icon: Truck },
    Processing: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', icon: Clock },
    Cancelled: { bg: 'bg-rose-500/10 border-rose-500/20', text: 'text-rose-400', icon: XCircle },
    Returned: { bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-400', icon: RotateCcw },
  };

  const statusConfig = statusBadges[order.status] || statusBadges.Delivered;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#0e0e12] rounded-2xl shadow-2xl border border-white/15 overflow-hidden text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white font-mono">
                  {order.orderNumber}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text}`}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Processed on {new Date(order.orderDate).toLocaleDateString('en-US', { dateStyle: 'full' })}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Customer & Location Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-[11px] uppercase font-medium text-zinc-400 tracking-wider">
                Customer Information
              </span>
              <div className="flex items-center gap-3 mt-3">
                <img
                  src={order.customerAvatar}
                  alt={order.customerName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20 border border-white/10"
                />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {order.customerName}
                  </div>
                  <div className="text-xs text-zinc-400 truncate">
                    {order.customerEmail}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-[11px] uppercase font-medium text-zinc-400 tracking-wider">
                Fulfillment & Location
              </span>
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    {order.city}, {order.state} (United States)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Truck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Shipping: {order.shippingType} Carrier</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                  <span>Payment: {order.paymentMethod}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Line Item */}
          <div className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
            <div className="px-4 py-2.5 bg-white/[0.03] border-b border-white/10 text-xs font-medium text-zinc-300">
              Purchased Items & Breakdown
            </div>
            <div className="p-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-white">
                  {order.product}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                  <span className="font-mono text-blue-400 font-medium">
                    {order.productId}
                  </span>
                  <span>•</span>
                  <span>Category: {order.category}</span>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-xs text-zinc-400">
                  {order.quantity} × {formatCurrency(order.unitPrice)}
                </div>
                <div className="text-base font-semibold text-white mt-0.5">
                  {formatCurrency(order.revenue)}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Calculation Matrix */}
          <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/20">
            <span className="text-[11px] uppercase font-medium text-blue-400 tracking-wider">
              Financial Margin Analysis
            </span>
            <div className="grid grid-cols-3 gap-4 mt-3 font-mono text-center">
              <div className="p-2.5 rounded-lg bg-[#141419] border border-white/10">
                <div className="text-[11px] text-zinc-400">Gross Revenue</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {formatCurrency(order.revenue)}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#141419] border border-white/10">
                <div className="text-[11px] text-zinc-400">Cost of Goods</div>
                <div className="text-base font-medium text-zinc-300 mt-0.5">
                  {formatCurrency(order.cost)}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#141419] border border-white/10">
                <div className="text-[11px] text-zinc-400">Net Profit ({order.profitMargin}%)</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">
                  {formatCurrency(order.profit)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-3.5 bg-white/[0.02] border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium bg-white/10 border border-white/10 text-white rounded-lg hover:bg-white/15 transition-colors"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
