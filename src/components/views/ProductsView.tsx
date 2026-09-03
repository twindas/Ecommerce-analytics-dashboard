import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { PRODUCTS_CATALOG } from '../../data/mockData';
import { formatCurrency, formatNumber } from '../../utils/analytics';
import { Package, Star, TrendingUp, AlertTriangle, CheckCircle, Search, Tag } from 'lucide-react';

export const ProductsView: React.FC = () => {
  const { topProducts, setCategoryFilter } = useDashboard();
  const [productSearch, setProductSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const filteredCatalog = PRODUCTS_CATALOG.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = selectedCat === 'all' || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const categories = Array.from(new Set(PRODUCTS_CATALOG.map((p) => p.category)));

  return (
    <div className="space-y-6">
      {/* Product Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.03] p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search products by title, SKU, category..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#121215] border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-400">Category:</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="text-xs bg-[#121215] border border-white/10 rounded-lg px-2.5 py-1.5 text-zinc-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCatalog.map((product) => {
          const perf = topProducts.find((p) => p.id === product.id);
          const margin = Math.round(((product.unitPrice - product.cost) / product.unitPrice) * 1000) / 10;
          const isLowStock = product.stock < 50;

          return (
            <div
              key={product.id}
              className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {product.id}
                  </span>
                  <span className="text-[11px] font-medium text-zinc-400">
                    {product.category}
                  </span>
                </div>

                <h3 className="text-sm font-medium text-white mb-2 leading-snug">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mb-4 text-xs">
                  <div className="flex items-center gap-1 text-amber-400 font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-zinc-700">|</span>
                  <span className="text-zinc-400 font-mono">
                    Margin: <strong className="text-emerald-400">{margin}%</strong>
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Retail Unit Price:</span>
                  <span className="font-semibold text-white">
                    {formatCurrency(product.unitPrice)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Production Cost:</span>
                  <span className="text-zinc-300">
                    {formatCurrency(product.cost)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    {isLowStock ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        <AlertTriangle className="w-3 h-3" /> Low Stock ({product.stock})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" /> In Stock ({product.stock})
                      </span>
                    )}
                  </div>

                  {perf && (
                    <span className="font-mono text-[11px] text-blue-400 font-medium">
                      {perf.unitsSold} sold
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
