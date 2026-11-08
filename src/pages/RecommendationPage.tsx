import {
  Sparkles, Trophy, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw,
  Store, Warehouse, Calculator, ShieldCheck, Lightbulb, TrendingUp, Scale,
} from 'lucide-react';
import { useApp } from '@/lib/appContext';
import { buildContext } from '@/lib/agents';
import { formatINR, classNames } from '@/lib/format';
import { Card, Chip, SimBadge, SectionTitle, ProgressBar } from '@/components/ui';

export function RecommendationPage() {
  const { farmer, setPage, loadDemoFarmer } = useApp();
  const ctx = buildContext(farmer);
  const rec = ctx.recommendation;
  const best = ctx.best;
  const sorted = [...ctx.earnings].sort((a, b) => b.netEarnings - a.netEarnings);
  const upScenario = ctx.storage?.storeScenarios.find((s) => s.label === 'Prices rise 20%');

  const confidencePct = rec?.confidence === 'high' ? 85 : rec?.confidence === 'medium' ? 60 : 35;

  return (
    <div className="space-y-6 py-6">
      <SectionTitle
        eyebrow="AI Recommendation Centre"
        title="Your Best Selling Opportunity"
        desc="An explainable recommendation built from five coordinated AI agents. Transparent calculations — the final decision is always yours."
      />

      {/* Hero recommendation */}
      <Card className="overflow-hidden p-0">
        <div className="relative bg-gradient-to-br from-forest-900 via-forest-800 to-forest-700 p-6 md:p-8 text-white">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-forest-200/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-forest-200">
              <Sparkles size={18} /> <span className="text-xs font-bold uppercase tracking-wide">Recommendation</span>
            </div>
            <div className="mt-3 font-display text-2xl font-extrabold md:text-3xl">{rec?.marketName}</div>
            <p className="mt-1 text-forest-100/70 max-w-xl">
              {rec?.marketName} offers a competitive estimated net return after transportation and other expenses.
            </p>
            <div className="mt-5 flex flex-wrap items-end gap-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-forest-200/60">Estimated net earnings</div>
                <div className="font-display text-4xl font-extrabold">{formatINR(rec?.netEarnings ?? 0)}</div>
                <div className="text-xs text-forest-100/50">for {farmer.quantityQuintals} quintals of {farmer.crop}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-forest-200/60">Selling price</div>
                <div className="font-display text-2xl font-bold">₹{best.pricePerQuintal}/quintal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Confidence */}
        <div className="p-5 md:p-6 border-t border-forest-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-forest-600" />
              <span className="font-display text-sm font-bold text-forest-900">Confidence indicator</span>
              <Chip tone={rec?.confidence === 'high' ? 'green' : rec?.confidence === 'medium' ? 'amber' : 'red'}>
                {rec?.confidence}
              </Chip>
            </div>
            <span className="text-sm font-bold text-forest-700">{confidencePct}%</span>
          </div>
          <ProgressBar pct={confidencePct} tone={rec?.confidence === 'high' ? 'green' : 'amber'} />
          <p className="mt-2 text-xs text-forest-500">{rec?.confidenceNote}</p>
        </div>
      </Card>

      {/* Why selected */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={18} className="text-forest-600" />
            <h3 className="font-display font-bold text-forest-900">Why this market was selected</h3>
          </div>
          <div className="space-y-3">
            {rec?.reasons.map((r, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-forest-500 shrink-0 mt-0.5" />
                <p className="text-sm text-forest-700 leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-amber-600" />
            <h3 className="font-display font-bold text-forest-900">Risks to consider</h3>
          </div>
          <div className="space-y-3">
            {rec?.risks.map((r, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                <p className="text-sm text-forest-700 leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Transparent calculations */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-forest-600" />
            <h3 className="font-display font-bold text-forest-900">Transparent calculations</h3>
          </div>
          <SimBadge />
        </div>
        <div className="space-y-3">
          {sorted.map((r, i) => {
            const isBest = r.marketId === best.marketId;
            return (
              <div key={r.marketId} className={classNames('rounded-xl p-4', isBest ? 'bg-forest-50 ring-1 ring-forest-200' : 'bg-cream-50/50')}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-forest-900 text-xs font-bold text-forest-200">{i + 1}</span>
                    <span className="font-display font-bold text-forest-900 text-sm">{r.marketName}</span>
                    {isBest && <Chip tone="green"><Trophy size={10} /> Best</Chip>}
                  </div>
                  <span className="font-display text-lg font-extrabold text-forest-900">{formatINR(r.netEarnings)}</span>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-forest-600 pl-9">
                  <span>Gross: <strong className="text-forest-800">{formatINR(r.grossRevenue)}</strong></span>
                  <span>Transport: <strong>−{formatINR(r.transport)}</strong></span>
                  <span>Loading: <strong>−{formatINR(r.loading)}</strong></span>
                  <span>Commission: <strong>−{formatINR(r.commission)}</strong></span>
                  <span>Expenses: <strong className="text-forest-800">{formatINR(r.totalExpenses)}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Alternatives */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Scale size={18} className="text-forest-600" />
          <h3 className="font-display font-bold text-forest-900">Alternatives available</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {rec?.alternatives.map((a, i) => (
            <div key={i} className="rounded-xl border border-forest-50 bg-cream-50/40 p-4">
              <div className="text-[10px] font-bold uppercase tracking-wide text-forest-400">Option {i + 1}</div>
              <p className="mt-1 text-sm text-forest-700 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Storage hint */}
      {upScenario && upScenario.deltaVsSellNow > 0 && (
        <Card className="flex items-start gap-3 p-5 border-amber-200 bg-amber-50/40">
          <TrendingUp size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-display text-sm font-bold text-amber-800">Storage could be worth exploring</div>
            <p className="mt-1 text-sm text-amber-700">
              If you store for 7 days and prices rise 20%, you could net {formatINR(upScenario.netEarnings)} — that's {formatINR(upScenario.deltaVsSellNow)} more. But this is uncertain and storage adds cost.
            </p>
            <button onClick={() => setPage('storage')} className="mt-2 text-sm font-bold text-amber-800 underline">
              Compare storage scenarios →
            </button>
          </div>
        </Card>
      )}

      {/* Action buttons */}
      <Card className="p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm text-forest-600">
            <Store size={16} className="text-forest-400" />
            The final decision is always yours. AgriTech AI recommends, explains, and assists — it never sells for you.
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setPage('market')} className="btn-secondary">
              <Store size={16} /> Compare markets
            </button>
            <button onClick={() => setPage('storage')} className="btn-secondary">
              <Warehouse size={16} /> Storage options
            </button>
            <button onClick={() => setPage('calculator')} className="btn-secondary">
              <Calculator size={16} /> Recalculate
            </button>
            <button onClick={() => { loadDemoFarmer(); setPage('agents'); }} className="btn-primary">
              <RotateCcw size={16} /> Re-run demo
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
