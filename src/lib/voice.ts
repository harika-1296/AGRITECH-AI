import type { Lang, ChatMessage } from './types';
import { buildContext, type DecisionContext } from './agents';
import { formatINR, formatKm, uid } from './format';

// Modular AI service layer. A real LLM API can be connected by replacing
// `generateResponse` with an async fetch to an LLM endpoint. The signature
// and intent-classification layer below stay the same.

export type Intent =
  | 'best_market'
  | 'sell_or_wait'
  | 'earnings'
  | 'transport'
  | 'storage'
  | 'greeting'
  | 'fallback';

export function classifyIntent(text: string): Intent {
  const t = text.toLowerCase();
  if (/(hello|hi|namaste|namaskar|నమస్తే|హాయ్|नमस्ते)/.test(t)) return 'greeting';
  if (/(store|storage|wait|నిల్వ|ఆగి|रख|इंतजार|भंडार)/.test(t)) return 'storage';
  if (/(transport|distance|రవాణ|దూరం|परिवहन|दूरी)/.test(t)) return 'transport';
  if (/(earn|profit|income|లాభ|ఆదాయ|कमाई|लाभ)/.test(t)) return 'earnings';
  if (/(wait|ఆగి|इंतजार)/.test(t)) return 'sell_or_wait';
  if (/(where|which market|best|ఎక్కడ|ఎలా|कहाँ|कौन सा|बेच)/.test(t)) return 'best_market';
  return 'fallback';
}

export function generateResponse(
  text: string,
  lang: Lang,
  ctx: DecisionContext
): string {
  const intent = classifyIntent(text);
  const best = ctx.best;
  const sorted = [...ctx.earnings].sort((a, b) => b.netEarnings - a.netEarnings);
  const top3 = sorted.slice(0, 3);

  switch (intent) {
    case 'greeting':
      return lang === 'te'
        ? `నమస్తే! నేను అగ్రి మిత్ర. మీ ${ctx.farmer.crop} పంటను అమ్మడానికి సహాయం చేస్తాను. ఏమి తెలుసుకోవాలనుకుంటున్నారు?`
        : lang === 'hi'
        ? `नमस्ते! मैं अग्रि मित्र हूँ। आपकी ${ctx.farmer.crop} बेचने में मदद करूँगा। आप क्या जानना चाहते हैं?`
        : `Hello! I'm Agri Mitra. I'll help you sell your ${ctx.farmer.crop} smartly. What would you like to know?`;

    case 'best_market': {
      const lines = top3.map(
        (r) => `${r.marketName}: ${formatINR(r.netEarnings)} net (₹${r.pricePerQuintal}/q, transport ${formatINR(r.transport)})`
      );
      return lang === 'te'
        ? `మీ ${ctx.farmer.crop}కు 3 అవకాశాలు కనుగొన్నాను. ${best.marketName} అత్యుత్తమ నికర లాభం ${formatINR(best.netEarnings)} ఇస్తుంది. అధిక ధర ఉన్నా రవాణా ఖర్చు తక్కువగా ఉండటం వల్ల ఇది మెరుగు.\n${lines.join('\n')}`
        : lang === 'hi'
        ? `आपकी ${ctx.farmer.crop} के लिए 3 विकल्प मिले। ${best.marketName} सर्वश्रेष्ठ शुद्ध लाभ ${formatINR(best.netEarnings)} देता है। भले ही कीमत अधिक हो, कम परिवहन खर्च के कारण यह बेहतर है।\n${lines.join('\n')}`
        : `I found 3 market opportunities for your ${ctx.farmer.crop}. ${best.marketName} offers the best net return of ${formatINR(best.netEarnings)}. Although another market may list a higher price, ${best.marketName} has lower transport, so you keep more.\n${lines.join('\n')}`;
    }

    case 'sell_or_wait': {
      const up = ctx.storage?.storeScenarios.find((s) => s.label === 'Prices rise 20%');
      const down = ctx.storage?.storeScenarios.find((s) => s.label === 'Prices drop 10%');
      return lang === 'te'
        ? `ఇప్పుడు అమ్మితే ${formatINR(best.netEarnings)} వస్తుంది. 7 రోజుల నిల్వ తర్వాత ధరలు 20% పెరిగితే ${up ? formatINR(up.netEarnings) : '—'} రావచ్చు, కానీ 10% పడితే ${down ? formatINR(down.netEarnings) : '—'} మాత్రమే. నిల్వ ఖర్చు కూడా ఉంటుంది.`
        : lang === 'hi'
        ? `अभी बेचने पर ${formatINR(best.netEarnings)} मिलेंगे। 7 दिन भंडारण के बाद कीमत 20% बढ़े तो ${up ? formatINR(up.netEarnings) : '—'}, लेकिन 10% गिरे तो ${down ? formatINR(down.netEarnings) : '—'}। भंडारण खर्च भी जोड़ें।`
        : `Selling now earns ${formatINR(best.netEarnings)}. If you store 7 days and prices rise 20%, you could earn ${up ? formatINR(up.netEarnings) : '—'} — but if they drop 10%, only ${down ? formatINR(down.netEarnings) : '—'}. Storage adds cost too.`;
    }

    case 'earnings': {
      return lang === 'te'
        ? `మీ ${ctx.farmer.quantityQuintals} క్వింటాళ్లకు ${best.marketName}లో నికర లాభం ${formatINR(best.netEarnings)}. మొత్తం ఆదాయం ${formatINR(best.grossRevenue)}, ఖర్చులు ${formatINR(best.totalExpenses)}.`
        : lang === 'hi'
        ? `आपके ${ctx.farmer.quantityQuintals} क्विंटल का ${best.marketName} में शुद्ध लाभ ${formatINR(best.netEarnings)}। सकल ${formatINR(best.grossRevenue)}, खर्च ${formatINR(best.totalExpenses)}।`
        : `For ${ctx.farmer.quantityQuintals} quintals at ${best.marketName}, your net earnings are ${formatINR(best.netEarnings)}. Gross ${formatINR(best.grossRevenue)} minus expenses ${formatINR(best.totalExpenses)}.`;
    }

    case 'transport': {
      const near = ctx.markets.reduce((a, b) => (a.distanceKm < b.distanceKm ? a : b));
      return lang === 'te'
        ? `${near.name} అత్యంత సమీపంలో (${near.distanceKm} km, రవాణా ${formatINR(near.transportCost)}). దూరం పెరిగితే ఖర్చు పెరుగుతుంది, నికర లాభం తగ్గుతుంది.`
        : lang === 'hi'
        ? `${near.name} सबसे नज़दीक (${near.distanceKm} कि.मी., परिवहन ${formatINR(near.transportCost)})। दूरी बढ़ेगी तो खर्च बढ़ेगा, शुद्ध लाभ घटेगा।`
        : `${near.name} is closest (${near.distanceKm} km, transport ${formatINR(near.transportCost)}). Greater distance means higher cost and lower net earnings.`;
    }

    case 'storage': {
      const fac = ctx.storageFacility;
      return lang === 'te'
        ? `${fac?.name ?? 'నిల్వ'} — రోజుకు క్వింటల్‌కు ₹${fac?.chargePerQuintalPerDay ?? '—'}. 7 రోజుల నిల్వ ఖర్చు ${formatINR((fac?.chargePerQuintalPerDay ?? 0) * ctx.farmer.quantityQuintals * 7)}. భవిష్యతు ధరలు నిశ్చయం కాదు.`
        : lang === 'hi'
        ? `${fac?.name ?? 'भंडारण'} — ₹${fac?.chargePerQuintalPerDay ?? '—'}/क्विंटल/दिन। 7 दिन खर्च ${formatINR((fac?.chargePerQuintalPerDay ?? 0) * ctx.farmer.quantityQuintals * 7)}। भविष्य की कीमतें अनिश्चित हैं।`
        : `${fac?.name ?? 'Storage'} — ₹${fac?.chargePerQuintalPerDay ?? '—'}/quintal/day. 7-day storage cost ${formatINR((fac?.chargePerQuintalPerDay ?? 0) * ctx.farmer.quantityQuintals * 7)}. Future prices are uncertain.`;
    }

    default:
      return lang === 'te'
        ? `నేను మీ ${ctx.farmer.crop} అమ్మకంపై సహాయం చేయగలను. ఉత్తమ మార్కెట్, నికర లాభం, రవాణా లేదా నిల్వ గురించి అడగండి.`
        : lang === 'hi'
        ? `मैं आपकी ${ctx.farmer.crop} बिक्री में मदद कर सकता हूँ। बेहतरीन बाजार, लाभ, परिवहन या भंडारण के बारे में पूछें।`
        : `I can help with your ${ctx.farmer.crop} sale. Ask about the best market, net earnings, transport, or storage.`;
  }
}

export function buildContextFromFarmer(farmer: import('./types').FarmerProfile): DecisionContext {
  return buildContext(farmer);
}

export function makeMessage(
  role: ChatMessage['role'],
  text: string,
  lang: Lang
): ChatMessage {
  return { id: uid('msg'), role, text, lang, timestamp: Date.now() };
}

// --- Speech recognition & synthesis wrappers (browser APIs) ---

export type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

export function getSpeechRecognition(): SpeechRecognitionLike | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Ctor) return null;
  return new Ctor();
}

export function langToBcp47(lang: Lang): string {
  if (lang === 'te') return 'te-IN';
  if (lang === 'hi') return 'hi-IN';
  return 'en-IN';
}

export function speak(text: string, lang: Lang, onEnd?: () => void): void {
  if (!('speechSynthesis' in window)) {
    onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = langToBcp47(lang);
  utter.rate = 0.95;
  utter.onend = () => onEnd?.();
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
