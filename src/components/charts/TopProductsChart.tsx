import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency, formatNumber } from '../../utils/analytics';
import { Package, TrendingUp, Star } from 'lucide-react';

export const TopProductsChart: React.FC = () => {
  const { topProducts, setCategoryFilter } = useDashboard();

  const maxRevenue = topProducts.length > 0 ? Math.max(...topProducts.map((p) => p.revenue)) : 1;

  return (
    <div
      id="top-products-chart-card"
      className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Top 10 Products by Revenue
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Ranked catalog leaders, unit velocity, and profit margins
          </p>
        </div>
        <span className="text-[11px] font-mono font-medium px-2 py-0.5 bg-white/5 border border-white/10 text-zinc-300 rounded-md">
          {topProducts.length} Ranked
        </span>
      </div>

      {/* Top 10 Product Ranked List */}
      <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
        {topProducts.map((product, idx) => {
          const percentageOfMax = Math.round((product.revenue / maxRevenue) * 100);

          return (
            <div
              key={product.id}
              className="group p-2.5 rounded-lg border border-white/5 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-white/10 text-[11px] font-bold text-zinc-300 shrink-0 font-mono">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-medium text-white truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400">
                      <button
                        onClick={() => setCategoryFilter(product.category)}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        {product.category}
                      </button>
                      <span>•</span>
                      <span className="tabular-nums font-mono">{product.unitsSold} units</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-400 font-mono">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <div className="text-xs font-semibold text-white">
                    {formatCurrency(product.revenue)}
                  </div>
                  <span className="inline-block text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded mt-0.5">
                    {product.profitMargin}% margin
                  </span>
                </div>
              </div>

              {/* Progress Bar of Revenue */}
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentageOfMax}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
