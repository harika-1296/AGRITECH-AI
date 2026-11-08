import { useState } from 'react';
import { UserRound, MapPin, Languages, Sprout, Scale, CalendarDays, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { useApp } from '@/lib/appContext';
import { CROPS, TELANGANA_DISTRICTS } from '@/lib/demoData';
import { LANG_LABELS } from '@/lib/i18n';
import type { Lang } from '@/lib/types';
import { Card, SectionTitle } from '@/components/ui';
import { classNames } from '@/lib/format';

export function OnboardingPage() {
  const { setFarmer, setPage, loadDemoFarmer, lang, setLang } = useApp();
  const [form, setForm] = useState({
    name: '',
    district: 'Warangal',
    lang: 'te' as Lang,
    crop: 'Tomatoes',
    quantityQuintals: 50,
    harvestDate: '2026-11-15',
  });

  const submit = () => {
    setFarmer({ ...form, onboarded: true });
    setPage('dashboard');
  };

  return (
    <div className="mx-auto max-w-3xl py-6">
      <SectionTitle
        center
        eyebrow="Farmer Onboarding"
        title="Tell us about your harvest"
        desc="This helps AgriTech AI personalise market options and recommendations for you. You can skip optional fields."
      />

      <Card className="mt-8 p-6 md:p-8">
        {/* Name */}
        <Field icon={<UserRound size={18} />} label="Farmer name" required>
          <input
            className="input-field"
            placeholder="e.g. Ramesh"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>

        {/* District */}
        <div className="grid gap-5 md:grid-cols-2">
          <Field icon={<MapPin size={18} />} label="Location / District">
            <select
              className="input-field"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
            >
              {TELANGANA_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}, Telangana</option>
              ))}
            </select>
          </Field>

          {/* Language */}
          <Field icon={<Languages size={18} />} label="Preferred language">
            <div className="grid grid-cols-3 gap-2">
              {LANG_LABELS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => { setLang(l.code); setForm({ ...form, lang: l.code }); }}
                  className={classNames(
                    'rounded-xl border px-3 py-2.5 text-sm font-semibold transition',
                    form.lang === l.code
                      ? 'border-forest-500 bg-forest-50 text-forest-800 ring-2 ring-forest-200'
                      : 'border-forest-100 bg-white text-forest-600 hover:bg-forest-50'
                  )}
                >
                  <div className="text-base">{l.native}</div>
                  <div className="text-[10px] font-medium opacity-60">{l.label}</div>
                </button>
              ))}
            </div>
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Crop */}
          <Field icon={<Sprout size={18} />} label="Crop type">
            <select
              className="input-field"
              value={form.crop}
              onChange={(e) => setForm({ ...form, crop: e.target.value })}
            >
              {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          {/* Quantity */}
          <Field icon={<Scale size={18} />} label="Approximate harvest quantity (quintals)">
            <input
              type="number"
              min={1}
              className="input-field"
              value={form.quantityQuintals}
              onChange={(e) => setForm({ ...form, quantityQuintals: Number(e.target.value) || 0 })}
            />
          </Field>
        </div>

        {/* Harvest date */}
        <Field icon={<CalendarDays size={18} />} label="Expected harvest date" optional>
          <input
            type="date"
            className="input-field"
            value={form.harvestDate}
            onChange={(e) => setForm({ ...form, harvestDate: e.target.value })}
          />
        </Field>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => { loadDemoFarmer(); setPage('dashboard'); }}
            className="btn-secondary"
          >
            <Zap size={18} /> Skip — Use demo farmer
          </button>
          <button
            onClick={submit}
            disabled={!form.name.trim()}
            className="btn-primary"
          >
            <CheckCircle2 size={18} /> Continue to Dashboard <ArrowRight size={16} />
          </button>
        </div>
        {!form.name.trim() && (
          <p className="mt-3 text-xs text-forest-400 sm:text-right">Enter your name to continue, or use the demo farmer.</p>
        )}
      </Card>

      <p className="mt-4 text-center text-xs text-forest-400">
        Your details are saved on this device only for the demo. Nothing is sent to a server.
      </p>
    </div>
  );
}

function Field({
  icon, label, children, required, optional,
}: {
  icon: React.ReactNode; label: string; children: React.ReactNode; required?: boolean; optional?: boolean;
}) {
  return (
    <div className="mb-5">
      <label className="label-field flex items-center gap-2">
        <span className="text-forest-500">{icon}</span>
        {label}
        {required && <span className="text-rose-500">*</span>}
        {optional && <span className="text-xs font-normal text-forest-400">(optional)</span>}
      </label>
      {children}
    </div>
  );
}
