import React from 'react';
import { ShieldAlert, AlertTriangle, Check, X } from 'lucide-react';
import { PendingPermission } from '../types';

interface PermissionModalProps {
  pending: PendingPermission | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  pending,
  onConfirm,
  onCancel,
}) => {
  if (!pending) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#0c121e] border border-amber-500/40 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.2)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-amber-950/30 border-b border-amber-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-amber-200">
              Xavfsizlik Tasdig‘i Talab Qilinadi
            </h3>
            <p className="text-xs text-amber-400/80">
              JARVIS Local Agent Xavfsizlik Qoidasi
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-900/15 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              {pending.details || `Ushbu buyruq kompyuteringizda sezilarli o‘zgarish qilishi mumkin:`}
            </div>
          </div>

          <div className="bg-black/40 border border-zinc-800 rounded-xl p-3.5 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Amal turi:</span>
              <span className="text-cyan-300 font-mono font-medium">{pending.actionTitle}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Kiritilgan buyruq:</span>
              <span className="text-zinc-200 font-mono">"{pending.commandText}"</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Permission toifasi:</span>
              <span className="text-zinc-300 font-mono">{pending.permissionType}</span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 text-center">
            Ushbu amalni lokal kompyuterda bajarishga ruxsat berasizmi?
          </p>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 bg-zinc-950/60 border-t border-zinc-800 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-all"
          >
            <X className="w-4 h-4" />
            Bekor qilish
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-amber-500/50 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-medium text-xs shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all active:scale-98"
          >
            <Check className="w-4 h-4 text-amber-400" />
            Ruxsat berish
          </button>
        </div>
      </div>
    </div>
  );
};
