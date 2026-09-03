import React, { useState } from 'react';
import {
  Sun,
  Moon,
  RotateCw,
  Download,
  Search,
  Calendar,
  Filter,
  Check,
  ChevronDown,
  Bell,
  Sparkles,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { DateRangePreset } from '../types';
import { exportOrdersToCSV } from '../utils/analytics';

export const Header: React.FC = () => {
  const {
    currentTab,
    filters,
    setDateRange,
    setSearchQuery,
    isDarkMode,
    toggleDarkMode,
    isRefreshing,
    refreshData,
    lastUpdated,
    filteredOrders,
    setCurrentTab,
  } = useDashboard();

  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    overview: {
      title: 'Executive Sales Overview',
      subtitle: 'Real-time sales performance, revenue trajectory, and top KPIs',
    },
    orders: {
      title: 'Orders Transaction Explorer',
      subtitle: 'Granular view of all customer orders, delivery tracking, and margins',
    },
    products: {
      title: 'Product Catalog & Inventory',
      subtitle: 'SKU performance, unit velocity, revenue generation, and stock health',
    },
    regional: {
      title: 'Geographic Regional Sales',
      subtitle: 'Metropolitan breakdown, cross-state performance, and order distribution',
    },
    insights: {
      title: 'Executive AI Briefing & Anomalies',
      subtitle: 'Automated executive summaries, growth drivers, and strategic insights',
    },
    settings: {
      title: 'Data Export & Configuration',
      subtitle: 'Download complete datasets and configure display parameters',
    },
  };

  const currentInfo = tabTitles[currentTab] || tabTitles.overview;

  const datePresets: { id: DateRangePreset; label: string }[] = [
    { id: 'all', label: 'All Time' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' },
    { id: 'ytd', label: 'Year-to-Date (2026)' },
    { id: '12m', label: 'Past 12 Months' },
  ];

  const handleExportCSV = () => {
    const csv = exportOrdersToCSV(filteredOrders);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ecommerce_analytics_${filters.dateRange}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 3000);
  };

  return (
    <header
      id="top-header"
      className="sticky top-0 z-30 bg-[#09090B]/90 backdrop-blur-md border-b border-white/10 transition-colors"
    >
      <div className="px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title and Breadcrumb */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-0.5">
            <span>Analytics Portal</span>
            <span>/</span>
            <span className="text-blue-400 capitalize">{currentTab}</span>
          </div>
          <h1 className="text-lg md:text-xl font-semibold tracking-tight text-[#FAFAFA] truncate">
            {currentInfo.title}
          </h1>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Search Bar */}
          <div className="relative min-w-[200px] lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              id="global-search-input"
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, customers, SKUs..."
              className="w-full pl-9 pr-7 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-mono"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Date Range Dropdown */}
          <div className="relative">
            <button
              id="date-range-toggle-btn"
              onClick={() => setIsDateMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white/5 border border-white/10 rounded-lg text-zinc-200 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {datePresets.find((p) => p.id === filters.dateRange)?.label || 'Date Range'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {isDateMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDateMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-52 bg-[#121215] rounded-xl shadow-2xl border border-white/15 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-zinc-500 border-b border-white/10 mb-1">
                    Select Time Horizon
                  </div>
                  {datePresets.map((preset) => {
                    const isSelected = filters.dateRange === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setDateRange(preset.id);
                          setIsDateMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-blue-600/20 text-blue-300 font-semibold'
                            : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span>{preset.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Refresh Data Button */}
          <button
            id="refresh-data-btn"
            onClick={refreshData}
            disabled={isRefreshing}
            className="p-1.5 text-zinc-400 hover:text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
            title="Refresh dataset and sync metrics"
            aria-label="Refresh Data"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          {/* CSV Export Button */}
          <button
            id="export-csv-header-btn"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.35)] transition-all active:scale-95"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* AI Insights Quick Jump */}
          <button
            id="quick-ai-insights-btn"
            onClick={() => setCurrentTab('insights')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/5 border border-white/10 text-zinc-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="View Executive AI Briefing"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">AI Briefing</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleDarkMode}
            className="p-1.5 text-zinc-400 hover:text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-300" />
            )}
          </button>
        </div>
      </div>

      {/* Export Toast Notification */}
      {showNotificationToast && (
        <div className="absolute right-6 top-16 bg-[#121215] text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-2xl border border-white/15 flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Export completed: {filteredOrders.length} records saved to CSV</span>
        </div>
      )}
    </header>
  );
};
