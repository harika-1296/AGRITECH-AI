import type { Lang } from './types';

type Dict = Record<string, { te: string; en: string; hi: string }>;

const DICT: Dict = {
  appName: { te: 'అగ్రిటెక్ AI', en: 'AgriTech AI', hi: 'अग्रिटेक एआई' },
  tagline: {
    te: 'పంట నుండి సరైన లాభం వరకు',
    en: 'From Harvest to Fair Return',
    hi: 'फसल से उचित लाभ तक',
  },
  // Nav
  nav_landing: { te: 'హోమ్', en: 'Home', hi: 'होम' },
  nav_dashboard: { te: 'డాష్‌బోర్డ్', en: 'Dashboard', hi: 'डैशबोर्ड' },
  nav_voice: { te: 'అగ్రి మిత్ర', en: 'Agri Mitra', hi: 'अग्रि मित्र' },
  nav_agents: { te: 'AI ఏజెంట్లు', en: 'AI Agents', hi: 'एआई एजेंट' },
  nav_market: { te: 'మార్కెట్ సమాచారం', en: 'Market Intelligence', hi: 'बाजार जानकारी' },
  nav_calculator: { te: 'లాభాల కాలిక్యులేటర్', en: 'Net Earnings', hi: 'लाभ कैलकुलेटर' },
  nav_storage: { te: 'నిల్వ సమాచారం', en: 'Storage', hi: 'भंडारण' },
  nav_recommendation: { te: 'AI సూచన', en: 'AI Recommendation', hi: 'एआई सुझाव' },
  nav_profile: { te: 'ప్రొఫైల్', en: 'Profile', hi: 'प्रोफ़ाइल' },
  // Common
  get_started: { te: 'ప్రారంభించండి', en: 'Get Started', hi: 'शुरू करें' },
  explore: { te: 'ఎలా పనిచేస్తుందో తెలుసుకోండి', en: 'Explore How It Works', hi: 'कैसे काम करता है जानें' },
  ask_ai: { te: 'అగ్రిటెక్ AI ని అడగండి', en: 'Ask AgriTech AI', hi: 'अग्रिटेक एआई से पूछें' },
  sell_now: { te: 'ఇప్పుడు అమ్మండి', en: 'Sell Now', hi: 'अभी बेचें' },
  compare_markets: { te: 'ఇతర మార్కెట్‌లను పోల్చండి', en: 'Compare Markets', hi: 'बाजार तुलना' },
  explore_storage: { te: 'నిల్వను పరిశీలించండి', en: 'Explore Storage', hi: 'भंडारण देखें' },
  recalculate: { te: 'మళ్లీ లెక్కించండి', en: 'Recalculate', hi: 'पुनर्गणना' },
  run_demo: { te: 'లైవ్ AI డెమో రన్ చేయండి', en: 'Run Live AI Decision Demo', hi: 'लाइव एआई डेमो चलाएँ' },
  reset: { te: 'డెమో రీసెట్', en: 'Reset Demo', hi: 'डेमो रीसेट' },
  sim_data: { te: 'సిమ్యులేటెడ్ డెమో డేటా', en: 'Simulated demo data', hi: 'सिम्युलेटेड डेमो डेटा' },
  // Landing hero
  hero_title: {
    te: 'మీ పంట. మీ ఎంపిక. మీ సరైన లాభం.',
    en: 'Your Harvest. Your Choice. Your Fair Return.',
    hi: 'आपकी फसल। आपकी पसंद। आपका उचित लाभ।',
  },
  hero_sub: {
    te: 'బహుభాషా AI, మార్కెట్ సమాచారం మరియు నిజ-సమయ నిర్ణయ సహాయంతో పంటను అమ్మే తెలివైన నిర్ణయాలు తీసుకోండి.',
    en: 'Make smarter agricultural selling decisions with multilingual AI, market intelligence and real-time decision support.',
    hi: 'बहुभाषी एआई, बाजार खुफिया और वास्तविक-समय निर्णय सहायता के साथ बेहतर कृषि बिक्री निर्णय लें।',
  },
};

export function t(key: string, lang: Lang): string {
  const entry = DICT[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en;
}

export const LANG_LABELS: { code: Lang; label: string; native: string }[] = [
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
];

export function langNative(l: Lang): string {
  return LANG_LABELS.find((x) => x.code === l)?.native ?? 'English';
}
