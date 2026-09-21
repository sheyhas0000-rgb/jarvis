import React from 'react';
import { motion } from 'motion/react';
import { Mic, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

interface FuturisticOrbProps {
  status: 'idle' | 'listening' | 'processing' | 'success' | 'error';
  statusText: string;
  isVoiceActive: boolean;
  onOrbClick?: () => void;
  compact?: boolean;
}

export const FuturisticOrb: React.FC<FuturisticOrbProps> = ({
  status,
  statusText,
  isVoiceActive,
  onOrbClick,
  compact = true,
}) => {
  const getGlowColor = () => {
    switch (status) {
      case 'listening':
        return 'from-cyan-500/30 via-sky-500/20 to-blue-500/30 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)]';
      case 'processing':
        return 'from-amber-500/30 via-orange-500/20 to-yellow-500/30 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.35)]';
      case 'success':
        return 'from-emerald-500/30 via-teal-500/20 to-emerald-500/30 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.35)]';
      case 'error':
        return 'from-rose-500/30 via-red-500/20 to-pink-500/30 border-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.35)]';
      default:
        return 'from-cyan-900/30 via-slate-900/40 to-indigo-950/40 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.18)]';
    }
  };

  if (compact) {
    return (
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 my-1 sm:my-2">
        <div 
          onClick={onOrbClick}
          className="relative flex items-center justify-between gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-2xl bg-slate-900/85 border border-slate-800 backdrop-blur-md cursor-pointer hover:border-cyan-500/40 transition-all shadow-md overflow-hidden"
        >
          {/* Subtle top indicator bar */}
          <div className={`absolute top-0 left-0 right-0 h-0.5 ${
            status === 'listening' ? 'bg-cyan-400 animate-pulse' :
            status === 'processing' ? 'bg-amber-400 animate-pulse' :
            status === 'success' ? 'bg-emerald-400' :
            status === 'error' ? 'bg-rose-400' : 'bg-cyan-600/40'
          }`} />

          {/* Left: Mini reactor core */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-950 border border-cyan-500/40 shrink-0">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-xl border border-dashed border-cyan-400/30"
              />
              {status === 'listening' ? (
                <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 animate-bounce" />
              ) : status === 'processing' ? (
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-spin" />
              ) : status === 'success' ? (
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              ) : status === 'error' ? (
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
              ) : (
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-cyan-300 font-['Chakra_Petch']">
                  JARVIS
                </span>
                {isVoiceActive && (
                  <span className="flex items-center gap-1 text-[9px] sm:text-[10px] text-rose-400 font-mono animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    OVOZ FAOL
                  </span>
                )}
              </div>
              <motion.p
                key={statusText}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] sm:text-xs font-medium text-slate-300 truncate max-w-[170px] xs:max-w-[220px] sm:max-w-md"
              >
                {statusText}
              </motion.p>
            </div>
          </div>

          {/* Right: Audio Waveform & Input mode tags */}
          <div className="flex items-center gap-2 shrink-0">
            {isVoiceActive ? (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40">
                <span className="w-1 h-3 bg-cyan-400 animate-pulse rounded-full"></span>
                <span className="w-1 h-5 bg-cyan-300 animate-pulse rounded-full delay-75"></span>
                <span className="w-1 h-2 bg-cyan-400 animate-pulse rounded-full delay-150"></span>
                <span className="w-1 h-4 bg-cyan-200 animate-pulse rounded-full delay-100"></span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  📝 Yozma
                </span>
                <span className="text-slate-600">+</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                  🎤 Ovozli
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center my-6 relative select-none">
      {/* Outer ambient glow background */}
      <div className="absolute w-72 h-72 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none -z-10" />

      {/* Futuristic Reactor Core */}
      <div 
        onClick={onOrbClick}
        className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 cursor-pointer group"
      >
        {/* Outer Rotating Segmented Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-cyan-500/25 pointer-events-none"
        />

        {/* Counter-rotating dashed ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-3 rounded-full border border-dotted border-cyan-400/20 pointer-events-none"
        />

        {/* Pulsing voice wave rings when listening */}
        {isVoiceActive && (
          <>
            <motion.div
              animate={{ scale: [1, 1.28, 1], opacity: [0.6, 0.1, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full border-2 border-cyan-400/60 pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1.1, 1.45, 1.1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              className="absolute inset-0 rounded-full border border-cyan-300/40 pointer-events-none"
            />
          </>
        )}

        {/* Central Core Globe */}
        <motion.div
          animate={status === 'listening' ? { scale: [0.98, 1.03, 0.98] } : { scale: 1 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className={`relative w-36 h-36 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center bg-gradient-to-b ${getGlowColor()} backdrop-blur-xl border transition-all duration-500 group-hover:scale-105`}
        >
          {/* Inner radial gradient */}
          <div className="absolute inset-2 rounded-full bg-slate-950/85 flex items-center justify-center overflow-hidden">
            {/* Holographic grid lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:12px_12px] opacity-25" />

            {/* Core Icon */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-1.5">
              {status === 'listening' ? (
                <Mic className="w-9 h-9 text-cyan-400 animate-bounce" />
              ) : status === 'processing' ? (
                <Activity className="w-9 h-9 text-amber-400 animate-spin" />
              ) : status === 'success' ? (
                <CheckCircle2 className="w-9 h-9 text-emerald-400" />
              ) : status === 'error' ? (
                <AlertCircle className="w-9 h-9 text-rose-400" />
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-cyan-400/80 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.6)]">
                  <div className="w-3.5 h-3.5 bg-cyan-400 rounded-full animate-ping opacity-75" />
                </div>
              )}
              
              <span className="text-[10px] uppercase font-['Chakra_Petch'] tracking-widest text-cyan-300/90 font-bold">
                JARVIS
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Status Text Display */}
      <div className="mt-4 text-center px-4 max-w-md">
        <motion.p
          key={statusText}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm sm:text-base font-medium tracking-wide ${
            status === 'listening'
              ? 'text-cyan-300 font-semibold'
              : status === 'processing'
              ? 'text-amber-300'
              : status === 'error'
              ? 'text-rose-300'
              : 'text-slate-300'
          }`}
        >
          {statusText}
        </motion.p>
      </div>
    </div>
  );
};
