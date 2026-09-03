import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Order,
  KPISummary,
  MonthlyTrendData,
  CategorySalesData,
  CitySalesData,
  TopProductData,
  OrderStatusData,
  FilterState,
  NavigationTab,
  DateRangePreset,
} from '../types';
import { INITIAL_ORDERS } from '../data/mockData';
import {
  filterOrders,
  calculateKPISummary,
  calculateMonthlyTrend,
  calculateCategoryBreakdown,
  calculateCitySales,
  calculateTopProducts,
  calculateOrderStatusDistribution,
} from '../utils/analytics';

interface DashboardContextType {
  // Navigation
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Global Filters
  filters: FilterState;
  setDateRange: (preset: DateRangePreset, start?: string | null, end?: string | null) => void;
  setCategoryFilter: (category: string) => void;
  setCityFilter: (city: string) => void;
  setStatusFilter: (status: string) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;

  // Chart Metric Mode (e.g. Revenue vs Profit vs Orders)
  chartMetric: 'revenue' | 'profit' | 'orders';
  setChartMetric: (metric: 'revenue' | 'profit' | 'orders') => void;

  // Selected Order for Modal / Drawer
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;

  // Analytics Computed Data
  kpiSummary: KPISummary;
  monthlyTrend: MonthlyTrendData[];
  categoryBreakdown: CategorySalesData[];
  citySales: CitySalesData[];
  topProducts: TopProductData[];
  orderStatus: OrderStatusData[];
  filteredOrders: Order[];
  allOrders: Order[];

  // State & Loading
  isLoading: boolean;
  isRefreshing: boolean;
  refreshData: () => Promise<void>;
  lastUpdated: Date;
}

const defaultFilters: FilterState = {
  dateRange: 'all',
  startDate: null,
  endDate: null,
  category: 'all',
  city: 'all',
  status: 'all',
  searchQuery: '',
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecom_analytics_theme');
      if (saved) return saved === 'dark';
      return true; // default dark for Bento Grid
    }
    return true;
  });

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [chartMetric, setChartMetric] = useState<'revenue' | 'profit' | 'orders'>('revenue');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Apply dark mode class to html document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ecom_analytics_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ecom_analytics_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // Filter setters
  const setDateRange = useCallback((preset: DateRangePreset, start: string | null = null, end: string | null = null) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: preset,
      startDate: start,
      endDate: end,
    }));
  }, []);

  const setCategoryFilter = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setCityFilter = useCallback((city: string) => {
    setFilters((prev) => ({ ...prev, city }));
  }, []);

  const setStatusFilter = useCallback((status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.dateRange !== 'all' ||
      filters.category !== 'all' ||
      filters.city !== 'all' ||
      filters.status !== 'all' ||
      filters.searchQuery.trim() !== ''
    );
  }, [filters]);

  // Compute analytics dynamically
  const filteredOrders = useMemo(() => {
    return filterOrders(orders, filters);
  }, [orders, filters]);

  const kpiSummary = useMemo(() => {
    return calculateKPISummary(filteredOrders, orders);
  }, [filteredOrders, orders]);

  const monthlyTrend = useMemo(() => {
    return calculateMonthlyTrend(filteredOrders);
  }, [filteredOrders]);

  const categoryBreakdown = useMemo(() => {
    return calculateCategoryBreakdown(filteredOrders);
  }, [filteredOrders]);

  const citySales = useMemo(() => {
    return calculateCitySales(filteredOrders);
  }, [filteredOrders]);

  const topProducts = useMemo(() => {
    return calculateTopProducts(filteredOrders);
  }, [filteredOrders]);

  const orderStatus = useMemo(() => {
    return calculateOrderStatusDistribution(filteredOrders);
  }, [filteredOrders]);

  // Refresh handler (fetches from /api/health or re-evaluates)
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/analytics/overview');
      if (res.ok) {
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.error('Refresh failed:', e);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        setLastUpdated(new Date());
      }, 400);
    }
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isDarkMode,
        toggleDarkMode,
        filters,
        setDateRange,
        setCategoryFilter,
        setCityFilter,
        setStatusFilter,
        setSearchQuery,
        resetFilters,
        hasActiveFilters,
        chartMetric,
        setChartMetric,
        selectedOrder,
        setSelectedOrder,
        kpiSummary,
        monthlyTrend,
        categoryBreakdown,
        citySales,
        topProducts,
        orderStatus,
        filteredOrders,
        allOrders: orders,
        isLoading,
        isRefreshing,
        refreshData,
        lastUpdated,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export function useDashboard(): DashboardContextType {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
