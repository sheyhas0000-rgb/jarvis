import React, { useState, useEffect } from 'react';
import { Terminal, Trash2, Copy, Check, X, ShieldAlert, CheckCircle2, Info, ChevronDown } from 'lucide-react';
import { CommandLog, SupportedLanguage } from '../types';
import { LogService } from '../services/logService';
import { t } from '../utils/i18n';

interface LogPanelProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export const LogPanel: React.FC<LogPanelProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [logs, setLogs] = useState<CommandLog[]>([]);
  const [filter, setFilter] = useState<'all' | 'success' | 'error'>('all');
  const [copied, setCopied] = useState(false);
  const strings = t(language);

  useEffect(() => {
    const unsubscribe = LogService.subscribe((updatedLogs) => {
      setLogs(updatedLogs);
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const filteredLogs = logs.filter(l => {
    if (filter === 'all') return true;
    return l.status === filter;
  });

  const handleCopyLogs = () => {
    const text = logs
      .map(l => `[${l.timeFormatted}] [${l.status.toUpperCase()}] ${l.command} ${l.details ? '-> ' + l.details : ''}`)
      .join('\n');
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    LogService.clearLogs();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 max-h-[45vh] h-80 bg-[#070b14]/98 border-t border-cyan-500/40 backdrop-blur-xl shadow-[0_-10px_35px_rgba(0,0,0,0.8)] flex flex-col animate-slideUp font-mono select-none">
      {/* Top Header Bar */}
      <div className="h-10 px-4 bg-[#0a0f1d] border-b border-cyan-900/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-cyan-300 tracking-wider">
            {language === 'en' ? 'COMMAND EXECUTION LOGS' : language === 'ru' ? 'ЖУРНАЛ ВЫПОЛНЕНИЯ КОМАНД' : 'BUYRUQLAR IJRO JURNALI (LOG)'}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono">
            {logs.length}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-black/50 p-0.5 rounded-lg border border-zinc-800 text-[10px]">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 rounded ${filter === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              ALL
            </button>
            <button
              onClick={() => setFilter('success')}
              className={`px-2 py-0.5 rounded ${filter === 'success' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              OK
            </button>
            <button
              onClick={() => setFilter('error')}
              className={`px-2 py-0.5 rounded ${filter === 'error' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              ERR
            </button>
          </div>

          <button
            onClick={handleCopyLogs}
            className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1 transition-all"
            title="Loglarni nusxalash"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleClear}
            className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-rose-400 text-[11px] flex items-center gap-1 transition-all"
            title="Loglarni tozalash"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors ml-1"
            title="Yopish"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 text-xs font-mono scrollbar-thin scrollbar-thumb-cyan-950">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-10 text-zinc-600 text-xs">
            {language === 'en' ? 'No execution logs yet' : language === 'ru' ? 'Логов пока нет' : 'Hozircha buyruq loglari mavjud emas'}
          </div>
        ) : (
          filteredLogs.map(log => {
            const isSuccess = log.status === 'success';
            const isError = log.status === 'error';

            return (
              <div
                key={log.id}
                className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-zinc-900/60 transition-colors border-b border-zinc-900/40 text-[11px]"
              >
                <span className="text-zinc-500 shrink-0 font-mono">[{log.timeFormatted}]</span>

                {isSuccess && (
                  <span className="text-emerald-400 shrink-0 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> [OK]
                  </span>
                )}
                {isError && (
                  <span className="text-rose-400 shrink-0 font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> [ERR]
                  </span>
                )}
                {!isSuccess && !isError && (
                  <span className="text-cyan-400 shrink-0 font-bold flex items-center gap-1">
                    <Info className="w-3 h-3" /> [INFO]
                  </span>
                )}

                <span className="text-zinc-200 font-semibold truncate max-w-xs sm:max-w-md">
                  {log.command}
                </span>

                {log.details && (
                  <span className="text-zinc-400 truncate flex-1 text-[10px]">
                    {log.details.replace(/\n/g, ' • ')}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
