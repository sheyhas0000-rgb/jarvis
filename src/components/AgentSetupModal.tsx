import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Download, 
  RefreshCw, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Laptop, 
  Copy, 
  Check, 
  Apple, 
  Monitor, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { AgentStatusInfo } from '../types';

interface AgentSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentStatus: AgentStatusInfo | null;
  onRefreshStatus: () => void;
  isChecking: boolean;
}

export const AgentSetupModal: React.FC<AgentSetupModalProps> = ({
  isOpen,
  onClose,
  agentStatus,
  onRefreshStatus,
  isChecking,
}) => {
  const isClientMac = typeof navigator !== 'undefined' && /Macintosh|Mac OS|MacPPC|MacIntel/i.test(navigator.userAgent);
  const [selectedOS, setSelectedOS] = useState<'macos' | 'windows'>(isClientMac ? 'macos' : 'windows');
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://127.0.0.1:3000';
  
  const macTerminalCmd = `curl -fsSL "${currentOrigin}/api/agent/download-script" -o jarvis-agent.js && node jarvis-agent.js`;
  const winPowershellCmd = `Invoke-WebRequest -Uri "${currentOrigin}/api/agent/download-script" -OutFile "jarvis-agent.js"; node jarvis-agent.js`;

  const activeCmd = selectedOS === 'macos' ? macTerminalCmd : winPowershellCmd;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-[0_0_50px_rgba(0,0,0,0.7)] max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100 font-['Chakra_Petch'] flex items-center gap-2">
                  <span>JARVIS Mahalliy Agenti</span>
                  <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                    macOS & Windows
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Kompyuteringiz (Mac yoki PC) fayl tizimi bilan xavfsiz bog'lanish
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Status banner */}
          <div className="my-5 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {agentStatus?.connected ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
              )}
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  {agentStatus?.connected
                    ? `🟢 Local Agent ulangan: 127.0.0.1:8765`
                    : `🟡 Local Agent hali ulanmagan (Hozircha Virtual Sandbox faol)`}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {agentStatus?.connected
                    ? `Foydalanuvchi: ${agentStatus.username} | Platforma: ${agentStatus.platformName || agentStatus.platform}`
                    : `Agent ishga tushgach, fayllar to'g'ridan-to'g'ri haqiqiy ${isClientMac ? 'macOS' : 'kompyuteringiz'} Ish stolida paydo bo'ladi`}
                </p>
              </div>
            </div>

            <button
              onClick={onRefreshStatus}
              disabled={isChecking}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
              <span>Tekshirish</span>
            </button>
          </div>

          {/* OS Switcher Tabs */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-['Chakra_Petch']">
              Operatsion tizimingizni tanlang:
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedOS('macos')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  selectedOS === 'macos'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Apple className="w-4 h-4" />
                <span>Apple macOS (Mac / MacBook)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOS('windows')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  selectedOS === 'windows'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Microsoft Windows (PC)</span>
              </button>
            </div>
          </div>

          {/* macOS Guide */}
          {selectedOS === 'macos' && (
            <div className="space-y-4">
              {/* Quick 1-Line Terminal Launch (Fastest & Easiest) */}
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-['Chakra_Petch']">
                      Eng tezkor usul: Terminalda 1 qatorda ishga tushirish
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-medium transition-colors"
                  >
                    {copiedCmd ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Nusxalandi!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Nusxa olish</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-300">
                  Mac-da <span className="font-semibold text-white">Terminal</span> dasturini oching (<kbd className="px-1 py-0.5 rounded bg-slate-800 text-[10px] text-slate-200">Cmd + Space</kbd> &rarr; <span className="text-cyan-300">Terminal</span>) va quyidagilarni kiritib <kbd className="px-1 py-0.5 rounded bg-slate-800 text-[10px]">Enter</kbd> bosing:
                </p>

                <div className="relative group">
                  <pre className="p-3 rounded-lg bg-black/90 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all border border-slate-800">
                    {macTerminalCmd}
                  </pre>
                </div>
              </div>

              {/* Download Buttons for Mac */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="/api/agent/download-command"
                  download="start-jarvis.command"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-all text-center"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>start-jarvis.command yuklab olish</span>
                </a>

                <a
                  href="/api/agent/download-script"
                  download="jarvis-agent.js"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-all text-center"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>jarvis-agent.js yuklab olish</span>
                </a>
              </div>

              {/* Mac Steps */}
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <p className="font-semibold text-slate-200 mb-1">
                    🍏 Nega Mac-da agent kerak?
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    Xavfsizlik qoidalariga ko'ra brauzerlar kompyuteringiz fayllarini bevosita o'zgartira olmaydi. Ushbu yengil mahalliy agent <code className="text-cyan-400">127.0.0.1:8765</code> da ishlaydi va faqat siz ruxsat bergan Mac papkalarida (Ish stoli, Yuklamalar, Hujjatlar va h.k.) fayllarni yaratadi.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Windows Guide */}
          {selectedOS === 'windows' && (
            <div className="space-y-4">
              {/* Windows Download buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="/api/agent/download-bat"
                  download="start-jarvis.bat"
                  className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] text-center"
                >
                  <Download className="w-4 h-4" />
                  <span>start-jarvis.bat yuklab olish</span>
                </a>

                <a
                  href="/api/agent/download-script"
                  download="jarvis-agent.js"
                  className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-all text-center"
                >
                  <Download className="w-4 h-4" />
                  <span>jarvis-agent.js yuklab olish</span>
                </a>
              </div>

              {/* Quick 1-Line PowerShell Command */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    Yoki Windows PowerShell orqali ishga tushiring:
                  </span>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
                  >
                    {copiedCmd ? 'Nusxalandi!' : 'Nusxa olish'}
                  </button>
                </div>
                <pre className="p-2.5 rounded bg-black/80 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all">
                  {winPowershellCmd}
                </pre>
              </div>

              {/* Windows Steps */}
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <p className="font-semibold text-cyan-400">1. start-jarvis.bat ni ishga tushiring</p>
                  <p className="text-slate-400">
                    Yuklab olingan <code className="text-slate-200 bg-slate-800 px-1 py-0.5 rounded">start-jarvis.bat</code> faylini sichqoncha bilan 2 marta bosing. Kompyuteringizda Node.js o'rnatilgan bo'lishi kifoya.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Close */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Agent ishlaganda yuqoridagi indikator yashil yonadi.
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
            >
              Tushundim
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
