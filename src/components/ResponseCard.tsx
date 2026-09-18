import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, XCircle, FileText, Folder, CornerDownRight, Check, X } from 'lucide-react';
import { SafeAction, ParseResult } from '../types';

interface ResponseCardProps {
  currentCommand: string;
  parseResult: ParseResult | null;
  executionMessage: string | null;
  isSuccess: boolean | null;
  isRealWindows: boolean;
  onConfirmAction: (action: SafeAction) => void;
  onCancelAction: () => void;
  pendingConfirmation: {
    action: SafeAction;
    message: string;
    type: 'delete' | 'create' | 'open' | 'rename';
  } | null;
}

export const ResponseCard: React.FC<ResponseCardProps> = ({
  currentCommand,
  parseResult,
  executionMessage,
  isSuccess,
  isRealWindows,
  onConfirmAction,
  onCancelAction,
  pendingConfirmation,
}) => {
  if (!currentCommand && !executionMessage && !pendingConfirmation && !parseResult) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentCommand + (executionMessage || '')}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        className="w-full max-w-3xl mx-auto px-4 mt-6"
      >
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-700/80 p-5 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {/* Subtle top indicator bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${
            pendingConfirmation
              ? 'bg-amber-400'
              : isSuccess === true
              ? 'bg-emerald-400'
              : isSuccess === false
              ? 'bg-rose-500'
              : 'bg-cyan-500'
          }`} />

          {/* User command quote */}
          {currentCommand && (
            <div className="flex items-start gap-2.5 pb-3 mb-3 border-b border-slate-800/80">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Chakra_Petch']">
                Buyruq:
              </span>
              <p className="text-sm font-medium text-slate-200 italic">
                "{currentCommand}"
              </p>
            </div>
          )}

          {/* Pending Confirmation Modal / Section */}
          {pendingConfirmation ? (
            <div className="py-2">
              <div className="flex items-center gap-3 text-amber-300 mb-3">
                <AlertTriangle className="w-6 h-6 shrink-0 text-amber-400" />
                <h3 className="font-semibold text-base sm:text-lg">
                  {pendingConfirmation.message}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 mb-4 pl-9">
                {pendingConfirmation.type === 'delete'
                  ? "Ushbu amal faylni Windows fayl tizimidan to'liq o'chiradi. Davom etishni tasdiqlaysizmi?"
                  : "JARVIS ushbu amalni kompyuteringizda bajarishga tayyor."}
              </p>

              {/* Confirmation Buttons */}
              <div className="flex flex-wrap items-center gap-3 pl-9">
                {pendingConfirmation.type === 'delete' ? (
                  <>
                    <button
                      onClick={() => onConfirmAction(pendingConfirmation.action)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm tracking-wide shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      HA, O‘CHIRISH
                    </button>
                    <button
                      onClick={onCancelAction}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      BEKOR QILISH
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onConfirmAction(pendingConfirmation.action)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      {pendingConfirmation.type === 'create' ? 'YARATISH' : 'BAJARISH'}
                    </button>
                    <button
                      onClick={onCancelAction}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      BEKOR
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : executionMessage ? (
            /* Execution Result Display */
            <div>
              <div className="flex items-start gap-3">
                {isSuccess === true ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : isSuccess === false ? (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <CornerDownRight className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                  <div className="text-sm sm:text-base font-medium whitespace-pre-line text-slate-100 font-['Space_Grotesk'] leading-relaxed">
                    {executionMessage}
                  </div>

                  {/* Windows verification badge */}
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    {isRealWindows ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/70 border border-emerald-500/40 text-emerald-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        Haqiqiy Windows operatsiyasi tasdiqlandi
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-950/70 border border-sky-500/40 text-sky-300">
                        <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                        Virtual Sandbox rejimida bajarildi
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : parseResult?.error ? (
            /* Error display */
            <div className="flex items-start gap-3 text-rose-300">
              <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">{parseResult.error}</p>
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
