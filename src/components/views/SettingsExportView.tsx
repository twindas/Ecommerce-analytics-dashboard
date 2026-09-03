import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { exportOrdersToCSV } from '../../utils/analytics';
import { Download, FileSpreadsheet, FileJson, CheckCircle2, Shield, Database, RefreshCcw } from 'lucide-react';

export const SettingsExportView: React.FC = () => {
  const { filteredOrders, allOrders, refreshData, isRefreshing } = useDashboard();
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  const handleDownloadCSV = () => {
    const csv = exportOrdersToCSV(filteredOrders);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ecommerce_sales_dataset_${Date.now()}.csv`;
    link.click();
    setDownloadedFormat('CSV');
    setTimeout(() => setDownloadedFormat(null), 3000);
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(filteredOrders, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ecommerce_sales_dataset_${Date.now()}.json`;
    link.click();
    setDownloadedFormat('JSON');
    setTimeout(() => setDownloadedFormat(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV Export Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">
                  Comma-Separated Values (.CSV)
                </h3>
                <p className="text-xs text-zinc-500">Universal spreadsheet & Excel compatibility</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Exports all {filteredOrders.length} active filtered orders with full columns: Order ID,
              Customer, Product, Category, City, State, Date, Unit Price, Revenue, Cost, Profit, and
              Status.
            </p>
          </div>

          <button
            onClick={handleDownloadCSV}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Dataset ({filteredOrders.length} records)</span>
          </button>
        </div>

        {/* JSON Export Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <FileJson className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">
                  Structured JSON Payload (.JSON)
                </h3>
                <p className="text-xs text-zinc-500">For programmatic data modeling & BI pipelines</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Formatted JSON data structure with typed key-value pairs suitable for import into
              Tableau, PowerBI, Python pandas, or external data warehouses.
            </p>
          </div>

          <button
            onClick={handleDownloadJSON}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download JSON Payload</span>
          </button>
        </div>
      </div>

      {downloadedFormat && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Success: Downloaded {downloadedFormat} export package successfully.</span>
        </div>
      )}

      {/* Dataset Health & Schema Information */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 space-y-4">
        <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          Dataset Architecture & Schema Reference
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <div className="text-zinc-500">Total Records</div>
            <div className="text-base font-semibold text-white mt-1">
              {allOrders.length} orders
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <div className="text-zinc-500">Temporal Coverage</div>
            <div className="text-base font-semibold text-white mt-1">
              Past 12 Months
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <div className="text-zinc-500">API Endpoint</div>
            <div className="text-base font-semibold text-blue-400 mt-1">
              /api/analytics/overview
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500">
          <span>Production Node.js + Express Backend Engine</span>
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Re-sync telemetry database</span>
          </button>
        </div>
      </div>
    </div>
  );
};
