import React, { useRef } from 'react';
import {
  Folder,
  FilePlus,
  Eraser,
  FolderOpen,
  FileText,
  ExternalLink,
  Send,
  Bot,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SpeechHandler } from '../utils/speech';

interface QuickCommandChipsProps {
  onExecuteCommand: (command: string) => void;
  onClearScreen: () => void;
  isProcessing?: boolean;
}

interface ChipItem {
  id: string;
  label: string;
  command?: string;
  isClearAction?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  colorClasses: string;
  badge?: string;
  title: string;
}

export const QuickCommandChips: React.FC<QuickCommandChipsProps> = ({
  onExecuteCommand,
  onClearScreen,
  isProcessing = false,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const chips: ChipItem[] = [
    {
      id: 'chip-show-folders',
      label: "papkalarimni ko'rsat",
      command: "papkalarimni ko'rsat",
      icon: Folder,
      colorClasses:
        'border-cyan-500/30 text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/60 hover:border-cyan-400/60 focus:ring-cyan-500/40',
      badge: 'Fayllar',
      title: "Ish stoli va boshqa papkalardagi barcha fayl va jildlarni ko'rish",
    },
    {
      id: 'chip-create-file',
      label: 'yangi fayl yarat',
      command: 'yangi fayl yarat',
      icon: FilePlus,
      colorClasses:
        'border-emerald-500/30 text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 hover:border-emerald-400/60 focus:ring-emerald-500/40',
      badge: 'Yaratish',
      title: 'Yangi fayl yaratish',
    },
    {
      id: 'chip-clear-screen',
      label: 'ekranni tozalash',
      isClearAction: true,
      icon: Eraser,
      colorClasses:
        'border-rose-500/30 text-rose-300 bg-rose-950/50 hover:bg-rose-900/60 hover:border-rose-400/60 focus:ring-rose-500/40',
      badge: 'Tozalash',
      title: 'Chat oynasi va ekranni tozalab boshlangʻich holatga qaytarish',
    },
    {
      id: 'chip-open-files',
      label: 'fayllarni och',
      command: 'fayllarni och',
      icon: FolderOpen,
      colorClasses:
        'border-blue-500/30 text-blue-300 bg-blue-950/50 hover:bg-blue-900/60 hover:border-blue-400/60 focus:ring-blue-500/40',
      title: "Yaratilgan fayllar ro'yxatini ko'rish va ochish",
    },
    {
      id: 'chip-test-file',
      label: 'Desktopda test.txt yarat',
      command: 'Desktopda test.txt yarat',
      icon: FileText,
      colorClasses:
        'border-amber-500/30 text-amber-300 bg-amber-950/50 hover:bg-amber-900/60 hover:border-amber-400/60 focus:ring-amber-500/40',
      badge: 'Fayl',
      title: 'Ish stolida test.txt faylini yaratish va kompyuterga avtomatik yuklab olish',
    },
    {
      id: 'chip-youtube',
      label: 'youtubega kir',
      command: 'youtubega kir',
      icon: ExternalLink,
      colorClasses:
        'border-red-500/30 text-red-300 bg-red-950/50 hover:bg-red-900/60 hover:border-red-400/60 focus:ring-red-500/40',
      title: 'YouTube videoxosting saytini ochish',
    },
    {
      id: 'chip-telegram',
      label: 'telegramga kir',
      command: 'telegramga kir',
      icon: Send,
      colorClasses:
        'border-sky-500/30 text-sky-300 bg-sky-950/50 hover:bg-sky-900/60 hover:border-sky-400/60 focus:ring-sky-500/40',
      title: 'Telegram Web messenjerini ochish',
    },
    {
      id: 'chip-chatgpt',
      label: 'chatgptga kir',
      command: 'chatgptga kir',
      icon: Bot,
      colorClasses:
        'border-teal-500/30 text-teal-300 bg-teal-950/50 hover:bg-teal-900/60 hover:border-teal-400/60 focus:ring-teal-500/40',
      title: "ChatGPT sun'iy intellektini ochish",
    },
  ];

  const handleChipClick = (chip: ChipItem) => {
    if (isProcessing) return;

    // Optional audio chirp
    SpeechHandler.playBeep(chip.isClearAction ? 'clear' : 'click');

    if (chip.isClearAction) {
      onClearScreen();
    } else if (chip.command) {
      onExecuteCommand(chip.command);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div
      id="quick-command-chips-bar"
      className="w-full max-w-4xl mx-auto px-2 sm:px-4 pt-1 pb-2"
    >
      <div className="relative flex items-center bg-slate-900/85 backdrop-blur-md rounded-2xl border border-cyan-500/25 p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
        {/* Category Header Label */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-cyan-400/90 border-r border-slate-800 shrink-0 select-none">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Tezkor:</span>
        </div>

        {/* Scroll Left Button */}
        <button
          id="btn-scroll-chips-left"
          type="button"
          onClick={() => handleScroll('left')}
          title="Chapga siljitish"
          className="hidden sm:flex items-center justify-center w-6 h-6 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors ml-1 shrink-0 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Chips Row */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none px-1 py-0.5 flex-1 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {chips.map((chip) => {
            const Icon = chip.icon;
            return (
              <button
                key={chip.id}
                id={chip.id}
                type="button"
                onClick={() => handleChipClick(chip)}
                disabled={isProcessing}
                title={chip.title}
                className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer select-none shrink-0 shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${chip.colorClasses}`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110" />
                <span className="font-mono tracking-tight">'{chip.label}'</span>

                {chip.badge && (
                  <span className="ml-0.5 px-1.5 py-0.2 text-[9px] rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 font-sans uppercase font-bold">
                    {chip.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          id="btn-scroll-chips-right"
          type="button"
          onClick={() => handleScroll('right')}
          title="O'ngga siljitish"
          className="hidden sm:flex items-center justify-center w-6 h-6 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors mr-1 shrink-0 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
