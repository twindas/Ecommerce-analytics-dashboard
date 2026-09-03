import React, { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  RotateCcw,
  Search,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { Order, OrderStatus } from '../types';
import { formatCurrency, formatNumber, exportOrdersToCSV } from '../utils/analytics';

type SortKey = 'orderNumber' | 'customerName' | 'product' | 'category' | 'orderDate' | 'quantity' | 'revenue' | 'profit' | 'status';

export const OrdersTable: React.FC<{ limitDefault?: number; isFullPage?: boolean }> = ({
  limitDefault = 10,
  isFullPage = false,
}) => {
  const { filteredOrders, setSelectedOrder } = useDashboard();

  const [sortKey, setSortKey] = useState<SortKey>('orderDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(limitDefault);
  const [localSearch, setLocalSearch] = useState<string>('');

  // Status Badge visual styling
  const statusStyles: Record<OrderStatus, { bg: string; text: string; icon: React.ElementType }> = {
    Delivered: {
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      text: 'text-emerald-400',
      icon: CheckCircle2,
    },
    Shipped: {
      bg: 'bg-blue-500/10 border-blue-500/20',
      text: 'text-blue-400',
      icon: Truck,
    },
    Processing: {
      bg: 'bg-amber-500/10 border-amber-500/20',
      text: 'text-amber-400',
      icon: Clock,
    },
    Cancelled: {
      bg: 'bg-rose-500/10 border-rose-500/20',
      text: 'text-rose-400',
      icon: XCircle,
    },
    Returned: {
      bg: 'bg-purple-500/10 border-purple-500/20',
      text: 'text-purple-400',
      icon: RotateCcw,
    },
  };

  // Sorting handler
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  // Filter and sort
  const processedOrders = useMemo(() => {
    let result = [...filteredOrders];

    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.product.toLowerCase().includes(q) ||
          o.city.toLowerCase().includes(q) ||
          o.category.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let aVal: any = a[sortKey];
      let bVal: any = b[sortKey];

      if (sortKey === 'orderDate') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [filteredOrders, sortKey, sortDirection, localSearch]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(processedOrders.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = processedOrders.slice(startIndex, startIndex + pageSize);

  const handleExportTableCSV = () => {
    const csv = exportOrdersToCSV(processedOrders);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_table_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="w-3 h-3 text-zinc-600 opacity-60" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-blue-400 font-bold" />
    ) : (
      <ArrowDown className="w-3 h-3 text-blue-400 font-bold" />
    );
  };

  return (
    <div
      id="recent-orders-table-container"
      className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden transition-colors"
    >
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              {isFullPage ? 'Complete Order Transactions' : 'Recent Customer Orders'}
            </h2>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 bg-white/5 border border-white/10 text-zinc-300 rounded-md">
              {processedOrders.length} Matched
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Real-time transaction logs with order profitability, items, and delivery lifecycle
          </p>
        </div>

        {/* Local Table Search & Export */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter table..."
              className="pl-8 pr-3 py-1 text-xs bg-[#121215] border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 w-36 sm:w-48"
            />
          </div>

          <button
            onClick={handleExportTableCSV}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-white/5 border border-white/10 rounded-lg text-zinc-200 hover:bg-white/10 transition-colors"
            title="Export this table view"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/10 text-zinc-400 font-medium">
              <th
                onClick={() => handleSort('orderNumber')}
                className="py-3 px-4 cursor-pointer hover:text-white select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Order ID</span>
                  {renderSortIcon('orderNumber')}
                </div>
              </th>

              <th
                onClick={() => handleSort('customerName')}
                className="py-3 px-4 cursor-pointer hover:text-white select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Customer</span>
                  {renderSortIcon('customerName')}
                </div>
              </th>

              <th
                onClick={() => handleSort('product')}
                className="py-3 px-4 cursor-pointer hover:text-white select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Product & Category</span>
                  {renderSortIcon('product')}
                </div>
              </th>

              <th
                onClick={() => handleSort('orderDate')}
                className="py-3 px-4 cursor-pointer hover:text-white select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Order Date</span>
                  {renderSortIcon('orderDate')}
                </div>
              </th>

              <th
                onClick={() => handleSort('quantity')}
                className="py-3 px-3 cursor-pointer hover:text-white select-none text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Qty</span>
                  {renderSortIcon('quantity')}
                </div>
              </th>

              <th
                onClick={() => handleSort('revenue')}
                className="py-3 px-4 cursor-pointer hover:text-white select-none text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Revenue</span>
                  {renderSortIcon('revenue')}
                </div>
              </th>

              <th
                onClick={() => handleSort('profit')}
                className="py-3 px-4 cursor-pointer hover:text-white select-none text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Profit (Margin)</span>
                  {renderSortIcon('profit')}
                </div>
              </th>

              <th
                onClick={() => handleSort('status')}
                className="py-3 px-4 cursor-pointer hover:text-white select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  {renderSortIcon('status')}
                </div>
              </th>

              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => {
                const statusStyle = statusStyles[order.status] || statusStyles.Delivered;
                const StatusIcon = statusStyle.icon;

                return (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="group hover:bg-white/[0.04] cursor-pointer transition-colors"
                  >
                    {/* Order ID */}
                    <td className="py-3 px-4 font-mono font-medium text-blue-400 group-hover:underline">
                      {order.orderNumber}
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={order.customerAvatar}
                          alt={order.customerName}
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-white/10"
                        />
                        <div className="min-w-0">
                          <div className="font-medium text-zinc-100 truncate">
                            {order.customerName}
                          </div>
                          <div className="text-[11px] text-zinc-400 truncate">
                            {order.city}, {order.state}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Product & Category */}
                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="font-medium text-zinc-100 truncate">
                        {order.product}
                      </div>
                      <span className="text-[10px] font-medium text-zinc-400">
                        {order.category}
                      </span>
                    </td>

                    {/* Order Date */}
                    <td className="py-3 px-4 font-mono text-zinc-400 whitespace-nowrap">
                      {order.orderDate}
                    </td>

                    {/* Quantity */}
                    <td className="py-3 px-3 font-mono text-right font-medium text-zinc-300">
                      {order.quantity}
                    </td>

                    {/* Revenue */}
                    <td className="py-3 px-4 font-mono text-right font-semibold text-white">
                      {formatCurrency(order.revenue)}
                    </td>

                    {/* Profit */}
                    <td className="py-3 px-4 font-mono text-right">
                      <span className="font-semibold text-emerald-400">
                        {formatCurrency(order.profit)}
                      </span>
                      <span className="text-[10px] text-zinc-400 ml-1">
                        ({order.profitMargin}%)
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {order.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="p-1 text-zinc-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
                        title="View Order Breakdown"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="py-8 text-center text-zinc-500">
                  No orders match current filter criteria. Try resetting filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-[#121215] border border-white/10 rounded-md px-2 py-1 text-zinc-300 font-medium cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="tabular-nums">
            Showing {processedOrders.length > 0 ? startIndex + 1 : 0} to{' '}
            {Math.min(startIndex + pageSize, processedOrders.length)} of {processedOrders.length} entries
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-40 transition-colors text-zinc-300"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 font-mono font-medium text-zinc-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-40 transition-colors text-zinc-300"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
