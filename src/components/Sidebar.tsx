import { useState } from 'react';
import {
  Home, LayoutDashboard, Mic, Bot, Store, Calculator, Warehouse, Sparkles, UserCircle, Menu, X, Zap,
} from 'lucide-react';
import { useApp } from '@/lib/appContext';
import { t } from '@/lib/i18n';
import type { PageKey } from '@/lib/types';
import { Logo } from './Logo';
import { classNames } from '@/lib/format';

const NAV: { key: PageKey; icon: typeof Home; labelKey: string }[] = [
  { key: 'landing', icon: Home, labelKey: 'nav_landing' },
  { key: 'dashboard', icon: LayoutDashboard, labelKey: 'nav_dashboard' },
  { key: 'voice', icon: Mic, labelKey: 'nav_voice' },
  { key: 'agents', icon: Bot, labelKey: 'nav_agents' },
  { key: 'market', icon: Store, labelKey: 'nav_market' },
  { key: 'calculator', icon: Calculator, labelKey: 'nav_calculator' },
  { key: 'storage', icon: Warehouse, labelKey: 'nav_storage' },
  { key: 'recommendation', icon: Sparkles, labelKey: 'nav_recommendation' },
  { key: 'profile', icon: UserCircle, labelKey: 'nav_profile' },
];

export function Sidebar() {
  const { page, setPage, lang, farmer, loadDemoFarmer, isDemoMode } = useApp();
  const [open, setOpen] = useState(false);

  const go = (p: PageKey) => {
    setPage(p);
    setOpen(false);
  };

  const navItems = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = page === item.key;
        return (
          <button
            key={item.key}
            onClick={() => go(item.key)}
            className={classNames(
              'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all',
              active
                ? 'bg-forest-200/15 text-white shadow-sm'
                : 'text-forest-100/70 hover:bg-forest-800/60 hover:text-white'
            )}
          >
            <Icon size={18} className={active ? 'text-forest-200' : 'text-forest-100/60 group-hover:text-forest-200'} />
            <span className="truncate">{t(item.labelKey, lang)}</span>
            {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-forest-200" />}
          </button>
        );
      })}
    </nav>
  );

  const demoCard = (
    <div className="rounded-2xl bg-forest-800/60 p-4 border border-forest-700/40">
      <div className="flex items-center gap-2 text-forest-200">
        <Zap size={16} className="text-forest-200" />
        <span className="text-xs font-bold uppercase tracking-wide">Judge Demo</span>
      </div>
      <p className="mt-1.5 text-xs text-forest-100/60 leading-relaxed">
        Run the full AI decision workflow with a preloaded sample farmer.
      </p>
      <button
        onClick={() => { loadDemoFarmer(); go('agents'); }}
        className="mt-3 w-full rounded-lg bg-forest-200 px-3 py-2 text-sm font-bold text-forest-900 transition hover:bg-forest-100"
      >
        Run Live AI Decision Demo
      </button>
      {isDemoMode && (
        <div className="mt-2 text-center text-[10px] font-semibold uppercase tracking-wide text-forest-200/70">
          Demo mode active
        </div>
      )}
    </div>
  );

  const profileChip = farmer.onboarded ? (
    <div className="flex items-center gap-3 rounded-xl bg-forest-800/40 p-3">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-forest-200 text-sm font-bold text-forest-900">
        {farmer.name.charAt(0).toUpperCase() || 'F'}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-white">{farmer.name || 'Guest'}</div>
        <div className="truncate text-xs text-forest-100/60">{farmer.district} • {farmer.crop}</div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-forest-900 px-4 py-3 lg:hidden">
        <button onClick={() => go('landing')}><Logo size="sm" light /></button>
        <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-white hover:bg-forest-800">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-forest-900 p-4 overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <Logo light />
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 text-forest-100/70 hover:bg-forest-800">
                <X size={20} />
              </button>
            </div>
            {profileChip}
            <div className="mt-4">{navItems}</div>
            <div className="mt-6">{demoCard}</div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-forest-900 px-4 py-6 overflow-y-auto scrollbar-thin">
        <button onClick={() => go('landing')} className="mb-8">
          <Logo light />
        </button>
        {profileChip}
        <div className="mt-5 flex-1">{navItems}</div>
        <div className="mt-4">{demoCard}</div>
        <div className="mt-4 text-center text-[10px] text-forest-100/40">
          Team VYRON • TECH4BHARAT 2026
        </div>
      </aside>
    </>
  );
}
