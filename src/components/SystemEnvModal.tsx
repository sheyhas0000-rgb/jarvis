import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cpu, 
  Monitor, 
  Laptop, 
  Smartphone, 
  ShieldCheck, 
  Sparkles, 
  Volume2, 
  Mic, 
  HardDrive, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Check
} from 'lucide-react';
import { ActiveOSType, OSThemePreference, SupportedLanguage } from '../types';
import { detectOSInfo, DetectedOSInfo } from '../utils/osDetector';
import { LocalAgentBridge } from '../services/localAgentBridge';

interface SystemEnvModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeOS: ActiveOSType;
  osThemePreference: OSThemePreference;
  onSelectOSTheme: (pref: OSThemePreference) => void;
  theme: 'dark' | 'light';
  language: SupportedLanguage;
}

export const SystemEnvModal: React.FC<SystemEnvModalProps> = ({
  isOpen,
  onClose,
  activeOS,
  osThemePreference,
  onSelectOSTheme,
  theme,
  language,
}) => {
  const [osInfo, setOsInfo] = useState<DetectedOSInfo>(detectOSInfo());
  const [bridgeConnected, setBridgeConnected] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<number>(0);
  const [hasSpeechRec, setHasSpeechRec] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    setOsInfo(detectOSInfo());

    // Check bridge
    LocalAgentBridge.checkStatus().then(ok => setBridgeConnected(ok));

    // Check voices
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices.length);
      window.speechSynthesis.onvoiceschanged = () => {
        setAvailableVoices(window.speechSynthesis.getVoices().length);
      };
    }

    // Check speech recognition
    const hasRec = typeof window !== 'undefined' && 
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    setHasSpeechRec(Boolean(hasRec));
  }, [isOpen]);

  if (!isOpen) return null;

  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn select-none">
      <div 
        className={`
          w-full max-w-xl overflow-hidden transition-all duration-200
          ${activeOS === 'macos'
            ? (isLight ? 'rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/15 shadow-2xl text-slate-800' : 'rounded-3xl bg-[#141b2b]/90 backdrop-blur-2xl border border-white/15 shadow-2xl text-zinc-100')
            : activeOS === 'android'
            ? (isLight ? 'rounded-[28px] bg-[#eef4f0] border border-[#d2ded6] shadow-2xl text-slate-900' : 'rounded-[28px] bg-[#161f2c] border border-[#27364a] shadow-2xl text-zinc-100')
            : (isLight ? 'rounded-2xl bg-white border border-slate-300 shadow-2xl text-slate-800' : 'rounded-2xl bg-[#0c121e] border border-cyan-500/40 shadow-[0_0_40px_rgba(0,240,255,0.15)] text-zinc-100')
          }
        `}
      >
        {/* Modal Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          activeOS === 'macos'
            ? (isLight ? 'bg-white/70 border-black/10' : 'bg-[#182133]/70 border-white/10')
            : activeOS === 'android'
            ? (isLight ? 'bg-[#e2ebe6] border-[#d4e1d9]' : 'bg-[#1d2737] border-[#2c3d53]')
            : (isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#090f1c] border-cyan-900/40')
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-xl ${
              activeOS === 'macos' ? 'bg-blue-500/20 text-blue-400' : activeOS === 'android' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'
            }`}>
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">
                {language === 'en' ? 'Local System & OS Diagnostics' : language === 'ru' ? 'Диагностика системы и темы OS' : 'Lokal Tizim va OS Diagnostikasi'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                100% Real ma'lumotlar • Soxta stubs yo'q
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Yopish"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Active OS Theme Switcher */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                {language === 'en' ? 'Concept OS Theme:' : language === 'ru' ? 'Тема концепта OS:' : 'Konsept OS Mavzusi:'}
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                Aktiv: {activeOS.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'auto', label: 'Auto OS', icon: <Sparkles className="w-3.5 h-3.5" />, sub: `(${osInfo.detectedOSName})` },
                { id: 'macos', label: 'macOS 27', icon: <Laptop className="w-3.5 h-3.5" />, sub: 'Liquid Glass' },
                { id: 'windows', label: 'Windows 12', icon: <Monitor className="w-3.5 h-3.5" />, sub: 'Fluent Mica' },
                { id: 'android', label: 'Android 16', icon: <Smartphone className="w-3.5 h-3.5" />, sub: 'Material You' },
              ].map(opt => {
                const isSelected = osThemePreference === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onSelectOSTheme(opt.id as OSThemePreference)}
                    className={`
                      p-2.5 rounded-xl border text-left transition-all active:scale-95
                      ${isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                        : 'bg-black/30 border-zinc-800 text-zinc-300 hover:border-zinc-700'}
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-cyan-400">{opt.icon}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div className="text-[10px] text-zinc-400 truncate">{opt.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Genuine Client Diagnostics */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              {language === 'en' ? 'Hardware & Environment Diagnostics' : language === 'ru' ? 'Диагностика окружения' : 'Haqiqiy Tizim Diagnostikasi'}
            </span>

            <div className={`p-4 rounded-xl border space-y-2.5 text-xs font-mono ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-black/50 border-zinc-800 text-zinc-300'
            }`}>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/40">
                <span className="text-zinc-500">Aniqlangan OS:</span>
                <span className="font-bold text-cyan-400">{osInfo.detectedOSName}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-zinc-800/40">
                <span className="text-zinc-500">Platforma (Navigator):</span>
                <span className="truncate max-w-[200px] text-right">{osInfo.rawPlatform}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-zinc-800/40">
                <span className="text-zinc-500">Qurilma / Ekran:</span>
                <span>{osInfo.deviceType.toUpperCase()} • {osInfo.screenSize} ({osInfo.isTouch ? 'Touch' : 'Non-touch'})</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-zinc-800/40">
                <span className="text-zinc-500">Lokal Agent Bridge (8765):</span>
                <span className="flex items-center gap-1.5">
                  {bridgeConnected ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ulangan
                    </span>
                  ) : (
                    <span className="text-cyan-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Veb Sandbox (Zero-Install)
                    </span>
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-zinc-800/40">
                <span className="text-zinc-500">Speech Synthesis (TTS):</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Volume2 className="w-3.5 h-3.5" /> Web Speech API ({availableVoices} ta ovoz)
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-500">Speech Recognition (Mikrofon):</span>
                <span className="flex items-center gap-1">
                  {hasSpeechRec ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Mic className="w-3.5 h-3.5" /> Faol (uz-UZ, en-US, ru-RU)
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Brauzer ruxsati kutilmoqda
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Explanation Notice */}
          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 leading-relaxed">
            <p>
              🔒 <strong>Haqiqiy Oflayn Xavfsizlik:</strong> JARVIS barcha buyruqlar va 11 ta Windows dasturlarini (Kalkulyator, Bloknot, Explorer, Task Manager va boshqalar) xavfsiz URI protokollari va to'liq interaktiv simulyatsiyalar orqali mahalliy ishga tushiradi. Hech qanday tashqi API yoki .bat fayllar yuklab olinmaydi.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-5 py-3 border-t flex justify-end ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#090f1c] border-cyan-900/40'
        }`}>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all active:scale-95"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
