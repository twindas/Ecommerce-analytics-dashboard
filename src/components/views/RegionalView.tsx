import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency, formatNumber } from '../../utils/analytics';
import { CitySalesChart } from '../charts/CitySalesChart';
import { MapPin, Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

export const RegionalView: React.FC = () => {
  const { citySales, setCityFilter, filters } = useDashboard();

  return (
    <div className="space-y-6">
      {/* Top Regional Chart */}
      <CitySalesChart />

      {/* City Breakdown Grid */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Metropolitan Regional Performance Metrics
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Comprehensive revenue and basket size breakdown across target US markets
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {citySales.map((city) => {
            const isSelected = filters.city === city.city;

            return (
              <button
                key={city.city}
                onClick={() => setCityFilter(isSelected ? 'all' : city.city)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500/40 text-white'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-zinc-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-sm font-medium text-white">
                        {city.city}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 bg-white/5 border border-white/10 text-zinc-300 rounded">
                      {city.state}
                    </span>
                  </div>

                  <div className="text-lg font-semibold text-white font-mono mt-2">
                    {formatCurrency(city.revenue)}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-white/5 space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Order Volume:</span>
                    <span className="font-semibold text-white">
                      {city.orders} orders
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Avg Order Value:</span>
                    <span className="font-semibold text-emerald-400">
                      {formatCurrency(city.avgOrderValue)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Market Share:</span>
                    <span className="text-blue-400 font-medium">
                      {city.percentage}%
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
