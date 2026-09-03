/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { OverviewView } from './components/views/OverviewView';
import { OrdersView } from './components/views/OrdersView';
import { ProductsView } from './components/views/ProductsView';
import { RegionalView } from './components/views/RegionalView';
import { ExecutiveInsightsView } from './components/views/ExecutiveInsightsView';
import { SettingsExportView } from './components/views/SettingsExportView';
import { OrderDetailModal } from './components/OrderDetailModal';

const DashboardContent: React.FC = () => {
  const { currentTab, selectedOrder, setSelectedOrder } = useDashboard();

  const renderActiveView = () => {
    switch (currentTab) {
      case 'overview':
        return <OverviewView />;
      case 'orders':
        return <OrdersView />;
      case 'products':
        return <ProductsView />;
      case 'regional':
        return <RegionalView />;
      case 'insights':
        return <ExecutiveInsightsView />;
      case 'settings':
        return <SettingsExportView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#09090B] text-[#FAFAFA] overflow-hidden font-sans select-none">
      {/* 1. Sleek Bento Sidebar */}
      <Sidebar />

      {/* 2. Main Bento Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#09090B]">
        {/* Top Header */}
        <Header />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Global Filter Bar */}
          <FilterBar />

          {/* Active View */}
          <div className="animate-in fade-in duration-200">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* 3. Global Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
