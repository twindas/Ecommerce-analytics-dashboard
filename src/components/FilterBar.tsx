import React from 'react';
import { Filter, X, RotateCcw, Check, Tag, MapPin, CheckCircle2, Layers } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { CATEGORIES, CITIES } from '../data/mockData';
import { OrderStatus } from '../types';

export const FilterBar: React.FC = () => {
  const {
    filters,
    setCategoryFilter,
    setCityFilter,
    setStatusFilter,
    resetFilters,
    hasActiveFilters,
    filteredOrders,
    allOrders,
  } = useDashboard();

  const statuses: OrderStatus[] = ['Delivered', 'Shipped', 'Processing', 'Cancelled', 'Returned'];

  return (
    <div
      id="global-filters-container"
      className="bg-white/[0.03] border border-white/10 rounded-xl p-4 transition-colors"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Filter Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-300 pr-2 border-r border-white/10">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span>Global Filters</span>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="filter-category" className="text-[11px] font-medium text-zinc-400">
              Category:
            </label>
            <select
              id="filter-category"
              value={filters.category}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-[#121215] border border-white/10 rounded-lg px-2.5 py-1.5 text-zinc-200 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500/50 cursor-pointer"
            >
              <option value="all">All Categories ({CATEGORIES.length})</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* City Dropdown */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="filter-city" className="text-[11px] font-medium text-zinc-400">
              City:
            </label>
            <select
              id="filter-city"
              value={filters.city}
              onChange={(e) => setCityFilter(e.target.value)}
              className="text-xs bg-[#121215] border border-white/10 rounded-lg px-2.5 py-1.5 text-zinc-200 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500/50 cursor-pointer"
            >
              <option value="all">All Cities ({CITIES.length})</option>
              {CITIES.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}, {c.state}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="filter-status" className="text-[11px] font-medium text-zinc-400">
              Status:
            </label>
            <select
              id="filter-status"
              value={filters.status}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-[#121215] border border-white/10 rounded-lg px-2.5 py-1.5 text-zinc-200 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500/50 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Side: Active count & Reset */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-xs text-zinc-400">
            Showing{' '}
            <span className="font-semibold text-white tabular-nums">
              {filteredOrders.length}
            </span>{' '}
            of <span className="tabular-nums">{allOrders.length}</span> orders
          </div>

          {hasActiveFilters && (
            <button
              id="reset-all-filters-btn"
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-md transition-colors border border-rose-500/20"
              title="Reset all filters to default"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Badges Pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/10">
          <span className="text-[11px] font-medium text-zinc-500">
            Active criteria:
          </span>

          {filters.dateRange !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-600/10 text-blue-400 border border-blue-500/20 font-mono">
              Range: {filters.dateRange.toUpperCase()}
            </span>
          )}

          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Tag className="w-3 h-3" />
              {filters.category}
              <button
                onClick={() => setCategoryFilter('all')}
                className="hover:text-white ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.city !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MapPin className="w-3 h-3" />
              {filters.city}
              <button
                onClick={() => setCityFilter('all')}
                className="hover:text-white ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CheckCircle2 className="w-3 h-3" />
              {filters.status}
              <button
                onClick={() => setStatusFilter('all')}
                className="hover:text-white ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              Query: &quot;{filters.searchQuery}&quot;
            </span>
          )}
        </div>
      )}
    </div>
  );
};
