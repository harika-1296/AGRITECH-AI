import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { FarmerProfile, Lang, PageKey } from './types';
import { DEMO_FARMER } from './demoData';

interface AppCtx {
  farmer: FarmerProfile;
  setFarmer: (f: FarmerProfile) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  page: PageKey;
  setPage: (p: PageKey) => void;
  loadDemoFarmer: () => void;
  resetFarmer: () => void;
  isDemoMode: boolean;
  setIsDemoMode: (b: boolean) => void;
}

const Ctx = createContext<AppCtx | null>(null);

const STORAGE_KEY = 'agritech_farmer_v1';
const LANG_KEY = 'agritech_lang_v1';

const EMPTY_FARMER: FarmerProfile = {
  name: '',
  district: 'Warangal',
  lang: 'en',
  crop: 'Tomatoes',
  quantityQuintals: 50,
  harvestDate: '2026-11-15',
  onboarded: false,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [farmer, setFarmerState] = useState<FarmerProfile>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as FarmerProfile;
    } catch {
      // ignore
    }
    return EMPTY_FARMER;
  });
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      return (localStorage.getItem(LANG_KEY) as Lang) || 'en';
    } catch {
      return 'en';
    }
  });
  const [page, setPage] = useState<PageKey>('landing');
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(farmer));
    } catch {
      // ignore
    }
  }, [farmer]);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const setFarmer = useCallback((f: FarmerProfile) => setFarmerState(f), []);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    setFarmerState((prev) => ({ ...prev, lang: l }));
  }, []);
  const loadDemoFarmer = useCallback(() => {
    setFarmerState({ ...DEMO_FARMER, lang });
    setIsDemoMode(true);
  }, [lang]);
  const resetFarmer = useCallback(() => {
    setFarmerState(EMPTY_FARMER);
    setIsDemoMode(false);
    setPage('landing');
  }, []);

  return (
    <Ctx.Provider
      value={{ farmer, setFarmer, lang, setLang, page, setPage, loadDemoFarmer, resetFarmer, isDemoMode, setIsDemoMode }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp(): AppCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp must be used within AppProvider');
  return c;
}
