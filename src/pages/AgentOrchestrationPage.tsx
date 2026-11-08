import { useState, useEffect, useRef, useCallback } from 'react';
import {
  UserRound, LineChart, Truck, Warehouse, BrainCircuit, Zap, RotateCcw,
  CheckCircle2, Loader2, Clock, ArrowDown, Sparkles,
} from 'lucide-react';
import { useApp } from '@/lib/appContext';
import { buildContext, AGENTS, agentDetails, type DecisionContext } from '@/lib/agents';
import type { AgentStep } from '@/lib/types';
import { formatINR } from '@/lib/format';
import { Card, Chip, SimBadge, SectionTitle } from '@/components/ui';
import { classNames } from '@/lib/format';

const ICONS: Record<string, typeof UserRound> = {
  UserRound, LineChart, Truck, Warehouse, BrainCircuit,
};

type RunState = 'idle' | 'running' | 'done';

export function AgentOrchestrationPage() {
  const { farmer, loadDemoFarmer, resetFarmer, isDemoMode, setPage, lang } = useApp();
  const ctx = buildContext(farmer);
  const [runState, setRunState] = useState<RunState>('idle');
  const [activeStep, setActiveStep] = useState(-1);
  const [steps, setSteps] = useState<AgentStep[]>(() => initSteps(ctx));
  const timerRef = useRef<number[]>([]);

  // Keep steps in sync with farmer context when not running
  useEffect(() => {
    if (runState !== 'running') {
      setSteps(initSteps(ctx));
    }
  }, [farmer, runState]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearTimers = () => {
    timerRef.current.forEach((t) => clearTimeout(t));
    timerRef.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const runDemo = useCallback(() => {
    clearTimers();
    loadDemoFarmer();
    setRunState('running');
    setActiveStep(0);
    setSteps(initSteps(buildContext({ ...farmer, onboarded: true })));

    // Animate through each agent
    const stepDelay = 1100;
    for (let i = 0; i < AGENTS.length; i++) {
      const t = window.setTimeout(() => {
        setActiveStep(i);
        setSteps((prev) => prev.map((s, idx) => ({
          ...s,
          status: idx < i ? 'completed' : idx === i ? 'processing' : 'waiting',
        })));
      }, i * stepDelay);
      timerRef.current.push(t);
    }
    // Complete all
    const done = window.setTimeout(() => {
      setSteps((prev) => prev.map((s) => ({ ...s, status: 'completed' })));
      setActiveStep(AGENTS.length);
      setRunState('done');
    }, AGENTS.length * stepDelay + 400);
    timerRef.current.push(done);
  }, [farmer, loadDemoFarmer]);

  const reset = useCallback(() => {
    clearTimers();
    setRunState('idle');
    setActiveStep(-1);
    setSteps(initSteps(ctx));
  }, [ctx]); // eslint-disable-line react-hooks/exhaustive-deps

  const details = agentDetails(ctx);

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <SectionTitle
            eyebrow="Core differentiator"
            title="Agent Orchestration Centre"
            desc="Five specialised AI agents pass structured results to each other through a shared decision context."
          />
        </div>
        <div className="flex gap-2">
          <button onClick={runDemo} disabled={runState === 'running'} className="btn-primary">
            <Zap size={18} /> {isDemoMode || runState === 'done' ? 'Re-run Demo' : 'Run Live AI Decision Demo'}
          </button>
          <button onClick={reset} className="btn-secondary">
            <RotateCcw size={18} /> Reset
          </button>
        </div>
      </div>

      {/* Demo status banner */}
      {(isDemoMode || runState === 'running' || runState === 'done') && (
        <Card className="flex items-center gap-3 p-4" >
          <div className={classNames(
            'grid h-10 w-10 place-items-center rounded-xl',
            runState === 'running' ? 'bg-amber-100 text-amber-600' : 'bg-forest-100 text-forest-600'
          )}>
            {runState === 'running' ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
          </div>
          <div className="flex-1">
            <div className="font-display text-sm font-bold text-forest-900">
              {runState === 'running' ? 'AI agents are analysing your harvest decision…' : runState === 'done' ? 'Decision workflow complete' : 'Demo farmer loaded'}
            </div>
            <div className="text-xs text-forest-500">
              Sample farmer: {farmer.name || 'Ramesh'} • {farmer.district} • {farmer.crop} • {farmer.quantityQuintals} quintals
            </div>
          </div>
          <SimBadge />
        </Card>
      )}

      {/* Workflow pipeline */}
      <Card className="p-5 md:p-6">
        <h3 className="font-display font-bold text-forest-900 mb-4">Agent Workflow</h3>
        <div className="flex flex-col gap-3">
          {AGENTS.map((agent, i) => {
            const Icon = ICONS[agent.icon] ?? UserRound;
            const step = steps[i];
            const isActive = activeStep === i;
            const isDone = step?.status === 'completed' || (runState === 'idle' && farmer.onboarded);
            const isProcessing = step?.status === 'processing' || (runState === 'running' && isActive && !isDone);
            return (
              <div key={agent.id}>
                <div
                  className={classNames(
                    'flex items-center gap-4 rounded-2xl border p-4 transition-all duration-500',
                    isProcessing ? 'border-forest-300 bg-forest-50 shadow-glow scale-[1.01]'
                    : isDone ? 'border-forest-100 bg-white'
                    : 'border-forest-50 bg-cream-50/40 opacity-60'
                  )}
                >
                  <div className={classNames(
                    'grid h-12 w-12 shrink-0 place-items-center rounded-xl transition',
                    isProcessing ? 'bg-forest-600 text-white'
                    : isDone ? 'bg-forest-200 text-forest-900'
                    : 'bg-forest-100 text-forest-400'
                  )}>
                    {isProcessing ? <Loader2 size={22} className="animate-spin" /> : isDone ? <CheckCircle2 size={22} /> : <Icon size={22} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-forest-400">AGENT {i + 1}</span>
                      <span className="font-display text-sm font-bold text-forest-900">{agent.name}</span>
                      {isProcessing && <Chip tone="amber">Processing</Chip>}
                      {isDone && runState !== 'idle' && <Chip tone="green">Completed</Chip>}
                      {runState === 'idle' && farmer.onboarded && <Chip tone="lime">Ready</Chip>}
                    </div>
                    <p className="text-xs text-forest-500 mt-0.5">{agent.role}</p>
                    {step && (isDone || isProcessing) && (
                      <p className="text-xs text-forest-600 mt-1.5 font-medium">{step.summary}</p>
                    )}
                  </div>
                  <div className="hidden text-right md:block">
                    <StatusBadge status={isProcessing ? 'processing' : isDone ? 'completed' : 'waiting'} />
                  </div>
                </div>
                {i < AGENTS.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown size={16} className={classNames(
                      'transition',
                      activeStep > i ? 'text-forest-400' : 'text-forest-200'
                    )} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Detailed agent inputs/outputs */}
      <div className="grid gap-4 md:grid-cols-2">
        {details.map((d, i) => {
          const Icon = ICONS[AGENTS[i].icon] ?? UserRound;
          return (
            <Card key={d.id} className="p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-forest-100 text-forest-600">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-forest-400">AGENT {i + 1}</div>
                  <div className="font-display text-sm font-bold text-forest-900">{d.name}</div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-forest-400 mb-1">Inputs</div>
                  <div className="flex flex-wrap gap-1.5">
                    {d.inputs.map((s, j) => (
                      <span key={j} className="rounded-lg bg-cream-50 px-2 py-1 text-xs text-forest-700 border border-forest-50">{s}</span>
                    ))}
                  </div>
                </div>

                {d.calculations.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-forest-400 mb-1">Calculations</div>
                    <div className="grid grid-cols-2 gap-2">
                      {d.calculations.map((c, j) => (
                        <div key={j} className="rounded-lg bg-forest-50 px-2.5 py-1.5">
                          <div className="text-[10px] text-forest-500">{c.label}</div>
                          <div className="text-sm font-bold text-forest-900">{c.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-forest-400 mb-1">Outputs</div>
                  <div className="space-y-1">
                    {d.outputs.slice(0, 5).map((s, j) => (
                      <div key={j} className="flex items-start gap-1.5 text-xs text-forest-700">
                        <CheckCircle2 size={12} className="text-forest-400 mt-0.5 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Final recommendation */}
      {runState === 'done' && ctx.recommendation && (
        <Card className="overflow-hidden p-0 animate-scale-in">
          <div className="bg-gradient-to-br from-forest-900 to-forest-700 p-6 text-white">
            <div className="flex items-center gap-2 text-forest-200">
              <Sparkles size={18} /> <span className="text-xs font-bold uppercase tracking-wide">Final Recommendation</span>
            </div>
            <div className="mt-2 font-display text-xl font-extrabold">{ctx.recommendation.marketName}</div>
            <div className="mt-1 text-3xl font-extrabold">{formatINR(ctx.recommendation.netEarnings)}</div>
            <div className="text-sm text-forest-100/70">estimated net earnings for {farmer.quantityQuintals} quintals</div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setPage('recommendation')} className="rounded-lg bg-forest-200 px-4 py-2 text-sm font-bold text-forest-900 hover:bg-forest-100">
                View full recommendation
              </button>
              <button onClick={() => setPage('calculator')} className="rounded-lg bg-forest-800/60 px-4 py-2 text-sm font-semibold text-white ring-1 ring-forest-700/40 hover:bg-forest-800">
                Open calculator
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function initSteps(ctx: DecisionContext): AgentStep[] {
  // When idle & onboarded, show ready state (not "completed")
  return AGENTS.map((a) => ({
    id: a.id,
    label: a.name,
    status: 'waiting',
    summary: '',
    output: [],
  }));
}

function StatusBadge({ status }: { status: 'waiting' | 'processing' | 'completed' }) {
  if (status === 'processing') return <Chip tone="amber"><Loader2 size={10} className="animate-spin" /> Processing</Chip>;
  if (status === 'completed') return <Chip tone="green"><CheckCircle2 size={10} /> Done</Chip>;
  return <Chip tone="neutral"><Clock size={10} /> Waiting</Chip>;
}
