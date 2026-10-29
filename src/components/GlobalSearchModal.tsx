import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Terminal, 
  MessageSquare, 
  FolderKanban, 
  Plug, 
  Settings as SettingsIcon, 
  Wrench, 
  Home, 
  Sparkles, 
  LayoutGrid, 
  Camera, 
  Volume2, 
  Cpu, 
  Clock, 
  ArrowRight, 
  X,
  CornerDownLeft
} from 'lucide-react';
import { SidebarTab, ActiveOSType, SupportedLanguage, WindowsAppId } from '../types';
import { ALL_COMMANDS_META } from '../commands/commandRegistry';
import { StorageService } from '../services/storageService';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: SidebarTab) => void;
  onExecuteCommand: (cmd: string) => void;
  onOpenApp: (appId: WindowsAppId) => void;
  onSelectChat: (chatId: string) => void;
  osTheme: ActiveOSType;
  theme: 'dark' | 'light';
  language: SupportedLanguage;
}

interface SearchItem {
  id: string;
  category: 'command' | 'app' | 'chat' | 'tool' | 'navigation' | 'alias';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onExecuteCommand,
  onOpenApp,
  onSelectChat,
  osTheme,
  theme,
  language,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const isLight = theme === 'light';

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build searchable items
  const chats = StorageService.getChats();
  const aliases = StorageService.getCustomAliases();

  const allItems: SearchItem[] = [
    // Navigation tabs
    {
      id: 'nav_dashboard',
      category: 'navigation',
      title: language === 'en' ? 'Dashboard' : language === 'ru' ? 'Панель управления' : 'Bosh Sahifa (Dashboard)',
      subtitle: language === 'en' ? 'Overview & Quick actions' : 'Tizim holati va tezkor amallar',
      icon: <Home className="w-4 h-4 text-cyan-400" />,
      action: () => { onSelectTab('dashboard'); onClose(); },
    },
    {
      id: 'nav_chat',
      category: 'navigation',
      title: language === 'en' ? 'Chat Assistant' : language === 'ru' ? 'Чат Ассистент' : 'Suhbat va Buyruqlar (Chat)',
      subtitle: language === 'en' ? 'Interactive local command line' : 'Interaktiv lokal chat seansi',
      icon: <MessageSquare className="w-4 h-4 text-blue-400" />,
      action: () => { onSelectTab('chat'); onClose(); },
    },
    {
      id: 'nav_cc',
      category: 'navigation',
      title: language === 'en' ? 'Command Center 2.0' : language === 'ru' ? 'Командный центр 2.0' : 'Command Center 2.0 (Builder, Aliases, Macros)',
      subtitle: language === 'en' ? 'Builder, aliases, macros' : 'Buyruq konstruktori, taxalluslar va makroslar',
      icon: <Terminal className="w-4 h-4 text-amber-400" />,
      action: () => { onSelectTab('command_center'); onClose(); },
    },
    {
      id: 'nav_tools',
      category: 'navigation',
      title: language === 'en' ? 'Desktop Tools' : language === 'ru' ? 'Инструменты' : 'Desktop Tools (Screenshot, Clipboard, Audio)',
      subtitle: language === 'en' ? 'Screenshot, clipboard, audio, hardware' : 'Skrinshot, bufer, ovoz va apparat diagnostikasi',
      icon: <Wrench className="w-4 h-4 text-purple-400" />,
      action: () => { onSelectTab('tools'); onClose(); },
    },
    {
      id: 'nav_plugins',
      category: 'navigation',
      title: language === 'en' ? 'Plugins' : language === 'ru' ? 'Плагины' : 'Pluginlar Boshqaruvi',
      subtitle: language === 'en' ? 'Enable or disable local plugins' : '5 ta lokal plugin sozlamasi',
      icon: <Plug className="w-4 h-4 text-emerald-400" />,
      action: () => { onSelectTab('plugins'); onClose(); },
    },
    {
      id: 'nav_projects',
      category: 'navigation',
      title: language === 'en' ? 'Projects' : language === 'ru' ? 'Проекты' : 'Loyihalar va Kataloglar',
      subtitle: language === 'en' ? 'Grouped command workspaces' : 'Ish joylari va kataloglar',
      icon: <FolderKanban className="w-4 h-4 text-teal-400" />,
      action: () => { onSelectTab('projects'); onClose(); },
    },
    {
      id: 'nav_settings',
      category: 'navigation',
      title: language === 'en' ? 'Settings & Security' : language === 'ru' ? 'Настройки' : 'Sozlamalar va Xavfsizlik',
      subtitle: language === 'en' ? 'Permissions, OS theme, settings.json' : 'Ruxsatlar, OS temasi, settings.json',
      icon: <SettingsIcon className="w-4 h-4 text-sky-400" />,
      action: () => { onSelectTab('settings'); onClose(); },
    },

    // 11 Local Apps
    {
      id: 'app_calc',
      category: 'app',
      title: 'Kalkulyator (Calculator)',
      subtitle: 'open calculator • calc.exe',
      icon: <LayoutGrid className="w-4 h-4 text-cyan-400" />,
      action: () => { onOpenApp('calculator'); onClose(); },
    },
    {
      id: 'app_notepad',
      category: 'app',
      title: 'Bloknot (Notepad)',
      subtitle: 'open notepad • notepad.exe',
      icon: <LayoutGrid className="w-4 h-4 text-blue-400" />,
      action: () => { onOpenApp('notepad'); onClose(); },
    },
    {
      id: 'app_cmd',
      category: 'app',
      title: 'CMD Terminal / Console',
      subtitle: 'open cmd • cmd.exe',
      icon: <Terminal className="w-4 h-4 text-zinc-300" />,
      action: () => { onOpenApp('cmd'); onClose(); },
    },
    {
      id: 'app_explorer',
      category: 'app',
      title: 'Fayl Menejeri (Explorer)',
      subtitle: 'open file explorer • explorer.exe',
      icon: <LayoutGrid className="w-4 h-4 text-amber-400" />,
      action: () => { onOpenApp('explorer'); onClose(); },
    },
    {
      id: 'app_taskmgr',
      category: 'app',
      title: 'Vazifalar Menejeri (Task Manager)',
      subtitle: 'open task manager • taskmgr.exe',
      icon: <LayoutGrid className="w-4 h-4 text-rose-400" />,
      action: () => { onOpenApp('taskmgr'); onClose(); },
    },
    {
      id: 'app_clock',
      category: 'app',
      title: 'Soat va Taymer (Clock)',
      subtitle: 'open clock • ms-clock:',
      icon: <Clock className="w-4 h-4 text-emerald-400" />,
      action: () => { onOpenApp('clock'); onClose(); },
    },

    // Desktop Tools
    {
      id: 'tool_ss',
      category: 'tool',
      title: 'Screenshot (Ekran surati)',
      subtitle: 'Desktop tools: capture screen snapshot',
      icon: <Camera className="w-4 h-4 text-rose-400" />,
      action: () => { onSelectTab('tools'); onClose(); },
    },
    {
      id: 'tool_vol',
      category: 'tool',
      title: 'Ovoz Boshqaruvi (Audio Volume)',
      subtitle: 'Web Audio volume synthesizer & test chime',
      icon: <Volume2 className="w-4 h-4 text-cyan-400" />,
      action: () => { onSelectTab('tools'); onClose(); },
    },
    {
      id: 'tool_hw',
      category: 'tool',
      title: 'Apparat Diagnostikasi (Hardware)',
      subtitle: 'CPU cores, memory, battery, screen stats',
      icon: <Cpu className="w-4 h-4 text-indigo-400" />,
      action: () => { onSelectTab('tools'); onClose(); },
    },

    // Chats
    ...chats.map(c => ({
      id: `chat_${c.id}`,
      category: 'chat' as const,
      title: c.title || 'Nomsiz chat',
      subtitle: `${c.messages.length} ta xabar • Yangilangan: ${new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      icon: <MessageSquare className="w-4 h-4 text-cyan-300" />,
      action: () => { onSelectChat(c.id); onSelectTab('chat'); onClose(); },
    })),

    // Custom Aliases
    ...aliases.map(a => ({
      id: `alias_${a.id}`,
      category: 'alias' as const,
      title: `Taxallus: "${a.alias}"`,
      subtitle: `Target buyruq: "${a.command}"`,
      icon: <Sparkles className="w-4 h-4 text-amber-300" />,
      action: () => { onExecuteCommand(a.command); onSelectTab('chat'); onClose(); },
    })),

    // Commands catalog
    ...ALL_COMMANDS_META.map(cmd => ({
      id: `cmd_${cmd.id}`,
      category: 'command' as const,
      title: cmd.name,
      subtitle: `Misol: "${cmd.example}" • Toifa: ${cmd.category}`,
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      action: () => { onExecuteCommand(cmd.example); onSelectTab('chat'); onClose(); },
    })),
  ];

  const q = query.trim().toLowerCase();
  const filtered = q
    ? allItems.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.subtitle.toLowerCase().includes(q)
      ).slice(0, 10)
    : allItems.slice(0, 8);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      } else if (query.trim()) {
        onExecuteCommand(query.trim());
        onSelectTab('chat');
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 bg-black/75 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
    >
      <div 
        className={`
          w-full max-w-2xl overflow-hidden transition-all duration-200
          ${osTheme === 'macos'
            ? (isLight ? 'rounded-3xl bg-white/95 backdrop-blur-2xl border border-black/15 shadow-2xl text-slate-800' : 'rounded-3xl bg-[#141b2b]/95 backdrop-blur-2xl border border-white/20 shadow-2xl text-zinc-100')
            : osTheme === 'android'
            ? (isLight ? 'rounded-[28px] bg-[#edf4f0] border border-[#d2ded6] shadow-2xl text-slate-900' : 'rounded-[28px] bg-[#16202d] border border-[#27364b] shadow-2xl text-zinc-100')
            : (isLight ? 'rounded-2xl bg-white border border-slate-300 shadow-2xl text-slate-800' : 'rounded-2xl bg-[#0c121e] border border-cyan-500/40 shadow-[0_0_40px_rgba(0,240,255,0.2)] text-zinc-100')
          }
        `}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className={`px-4 py-3.5 border-b flex items-center gap-3 ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-cyan-900/40 bg-black/40'
        }`}>
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              language === 'en' 
                ? 'Search commands, apps, chats, macros, tools (or type any command to run)...' 
                : language === 'ru' 
                ? 'Поиск команд, приложений, чатов, макросов (или введите команду)...' 
                : 'Buyruqlar, dasturlar, chatlar, makroslar va asboblardan qidirish...'
            }
            className={`flex-1 bg-transparent text-sm focus:outline-none font-sans ${
              isLight ? 'text-slate-900 placeholder:text-slate-400' : 'text-zinc-100 placeholder:text-zinc-500'
            }`}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="p-1 rounded text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10 text-zinc-400">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              Hech qanday natija topilmadi. Enter bosib "{query}" buyrug‘ini Chatda to‘g‘ridan-to‘g‘ri bajarishingiz mumkin.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`
                    flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all
                    ${isSelected
                      ? (isLight ? 'bg-cyan-50 border border-cyan-400 text-cyan-950 shadow-xs' : 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 shadow-sm')
                      : (isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-white/5 text-zinc-300')}
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isSelected 
                        ? (isLight ? 'bg-cyan-100 text-cyan-700' : 'bg-cyan-500/20 text-cyan-300') 
                        : (isLight ? 'bg-slate-200 text-slate-700' : 'bg-black/50 text-zinc-400')
                    }`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold truncate">{item.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono uppercase shrink-0 ${
                          item.category === 'command' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                          item.category === 'app' ? 'bg-blue-950 text-blue-400 border border-blue-500/30' :
                          item.category === 'tool' ? 'bg-purple-950 text-purple-400 border border-purple-500/30' :
                          item.category === 'alias' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] opacity-70 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    {isSelected && (
                      <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-cyan-400 opacity-90">
                        Tanlash <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts tip */}
        <div className={`px-4 py-2 border-t flex items-center justify-between text-[11px] font-mono ${
          isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-black/60 border-cyan-900/30 text-zinc-500'
        }`}>
          <div className="flex items-center gap-3">
            <span>↑ ↓ harakat</span>
            <span>↵ tanlash</span>
            <span>ESC yopish</span>
          </div>
          <span className="text-cyan-400/90 font-bold">JARVIS 1.6 Global Omnibox</span>
        </div>
      </div>
    </div>
  );
};
