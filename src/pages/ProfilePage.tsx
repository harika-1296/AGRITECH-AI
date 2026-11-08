import { useState } from 'react';
import {
  UserRound, MapPin, Languages, Sprout, Scale, CalendarDays, Save, RotateCcw,
  CheckCircle2, Zap, Info, Volume2, ShieldCheck, Database,
} from 'lucide-react';
import { useApp } from '@/lib/appContext';
import { CROPS, TELANGANA_DISTRICTS, DEMO_FARMER } from '@/lib/demoData';
import { LANG_LABELS, langNative, t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';
import { Card, SectionTitle, Chip } from '@/components/ui';
import { classNames } from '@/lib/format';

export function ProfilePage() {
  const { farmer, setFarmer, lang, setLang, loadDemoFarmer, resetFarmer, isDemoMode, setPage } = useApp();
  const [form, setForm] = useState(farmer);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setFarmer({ ...form, onboarded: true });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const field = (key: keyof typeof form, value: string | number) => setForm({ ...form, [key]: value });

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-6">
      <SectionTitle
        eyebrow="Profile & Settings"
        title="Your farmer profile"
        desc="Update your details and preferences. Everything is saved on this device only."
      />

      {/* Profile card */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-forest-600 text-2xl font-bold text-white">
            {farmer.name.charAt(0).toUpperCase() || 'F'}
          </div>
          <div>
            <div className="font-display text-xl font-bold text-forest-900">{farmer.name || 'Guest farmer'}</div>
            <div className="text-sm text-forest-600">{farmer.district}, Telangana • {farmer.crop} • {farmer.quantityQuintals} quintals</div>
            <div className="mt-1 flex items-center gap-2">
              <Chip tone="lime">{langNative(lang)}</Chip>
              {isDemoMode && <Chip tone="amber">Demo mode</Chip>}
              {farmer.onboarded && <Chip tone="green"><CheckCircle2 size={10} /> Onboarded</Chip>}
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FieldWrap icon={<UserRound size={16} />} label="Farmer name">
            <input className="input-field" value={form.name} onChange={(e) => field('name', e.target.value)} placeholder="Your name" />
          </FieldWrap>

          <FieldWrap icon={<MapPin size={16} />} label="District">
            <select className="input-field" value={form.district} onChange={(e) => field('district', e.target.value)}>
              {TELANGANA_DISTRICTS.map((d) => <option key={d} value={d}>{d}, Telangana</option>)}
            </select>
          </FieldWrap>

          <FieldWrap icon={<Sprout size={16} />} label="Crop type">
            <select className="input-field" value={form.crop} onChange={(e) => field('crop', e.target.value)}>
              {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FieldWrap>

          <FieldWrap icon={<Scale size={16} />} label="Harvest quantity (quintals)">
            <input type="number" min={1} className="input-field" value={form.quantityQuintals} onChange={(e) => field('quantityQuintals', Number(e.target.value) || 0)} />
          </FieldWrap>

          <FieldWrap icon={<CalendarDays size={16} />} label="Expected harvest date">
            <input type="date" className="input-field" value={form.harvestDate} onChange={(e) => field('harvestDate', e.target.value)} />
          </FieldWrap>
        </div>

        {/* Language preference */}
        <div className="mt-6">
          <label className="label-field flex items-center gap-2"><Languages size={16} className="text-forest-500" /> Preferred language</label>
          <div className="grid grid-cols-3 gap-2">
            {LANG_LABELS.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setForm({ ...form, lang: l.code as Lang }); }}
                className={classNames(
                  'rounded-xl border px-3 py-2.5 text-sm font-semibold transition',
                  lang === l.code ? 'border-forest-500 bg-forest-50 text-forest-800 ring-2 ring-forest-200' : 'border-forest-100 bg-white text-forest-600 hover:bg-forest-50'
                )}
              >
                <div className="text-base">{l.native}</div>
                <div className="text-[10px] font-medium opacity-60">{l.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={save} className="btn-primary">
            {saved ? <><CheckCircle2 size={18} /> Saved!</> : <><Save size={18} /> Save changes</>}
          </button>
          <button onClick={() => { loadDemoFarmer(); setForm(DEMO_FARMER); setPage('dashboard'); }} className="btn-secondary">
            <Zap size={18} /> Load demo farmer
          </button>
          <button onClick={() => { resetFarmer(); setForm({ ...farmer, name: '', onboarded: false }); }} className="btn-secondary text-rose-600 hover:bg-rose-50">
            <RotateCcw size={18} /> Reset all data
          </button>
        </div>
      </Card>

      {/* Settings info */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Volume2 size={18} className="text-forest-600" />
            <h3 className="font-display font-bold text-forest-900">Voice & speech</h3>
          </div>
          <p className="text-sm text-forest-600 leading-relaxed">
            Agri Mitra uses your browser's built-in speech recognition and text-to-speech. For best results, allow microphone access when prompted. Text input always works as a fallback.
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={18} className="text-forest-600" />
            <h3 className="font-display font-bold text-forest-900">Privacy</h3>
          </div>
          <p className="text-sm text-forest-600 leading-relaxed">
            Your profile is stored only in this browser's local storage. No data is sent to a server in this demo. Clearing your browser data removes everything.
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Database size={18} className="text-forest-600" />
            <h3 className="font-display font-bold text-forest-900">Data sources</h3>
          </div>
          <p className="text-sm text-forest-600 leading-relaxed">
            All market, price and storage figures are simulated demonstration data — not live market information. The architecture supports future integration with AGMARKNET, e-NAM, data.gov.in and OpenStreetMap.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['AGMARKNET', 'e-NAM', 'data.gov.in', 'OpenStreetMap', 'WDRA'].map((s) => (
              <span key={s} className="chip bg-forest-50 text-forest-600">{s} <Info size={9} className="opacity-40" /></span>
            ))}
          </div>
        </Card>

        <Card className="p-5 bg-forest-900 text-white">
          <div className="text-xs font-bold uppercase tracking-wide text-forest-200/70">Team</div>
          <div className="mt-2 font-display text-lg font-bold">VYRON</div>
          <div className="text-sm text-forest-100/70">MLRITM, Hyderabad, Telangana</div>
          <div className="mt-3 text-xs text-forest-100/50">TECH4BHARAT 2026</div>
          <div className="mt-3 text-[10px] text-forest-100/40 italic">
            "Because every farmer deserves to know their options before selling their hard-earned harvest."
          </div>
        </Card>
      </div>
    </div>
  );
}

function FieldWrap({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label-field flex items-center gap-2"><span className="text-forest-500">{icon}</span> {label}</label>
      {children}
    </div>
  );
}
