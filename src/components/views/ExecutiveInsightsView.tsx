import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { AIExecutiveInsight } from '../../types';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BrainCircuit,
  ArrowUpRight,
  ArrowDownRight,
  RotateCw,
  Lightbulb,
} from 'lucide-react';
import { formatCurrency } from '../../utils/analytics';

export const ExecutiveInsightsView: React.FC = () => {
  const { filters, kpiSummary } = useDashboard();
  const [insight, setInsight] = useState<AIExecutiveInsight | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [generatingCustom, setGeneratingCustom] = useState<boolean>(false);

  const fetchInsight = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setInsight(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch AI insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsight();
  }, [filters]);

  const handleRegenerate = async () => {
    setGeneratingCustom(true);
    await fetchInsight();
    setGeneratingCustom(false);
  };

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-[#121218] to-[#09090b] text-white rounded-xl p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-400">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium uppercase tracking-wider bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-400/20">
                  Data Analyst Executive Brief
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-white mt-1">
                Strategic Intelligence & Growth Synthesis
              </h2>
            </div>
          </div>

          <button
            onClick={handleRegenerate}
            disabled={generatingCustom || loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${generatingCustom || loading ? 'animate-spin' : ''}`} />
            <span>Regenerate Synthesis</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-12 text-center text-zinc-400">
          <RotateCw className="w-6 h-6 animate-spin mx-auto text-blue-400 mb-3" />
          <p className="text-xs font-medium">Synthesizing multi-variable e-commerce telemetry...</p>
        </div>
      ) : insight ? (
        <div className="space-y-6">
          {/* Executive Headline & Summary */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              {insight.headline}
            </h3>
            <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
              {insight.summary}
            </p>
          </div>

          {/* Key Drivers & Anomalies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Growth Drivers */}
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
              <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Primary Growth Drivers
              </h4>

              <div className="space-y-3">
                {insight.keyDrivers.map((driver, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-white/[0.02] border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-white">
                        {driver.title}
                      </span>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                          driver.impact === 'positive'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-white/5 text-zinc-400 border border-white/10'
                        }`}
                      >
                        {driver.impact.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {driver.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Anomalies Detected */}
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
              <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Telemetry & Operational Anomalies
              </h4>

              <div className="space-y-3">
                {insight.anomaliesDetected.map((anomaly, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-white/[0.02] border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-white">
                        {anomaly.metric}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {anomaly.severity.toUpperCase()} RISK
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {anomaly.observation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strategic Recommendations */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-blue-400" />
              Prescriptive Recommendations for Revenue Expansion
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insight.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/20"
                >
                  <div className="flex items-center gap-2 text-blue-400 font-medium text-xs mb-1.5 font-mono">
                    <span>Action 0{idx + 1}</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
