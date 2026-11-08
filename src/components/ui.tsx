import type { ReactNode } from 'react';
import { classNames } from '@/lib/format';

export function Card({ children, className, cream }: { children: ReactNode; className?: string; cream?: boolean }) {
  return (
    <div className={classNames(cream ? 'card-cream' : 'card', className)}>{children}</div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  desc,
  center,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? 'text-center max-w-2xl mx-auto' : ''}>
      {eyebrow && (
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-forest-400">{eyebrow}</div>
      )}
      <h2 className="font-display text-2xl md:text-3xl font-extrabold text-forest-900 text-balance">{title}</h2>
      {desc && <p className="mt-2 text-forest-600 text-sm md:text-base leading-relaxed text-balance">{desc}</p>}
    </div>
  );
}

export function Stat({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  accent?: 'green' | 'lime' | 'amber' | 'red';
  icon?: ReactNode;
}) {
  const accentBg =
    accent === 'lime' ? 'bg-forest-200/40 text-forest-700'
    : accent === 'amber' ? 'bg-amber-100 text-amber-700'
    : accent === 'red' ? 'bg-rose-100 text-rose-700'
    : 'bg-forest-100 text-forest-600';
  return (
    <div className="flex items-start gap-3">
      {icon && <div className={classNames('grid h-10 w-10 place-items-center rounded-xl', accentBg)}>{icon}</div>}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-forest-500">{label}</div>
        <div className="font-display text-xl font-bold text-forest-900">{value}</div>
        {sub && <div className="text-xs text-forest-500 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

export function Chip({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: 'neutral' | 'green' | 'lime' | 'amber' | 'red' | 'blue';
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-forest-50 text-forest-700',
    green: 'bg-forest-600 text-white',
    lime: 'bg-forest-200/50 text-forest-800',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-rose-100 text-rose-700',
    blue: 'bg-sky-100 text-sky-700',
  };
  return <span className={classNames('chip', tones[tone], className)}>{children}</span>;
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={classNames('inline-flex items-center gap-1.5 rounded-full bg-forest-900/5 px-3 py-1 text-xs font-semibold text-forest-700', className)}>
      {children}
    </span>
  );
}

export function SimBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Simulated demo data
    </span>
  );
}

export function ProgressBar({ pct, tone = 'green' }: { pct: number; tone?: 'green' | 'lime' | 'amber' }) {
  const color = tone === 'amber' ? 'bg-amber-500' : tone === 'lime' ? 'bg-forest-200' : 'bg-forest-500';
  return (
    <div className="h-2 w-full rounded-full bg-forest-50 overflow-hidden">
      <div className={classNames('h-full rounded-full transition-all duration-700', color)} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  );
}

export function EmptyState({ icon, title, desc, action }: { icon?: ReactNode; title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-forest-100 bg-cream-50/50 px-6 py-12 text-center">
      {icon && <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-forest-50 text-forest-400">{icon}</div>}
      <h3 className="font-display font-bold text-forest-800">{title}</h3>
      {desc && <p className="mt-1 text-sm text-forest-500 max-w-sm">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
