import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Send, Volume2, Square, Sparkles, Languages, Bot, User } from 'lucide-react';
import { useApp } from '@/lib/appContext';
import { buildContext } from '@/lib/agents';
import {
  generateResponse, getSpeechRecognition, speak, stopSpeaking, langToBcp47,
  makeMessage, type SpeechRecognitionLike,
} from '@/lib/voice';
import { LANG_LABELS, langNative } from '@/lib/i18n';
import type { ChatMessage, Lang } from '@/lib/types';
import { Card, SimBadge } from '@/components/ui';
import { classNames, uid } from '@/lib/format';

const SUGGESTIONS: { te: string; en: string; hi: string }[] = [
  { te: 'నా టమాటాలను ఎక్కడ అమ్మితే ఎక్కువ లాభం వస్తుంది?', en: 'Where can I sell my tomatoes for the best return?', hi: 'मेरे टमाटर कहाँ बेचने से सबसे ज्यादा लाभ होगा?' },
  { te: 'నా నికర ఆదాయం ఎంత?', en: 'What are my net earnings?', hi: 'मेरी शुद्ध कमाई कितनी है?' },
  { te: 'ఫసలను ఇప్పుడు అమ్మాలా లేక ఆగాలా?', en: 'Should I sell now or wait?', hi: 'क्या मुझे अभी बेचना चाहिए या इंतजार करना चाहिए?' },
  { te: 'నిల్వ సౌకర్యాల గురించి చెప్పండి', en: 'Tell me about storage options', hi: 'भंडारण के विकल्प बताइए' },
];

export function VoiceAssistantPage() {
  const { farmer, lang, setLang } = useApp();
  const ctx = buildContext(farmer);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = useCallback((m: ChatMessage) => {
    setMessages((prev) => [...prev, m]);
  }, []);

  const respond = useCallback(
    (text: string, responseLang: Lang) => {
      const reply = generateResponse(text, responseLang, ctx);
      addMessage(makeMessage('assistant', reply, responseLang));
      setSpeaking(true);
      speak(reply, responseLang, () => setSpeaking(false));
    },
    [ctx, addMessage]
  );

  const sendText = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      addMessage(makeMessage('farmer', trimmed, lang));
      setInput('');
      respond(trimmed, lang);
    },
    [lang, addMessage, respond]
  );

  const toggleListen = useCallback(() => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = getSpeechRecognition();
    if (!rec) {
      addMessage(makeMessage('assistant', 'Voice input is not supported in this browser. Please type your question below.', lang));
      return;
    }
    rec.lang = langToBcp47(lang);
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript ?? '';
      if (transcript) {
        addMessage(makeMessage('farmer', transcript, lang));
        respond(transcript, lang);
      }
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  }, [listening, lang, addMessage, respond]);

  const stopSpeak = () => {
    stopSpeaking();
    setSpeaking(false);
  };

  return (
    <div className="mx-auto max-w-3xl py-6">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <div className={classNames(
            'grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-forest-200 to-forest-500 text-forest-900 shadow-glow',
            listening && 'animate-pulse'
          )}>
            <Bot size={36} />
          </div>
          {listening && (
            <>
              <span className="absolute inset-0 rounded-3xl ring-2 ring-forest-200 animate-pulse-ring" />
              <span className="absolute inset-0 rounded-3xl ring-2 ring-forest-300 animate-pulse-ring" style={{ animationDelay: '0.6s' }} />
            </>
          )}
        </div>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-forest-900">Agri Mitra</h1>
        <p className="text-sm text-forest-600">Your Farming Decision Assistant</p>
        <div className="mt-2 flex items-center gap-2">
          <SimBadge />
          <span className="chip bg-forest-50 text-forest-700"><Sparkles size={12} /> Multilingual AI</span>
        </div>
      </div>

      {/* Language switcher */}
      <div className="mt-5 flex items-center justify-center gap-2">
        <Languages size={16} className="text-forest-500" />
        {LANG_LABELS.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={classNames(
              'rounded-lg px-3 py-1.5 text-sm font-semibold transition',
              lang === l.code ? 'bg-forest-600 text-white' : 'bg-forest-50 text-forest-600 hover:bg-forest-100'
            )}
          >
            {l.native}
          </button>
        ))}
      </div>

      {/* Conversation */}
      <Card className="mt-6 flex flex-col p-0 overflow-hidden" >
        <div ref={scrollRef} className="h-[420px] overflow-y-auto p-5 scrollbar-thin space-y-4 bg-cream-50/30">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center text-forest-400">
              <Bot size={40} className="mb-3" />
              <p className="text-sm font-medium text-forest-600">
                {lang === 'te' ? 'నేను అగ్రి మిత్ర. మీ పంట అమ్మకం గురించి అడగండి.' : lang === 'hi' ? 'मैं अग्रि मित्र हूँ। अपनी फसल की बिक्री के बारे में पूछें।' : 'I am Agri Mitra. Ask me about selling your crop.'}
              </p>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={classNames('flex gap-3 animate-fade-up', m.role === 'farmer' ? 'flex-row-reverse' : '')}>
              <div className={classNames(
                'grid h-9 w-9 shrink-0 place-items-center rounded-xl',
                m.role === 'farmer' ? 'bg-forest-100 text-forest-600' : 'bg-forest-900 text-forest-200'
              )}>
                {m.role === 'farmer' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={classNames(
                'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line',
                m.role === 'farmer' ? 'bg-forest-600 text-white rounded-tr-md' : 'bg-white text-forest-800 border border-forest-50 rounded-tl-md shadow-sm'
              )}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Suggestions */}
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 px-5 py-3 border-t border-forest-50 bg-white">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => sendText(s[lang])}
                className="rounded-full bg-forest-50 px-3 py-1.5 text-xs font-medium text-forest-700 transition hover:bg-forest-100"
              >
                {s[lang]}
              </button>
            ))}
          </div>
        )}

        {/* Input bar */}
        <div className="border-t border-forest-50 bg-white p-3">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleListen}
              className={classNames(
                'grid h-12 w-12 shrink-0 place-items-center rounded-xl transition active:scale-95',
                listening ? 'bg-rose-500 text-white' : 'bg-forest-600 text-white hover:bg-forest-700'
              )}
              title={listening ? 'Stop listening' : 'Speak'}
            >
              {listening ? <Square size={20} /> : <Mic size={22} />}
            </button>
            {speaking && (
              <button
                onClick={stopSpeak}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-600 hover:bg-forest-200 transition"
                title="Stop voice"
              >
                <Volume2 size={20} />
              </button>
            )}
            <input
              className="input-field"
              placeholder={lang === 'te' ? 'మీ ప్రశ్నను టైప్ చేయండి...' : lang === 'hi' ? 'अपना प्रश्न टाइप करें...' : 'Type your question...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendText(input)}
            />
            <button
              onClick={() => sendText(input)}
              disabled={!input.trim()}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-forest-200 text-forest-900 transition hover:bg-forest-100 disabled:opacity-40 active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
          {/* Voice wave */}
          {(listening || speaking) && (
            <div className="mt-3 flex items-center justify-center gap-1 h-8">
              {Array.from({ length: 18 }).map((_, i) => (
                <span
                  key={i}
                  className="w-1 rounded-full bg-forest-400 animate-wave"
                  style={{
                    height: '28px',
                    animationDelay: `${i * 60}ms`,
                    animationDuration: `${0.6 + (i % 4) * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}
          {listening && <p className="mt-1 text-center text-xs font-semibold text-rose-500">Listening… ({langNative(lang)})</p>}
          {speaking && !listening && <p className="mt-1 text-center text-xs font-semibold text-forest-500">Agri Mitra is speaking…</p>}
        </div>
      </Card>

      <p className="mt-4 text-center text-xs text-forest-400">
        Uses your browser's speech recognition & synthesis. Text input always works as a fallback. No external AI API is connected — responses use a modular on-device layer.
      </p>
    </div>
  );
}
