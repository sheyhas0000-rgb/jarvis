import React from 'react';
import { ShieldCheck, Download, Volume2, VolumeX, Terminal, Cpu } from 'lucide-react';
import { AgentStatusInfo, ApprovedLocation } from '../types';

interface NavbarProps {
  agentStatus: AgentStatusInfo | null;
  onOpenPermissions: () => void;
  onOpenSetup: () => void;
  onOpenDownload?: () => void;
  isVoiceFeedbackEnabled: boolean;
  onToggleVoiceFeedback: () => void;
  allowedLocations: Record<ApprovedLocation, boolean>;
}

export const Navbar: React.FC<NavbarProps> = ({
  agentStatus,
  onOpenPermissions,
  onOpenSetup,
  onOpenDownload,
  isVoiceFeedbackEnabled,
  onToggleVoiceFeedback,
  allowedLocations,
}) => {
  const activePermissionsCount = Object.values(allowedLocations).filter(Boolean).length;
  const isClientMac = typeof navigator !== 'undefined' && /Macintosh|Mac OS/i.test(navigator.userAgent);

  return (
    <header className="border-b border-cyan-900/30 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Cpu className="w-5 h-5 animate-pulse text-cyan-400" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 font-['Chakra_Petch']">
                JARVIS
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-950/70 border border-emerald-600/40 text-emerald-400">
                🟢 JARVIS ishlayapti
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Shaxsiy yordamchingiz (Windows, Mac & Android)
            </p>
          </div>
        </div>

        {/* Agent Connectivity status & Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Download & Install App (Windows .exe, Mac, Android) */}
          {onOpenDownload && (
            <button
              onClick={onOpenDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all cursor-pointer border border-cyan-400/40"
              title="Windows (.exe), Mac va Android uchun yuklab olish"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Yuklab olish</span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-black/30 text-[10px] text-cyan-200">
                Win / Mac / Android
              </span>
            </button>
          )}

          {/* Browser / Agent connection indicator */}
          <button
            onClick={onOpenSetup}
            title="Tizim holatini ko'rish (Agent ixtiyoriy)"
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              agentStatus?.connected
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/30'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {agentStatus?.connected ? (
              <span>Local Agent: 127.0.0.1:8765 ({agentStatus.username})</span>
            ) : (
              <span>Brauzerda faol • Hech narsa yuklash shart emas</span>
            )}
            <Terminal className="w-3.5 h-3.5 opacity-60 ml-0.5" />
          </button>

          {/* Permissions button */}
          <button
            onClick={onOpenPermissions}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/90 border border-slate-700/60 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ruxsatlar ({activePermissionsCount}/5)</span>
          </button>

          {/* Voice feedback toggle with explicit label */}
          <button
            onClick={onToggleVoiceFeedback}
            title={isVoiceFeedbackEnabled ? "Ovozli javobni o'chirish (Faqat yozma)" : "Ovozli javobni yoqish (Yozma + Ovoz)"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isVoiceFeedbackEnabled
                ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isVoiceFeedbackEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ovoz: Yoqilgan</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>Ovoz: O‘chiq</span>
              </>
            )}
          </button>

          {/* Terminal / Bat launcher help */}
          <button
            onClick={onOpenSetup}
            className="p-2 rounded-lg text-xs font-medium bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
            title="Qo'llanma va start-jarvis.bat"
          >
            <Terminal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
