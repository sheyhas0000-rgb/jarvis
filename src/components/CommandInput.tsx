import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Sparkles } from 'lucide-react';
import { SpeechHandler } from '../utils/speech';

interface CommandInputProps {
  onSubmit: (command: string) => void;
  isProcessing: boolean;
  onListeningChange?: (isListening: boolean, message?: string) => void;
}

export const CommandInput: React.FC<CommandInputProps> = ({
  onSubmit,
  isProcessing,
  onListeningChange,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const speechHandlerRef = useRef<SpeechHandler | null>(null);

  useEffect(() => {
    speechHandlerRef.current = new SpeechHandler();
    return () => {
      speechHandlerRef.current?.stopListening();
    };
  }, []);

  const handleToggleListening = () => {
    if (isListening) {
      speechHandlerRef.current?.stopListening();
      setIsListening(false);
      onListeningChange?.(false, 'Buyruq bering...');
    } else {
      setIsListening(true);
      onListeningChange?.(true, '🎤 Tinglayapman...');

      speechHandlerRef.current?.startListening(
        (recognizedText) => {
          setInputText(recognizedText);
          setIsListening(false);
          onListeningChange?.(false, `Qabul qilindi: "${recognizedText}"`);
          // Auto submit after voice recognized
          onSubmit(recognizedText);
        },
        (status, message) => {
          if (status === 'error') {
            setIsListening(false);
            onListeningChange?.(false, message || 'Xatolik yuz berdi');
          } else if (status === 'listening') {
            onListeningChange?.(true, message || '🎤 Tinglayapman...');
          } else if (status === 'idle') {
            setIsListening(false);
          }
        }
      );
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = inputText.trim();
    if (!clean || isProcessing) return;
    onSubmit(clean);
    setInputText('');
  };

  const suggestions = [
    'instagramga kir',
    'youtubega kir',
    'fayllarni och',
    'optimizatsiya.bat yarat',
    'facebookga kir',
    'telegramga kir',
    'chatgptga kir',
    'test.txt faylini och',
    'Desktopda test.txt fayl yarat',
    'test.txt nomini hello.txt qil',
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Input container */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 group-focus-within:border-cyan-500/70 group-focus-within:shadow-[0_0_20px_rgba(6,182,212,0.25)] rounded-2xl p-2 transition-all backdrop-blur-xl">
          {/* Large Mic Button */}
          <button
            type="button"
            onClick={handleToggleListening}
            title={isListening ? "Tinglashni to'xtatish" : "Ovozli gapirish (Mikrofon)"}
            className={`relative flex items-center justify-center w-11 h-11 rounded-xl transition-all cursor-pointer shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white shadow-[0_0_25px_rgba(244,63,94,0.6)] animate-pulse'
                : 'bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-400 hover:text-cyan-200 border border-cyan-500/30'
            }`}
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
            {isListening && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            )}
          </button>

          {/* Text Input for Written Commands */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            placeholder={
              isListening
                ? "🎤 Tinglayapman... (gapiring)"
                : "Yozma buyruq kiriting... (masalan: Desktopda test.txt yarat)"
            }
            className="flex-1 bg-transparent px-3 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none text-sm sm:text-base font-['Space_Grotesk'] min-w-0"
          />

          {/* Clear text button if input exists */}
          {inputText && !isProcessing && (
            <button
              type="button"
              onClick={() => setInputText('')}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors mr-1 cursor-pointer"
              title="Matnni tozalash"
            >
              <span className="text-xs font-mono">✕</span>
            </button>
          )}

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            title="Yuborish (Enter)"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 font-bold text-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Yuborish</span>
          </button>
        </div>
        {/* Mode Indicators */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 mt-2 px-1">
          <span className="flex items-center gap-1 text-cyan-400 font-medium">
            <span>⌨️</span> Yozma buyruq (Enter bilan yuborish)
          </span>
          <span className="flex items-center gap-1 text-indigo-300 font-medium">
            <span>🎤</span> Ovozli buyruq (Mikrofonni bosib gapiring)
          </span>
        </div>
      </form>

      {/* Suggested Uzbek commands */}
      <div className="mt-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Tezkor buyruq namunalari:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => {
                setInputText(cmd);
                onSubmit(cmd);
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all text-left cursor-pointer"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
