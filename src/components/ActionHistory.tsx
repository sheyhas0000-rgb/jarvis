import React from 'react';
import { Trash2, History, Check, AlertCircle, Clock } from 'lucide-react';
import { ActionLogItem } from '../types';

interface ActionHistoryProps {
  logs: ActionLogItem[];
  onClearHistory: () => void;
}

export const ActionHistory: React.FC<ActionHistoryProps> = ({
  logs,
  onClearHistory,
}) => {
  if (logs.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 mt-8">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 text-center backdrop-blur-sm">
          <History className="w-8 h-8 mx-auto text-slate-600 mb-2" />
          <p className="text-sm text-slate-400 font-medium">
            Hozircha amallar tarixi mavjud emas
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Buyruq bering va natijalar ushbu yerda saqlanadi
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mt-8 pb-12">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-300 font-['Chakra_Petch']">
            Amallar Tarixi (Action Log)
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {logs.length}
          </span>
        </div>

        <button
          onClick={onClearHistory}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors px-2 py-1 rounded hover:bg-slate-900"
          title="Tarixni tozalash"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Tarixni tozalash</span>
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-md overflow-hidden divide-y divide-slate-800/60">
        {logs.map((log, index) => (
          <div
            key={log.id ? `${log.id}-${index}` : `log-${index}`}
            className="flex items-start justify-between gap-4 p-3.5 sm:p-4 hover:bg-slate-850/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              {/* Time indicator */}
              <div className="flex items-center gap-1 text-xs font-mono text-cyan-400/90 shrink-0 mt-0.5 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-900/40">
                <Clock className="w-3 h-3" />
                <span>{log.timeFormatted}</span>
              </div>

              {/* Status icon and summary */}
              <div>
                <div className="flex items-center gap-1.5 font-medium text-sm text-slate-200">
                  {log.status === 'success' ? (
                    <span className="text-emerald-400 font-bold">✓</span>
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  )}
                  <span>{log.summary}</span>
                </div>

                {log.command && (
                  <p className="text-xs text-slate-500 mt-0.5 italic">
                    Buyruq: "{log.command}"
                  </p>
                )}
              </div>
            </div>

            {/* Target indicator badge */}
            <div className="shrink-0 text-right">
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                  log.isRealWindows
                    ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400'
                    : 'bg-sky-950/60 border border-sky-500/30 text-sky-400'
                }`}
              >
                {log.isRealWindows ? 'Windows' : 'Sandbox'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
