import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface KPICardProps {
  id: string;
  title: string;
  value: string;
  change: number; // percentage (e.g. 14.8 or -2.4)
  changePeriod?: string;
  icon: React.ElementType;
  sparklineData?: number[];
  accentColor?: 'indigo' | 'emerald' | 'sky' | 'violet' | 'amber' | 'rose';
  secondaryText?: string;
  highlight?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  id,
  title,
  value,
  change,
  changePeriod = 'vs previous period',
  icon: Icon,
  sparklineData = [],
  accentColor = 'indigo',
  secondaryText,
  highlight = false,
}) => {
  const isPositive = change >= 0;

  // Render SVG mini sparkline path
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;
    const max = Math.max(...sparklineData, 1);
    const min = Math.min(...sparklineData, 0);
    const range = max - min || 1;
    const width = 80;
    const height = 28;

    const points = sparklineData.map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    });

    const pathD = `M ${points.join(' L ')}`;

    const strokeColors: Record<string, string> = {
      indigo: '#6366f1',
      emerald: '#10b981',
      sky: '#0ea5e9',
      violet: '#8b5cf6',
      amber: '#f59e0b',
      rose: '#f43f5e',
    };

    const stroke = strokeColors[accentColor] || '#6366f1';

    return (
      <svg width={width} height={height} className="overflow-visible shrink-0">
        <path
          d={pathD}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const iconStyles: Record<string, string> = {
    indigo: 'bg-blue-600/10 text-blue-400 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    sky: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    violet: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const strokeColors: Record<string, string> = {
    indigo: '#3b82f6',
    emerald: '#10b981',
    sky: '#0ea5e9',
    violet: '#a855f7',
    amber: '#f59e0b',
    rose: '#f43f5e',
  };

  return (
    <div
      id={id}
      className={`group relative bg-white/[0.03] border rounded-xl p-5 transition-all duration-200 hover:bg-white/[0.05] hover:border-white/20 ${
        highlight
          ? 'border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20'
          : 'border-white/10'
      }`}
    >
      {/* Header: Label & Icon */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2 rounded-lg border ${iconStyles[accentColor]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <div className="text-2xl font-bold tracking-tight text-[#FAFAFA] tabular-nums font-mono">
          {value}
        </div>
        {renderSparkline()}
      </div>

      {/* Footer: Trend Badge & Subtitle */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-0.5 font-medium px-2 py-0.5 rounded-full text-[11px] tabular-nums border ${
              isPositive
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-3 h-3 text-rose-400" />
            )}
            {isPositive ? `+${change}%` : `${change}%`}
          </span>
          <span className="text-[11px] text-zinc-500 hidden sm:inline truncate">
            {changePeriod}
          </span>
        </div>

        {secondaryText && (
          <span className="text-[11px] font-medium text-zinc-400 tabular-nums truncate">
            {secondaryText}
          </span>
        )}
      </div>
    </div>
  );
};
