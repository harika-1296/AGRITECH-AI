import { ArrowRight, Sparkles, Store, Calculator, Warehouse, Mic, Bot, ChevronRight, BadgeCheck, Zap } from 'lucide-react';
import { useApp } from '@/lib/appContext';
import { t } from '@/lib/i18n';
import { Logo } from '@/components/Logo';
import { Card, SimBadge, SectionTitle } from '@/components/ui';

const HERO_IMG = 'https://images.pexels.com/photos/2382904/pexels-photo-2382904.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const TOMATO_IMG = 'https://images.pexels.com/photos/37408649/pexels-photo-37408649.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export function LandingPage() {
  const { setPage, lang, farmer } = useApp();

  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-forest-900 text-white">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-forest-200/10 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-forest-500/20 blur-3xl" />
        <div className="relative grid gap-10 px-6 py-12 md:px-12 md:py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-forest-200/15 px-3 py-1.5 text-xs font-semibold text-forest-200 ring-1 ring-forest-200/20">
              <Sparkles size={14} /> Agentic AI for Indian Agriculture
            </div>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] text-balance md:text-5xl">
              {t('hero_title', lang)}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-forest-100/70 md:text-lg">
              {t('hero_sub', lang)}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => setPage(farmer.onboarded ? 'dashboard' : 'onboarding')}
                className="inline-flex items-center gap-2 rounded-xl bg-forest-200 px-6 py-3.5 font-bold text-forest-900 shadow-glow transition hover:bg-forest-100 active:scale-[0.98]"
              >
                {t('get_started', lang)} <ArrowRight size={18} />
              </button>
              <button
                onClick={() => setPage('agents')}
                className="inline-flex items-center gap-2 rounded-xl bg-forest-800/60 px-6 py-3.5 font-semibold text-white ring-1 ring-forest-700/40 transition hover:bg-forest-800 active:scale-[0.98]"
              >
                {t('explore', lang)} <ChevronRight size={18} />
              </button>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-forest-100/50">
              <BadgeCheck size={14} className="text-forest-200" />
              Telangana pilot • Tomatoes • Multilingual (Telugu / English / Hindi)
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-cardLg ring-1 ring-forest-700/30">
              <img src={HERO_IMG} alt="Indian farmers harvesting in green fields" className="h-72 w-full object-cover md:h-96" />
            </div>
            <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white p-4 shadow-cardLg animate-float">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-forest-100 text-forest-600"><Store size={20} /></div>
                <div>
                  <div className="text-xs font-semibold text-forest-500">Best nearby net return</div>
                  <div className="font-display text-lg font-bold text-forest-900">₹96,000</div>
                </div>
              </div>
            </div>
            <div className="absolute -right-3 top-6 rounded-xl bg-forest-200 px-3 py-2 text-xs font-bold text-forest-900 shadow-card">
              <SimBadge />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section>
        <SectionTitle
          center
          eyebrow="Why AgriTech AI"
          title="Know more before you sell"
          desc="Not just market prices — understand what you'll actually earn after every expense."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <Card key={b.title} className="p-6 animate-fade-up" >
              <div style={{ animationDelay: `${i * 80}ms` }} className="h-full">
                <div className={`grid h-12 w-12 place-items-center rounded-2xl ${b.bg} ${b.fg}`}>
                  <b.icon size={24} />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-forest-900">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-forest-600">{b.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section>
        <Card cream className="p-6 md:p-10">
          <SectionTitle
            eyebrow="How it works"
            title="From your harvest to an informed decision"
            desc="Five coordinated AI agents work together to turn your crop details into a transparent recommendation."
          />
          <div className="mt-10 flex flex-col items-stretch gap-3 md:flex-row md:items-center">
            {WORKFLOW.map((w, i) => (
              <div key={w.label} className="flex items-center gap-3 md:flex-1 md:flex-col md:text-center">
                <div className="flex items-center gap-3 md:flex-col">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-forest-900 text-forest-200 shadow-card">
                    <w.icon size={24} />
                  </div>
                  <div className="md:mt-2">
                    <div className="text-xs font-bold uppercase tracking-wide text-forest-400">Step {i + 1}</div>
                    <div className="font-display font-bold text-forest-900 text-sm md:text-base">{w.label}</div>
                  </div>
                </div>
                {i < WORKFLOW.length - 1 && (
                  <ArrowRight size={20} className="text-forest-300 md:rotate-90 md:my-1" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Feature grid */}
      <section>
        <SectionTitle center eyebrow="Platform" title="Everything a farmer needs to decide" />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="group p-6 transition hover:shadow-cardLg">
              <div className="flex items-start justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-forest-100 text-forest-600">
                  <f.icon size={22} />
                </div>
                <button
                  onClick={() => setPage(f.page)}
                  className="rounded-lg p-2 text-forest-400 opacity-0 transition group-hover:opacity-100 hover:bg-forest-50"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-forest-900">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-forest-600">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA + imagery */}
      <section className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <Card className="overflow-hidden p-0">
          <img src={TOMATO_IMG} alt="Fresh tomatoes in crates" className="h-64 w-full object-cover lg:h-full" />
        </Card>
        <Card className="flex flex-col justify-center p-8 md:p-10">
          <Logo size="md" />
          <h3 className="mt-5 font-display text-2xl font-extrabold text-forest-900 text-balance">
            "Because every farmer deserves to know their options before selling their hard-earned harvest."
          </h3>
          <p className="mt-4 text-forest-600 leading-relaxed">
            AgriTech AI does not simply tell farmers the market price. It helps them understand how much they can actually earn — and make an informed decision before selling.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => setPage(farmer.onboarded ? 'dashboard' : 'onboarding')} className="btn-primary">
              {t('get_started', lang)} <ArrowRight size={18} />
            </button>
            <button onClick={() => setPage('voice')} className="btn-secondary">
              <Mic size={18} /> {t('ask_ai', lang)}
            </button>
          </div>
        </Card>
      </section>

      <footer className="rounded-2xl bg-forest-900 px-6 py-8 text-center text-forest-100/60">
        <div className="flex items-center justify-center gap-2"><Logo size="sm" light /></div>
        <p className="mt-3 text-xs">Team VYRON • MLRITM, Hyderabad • TECH4BHARAT 2026</p>
        <p className="mt-1 text-[10px] text-forest-100/30">All market, storage and price figures are simulated demonstration data — not verified live market information.</p>
      </footer>
    </div>
  );
}

const BENEFITS = [
  { icon: Store, title: 'Know Your Market', desc: 'Compare prices across nearby markets with distance, transport cost and freshness at a glance.', bg: 'bg-forest-100', fg: 'text-forest-600' },
  { icon: Calculator, title: 'Know Your Earnings', desc: 'Calculate actual profit after transport, loading, commission and other expenses — for every market.', bg: 'bg-forest-200/40', fg: 'text-forest-700' },
  { icon: Warehouse, title: 'Know Your Options', desc: 'Compare selling immediately against storing and selling later under different price scenarios.', bg: 'bg-forest-100', fg: 'text-forest-600' },
];

const WORKFLOW = [
  { icon: Store, label: 'Farmer Input' },
  { icon: Bot, label: 'AI Market Intelligence' },
  { icon: Calculator, label: 'Earnings Comparison' },
  { icon: Sparkles, label: 'Sell or Store' },
];

const FEATURES: { icon: typeof Mic; title: string; desc: string; page: import('@/lib/types').PageKey }[] = [
  { icon: Mic, title: 'Agri Mitra Voice Assistant', desc: 'Speak in Telugu, Hindi or English and get spoken, plain-language answers about your sale.', page: 'voice' },
  { icon: Bot, title: 'Five Coordinated AI Agents', desc: 'Watch agents pass structured results to each other and produce an explainable recommendation.', page: 'agents' },
  { icon: Store, title: 'Market Intelligence', desc: 'Search, filter and sort Telangana markets by price, transport or net earnings.', page: 'market' },
  { icon: Calculator, title: 'Net Earnings Calculator', desc: 'Change quantity, price or expenses and watch every result update instantly.', page: 'calculator' },
  { icon: Warehouse, title: 'Storage Intelligence', desc: 'Compare sell-now versus store-and-sell-later under rising, flat and falling price scenarios.', page: 'storage' },
  { icon: Zap, title: 'Live AI Decision Demo', desc: 'Run the full end-to-end workflow with a preloaded sample farmer, step by step.', page: 'agents' },
];
