import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  MapPin,
  Sparkles,
  Download,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { NavigationTab } from '../types';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    filteredOrders,
    allOrders,
  } = useDashboard();

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders Explorer', icon: ShoppingBag, badge: filteredOrders.length },
    { id: 'products', label: 'Products & Performance', icon: Package },
    { id: 'regional', label: 'Regional Analytics', icon: MapPin },
    { id: 'insights', label: 'Executive Insights', icon: Sparkles, badge: 'AI' },
    { id: 'settings', label: 'Export & Settings', icon: Download },
  ];

  return (
    <aside
      id="sidebar-navigation"
      className={`relative flex flex-col border-r transition-all duration-300 ease-in-out bg-[#09090B] border-white/10 shrink-0 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-sm tracking-wider shadow-[0_0_15px_rgba(37,99,235,0.35)] shrink-0">
            P
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold tracking-tight text-[#FAFAFA] truncate">
                Pulse<span className="text-blue-500">.</span>Sales
              </span>
              <span className="text-[10px] font-medium text-zinc-500 truncate">
                Bento Intelligence
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          id="sidebar-collapse-btn"
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-white/5 transition-colors"
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Workspace Context Tag */}
      {!isSidebarCollapsed ? (
        <div className="px-3.5 py-2.5 mx-3 mt-3.5 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-xs font-medium text-zinc-200">
                Production Node
              </span>
            </div>
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-blue-600/10 text-blue-400 border border-blue-500/20">
              US-EAST
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 tabular-nums">
            {allOrders.length} transactions indexed
          </p>
        </div>
      ) : (
        <div className="flex justify-center mt-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected to Production Store" />
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto" aria-label="Main Navigation">
        {!isSidebarCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-medium uppercase tracking-widest text-zinc-500">
            Analytics Views
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                isActive
                  ? 'bg-white/10 text-white border border-white/10 shadow-xs'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-blue-400' : 'text-zinc-400 group-hover:text-white group-hover:scale-105'
                }`}
              />

              {!isSidebarCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {!isSidebarCollapsed && item.badge !== undefined && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md tabular-nums ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                      : typeof item.badge === 'string'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-white/5 text-zinc-400 border border-white/5'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip on collapse */}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-[#121215] text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-white/10 shadow-xl">
                  {item.label}
                  {item.badge !== undefined && ` (${item.badge})`}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Analyst Profile Summary */}
      <div className="p-3 border-t border-white/10 bg-[#09090B]">
        {!isSidebarCollapsed ? (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-xs">
                TD
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#09090B]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-white truncate">
                Twin Das
              </span>
              <span className="text-[10px] text-zinc-500 truncate">
                Lead Analyst
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
              AR
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
