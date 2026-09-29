import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Plus, 
  ShieldCheck, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Terminal, 
  Download, 
  ExternalLink,
  Bot,
  User,
  Sparkles,
  Calculator,
  Clock,
  FileText,
  Palette,
  Folder,
  Activity,
  Settings as SettingsIcon,
  Globe,
  LayoutGrid,
  Calendar
} from 'lucide-react';
import { ChatSession, SupportedLanguage, WindowsAppId } from '../types';
import { t } from '../utils/i18n';

interface ChatWindowProps {
  chat: ChatSession;
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  onRenameChat: (newTitle: string) => void;
  agentName: string;
  isProcessing: boolean;
  language: SupportedLanguage;
  onOpenApp?: (appId: WindowsAppId) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  onSendMessage,
  onClearChat,
  onRenameChat,
  agentName,
  isProcessing,
  language,
  onOpenApp,
}) => {
  const [input, setInput] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(chat.title);
  const [isListening, setIsListening] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showAppsBar, setShowAppsBar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const strings = t(language);

  useEffect(() => {
    setTitleValue(chat.title);
  }, [chat.title]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages, isProcessing]);

  // Web Speech API Voice Input matching selected language
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      // Match active language
      if (language === 'en') {
        recognition.lang = 'en-US';
      } else if (language === 'ru') {
        recognition.lang = 'ru-RU';
      } else {
        recognition.lang = 'uz-UZ';
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          onSendMessage(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onSendMessage, language]);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert(strings.chat.voiceNotSupported);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isProcessing) return;
    onSendMessage(trimmed);
    setInput('');
    setShowQuickMenu(false);
  };

  const handleQuickCommand = (cmd: string) => {
    onSendMessage(cmd);
    setShowQuickMenu(false);
  };

  const handleSaveTitle = () => {
    if (titleValue.trim()) {
      onRenameChat(titleValue.trim());
    }
    setIsEditingTitle(false);
  };

  const appLaunchItems: { id: WindowsAppId; label: string; icon: React.ReactNode; cmd: string }[] = [
    { id: 'calculator', label: strings.apps.calculator.name, icon: <Calculator className="w-3.5 h-3.5 text-cyan-400" />, cmd: 'open calculator' },
    { id: 'clock', label: strings.apps.clock.name, icon: <Clock className="w-3.5 h-3.5 text-emerald-400" />, cmd: 'open clock' },
    { id: 'cmd', label: strings.apps.cmd.name, icon: <Terminal className="w-3.5 h-3.5 text-zinc-300" />, cmd: 'open cmd' },
    { id: 'notepad', label: strings.apps.notepad.name, icon: <FileText className="w-3.5 h-3.5 text-blue-400" />, cmd: 'open notepad' },
    { id: 'paint', label: strings.apps.paint.name, icon: <Palette className="w-3.5 h-3.5 text-purple-400" />, cmd: 'open paint' },
    { id: 'explorer', label: strings.apps.explorer.name, icon: <Folder className="w-3.5 h-3.5 text-amber-400" />, cmd: 'open file explorer' },
    { id: 'taskmgr', label: strings.apps.taskmgr.name, icon: <Activity className="w-3.5 h-3.5 text-rose-400" />, cmd: 'open task manager' },
    { id: 'settings', label: strings.apps.settings.name, icon: <SettingsIcon className="w-3.5 h-3.5 text-sky-400" />, cmd: 'open settings' },
    { id: 'browser', label: strings.apps.browser.name, icon: <Globe className="w-3.5 h-3.5 text-indigo-400" />, cmd: 'open browser' },
    { id: 'control', label: strings.apps.control.name, icon: <LayoutGrid className="w-3.5 h-3.5 text-teal-400" />, cmd: 'open control panel' },
    { id: 'calendar', label: strings.apps.calendar.name, icon: <Calendar className="w-3.5 h-3.5 text-cyan-400" />, cmd: 'open calendar' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070b12] overflow-hidden relative">
      {/* Chat Header */}
      <div className="h-16 px-4 md:px-6 border-b border-cyan-900/30 bg-[#0a0f18]/80 backdrop-blur-md flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
          {isEditingTitle ? (
            <div className="flex items-center gap-1.5 max-w-sm flex-1">
              <input
                type="text"
                value={titleValue}
                onChange={e => setTitleValue(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-black/60 border border-cyan-500 text-sm text-cyan-200 focus:outline-none w-full"
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
              />
              <button
                onClick={handleSaveTitle}
                className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsEditingTitle(false)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 truncate">
              <h2 className="text-sm md:text-base font-bold text-zinc-100 truncate">
                {chat.title || strings.chat.untitledChat}
              </h2>
              <button
                onClick={() => setIsEditingTitle(true)}
                className="p-1 rounded text-zinc-500 hover:text-cyan-300 transition-colors"
                title={strings.chat.rename}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.25)]">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
              v1.4 LOCAL AGENT
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Windows Whitelist
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/30 text-[11px] font-mono text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {strings.header.offline}
          </div>

          <button
            onClick={() => {
              if (confirm(strings.header.clearConfirm)) {
                onClearChat();
              }
            }}
            className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/30 transition-all"
            title={strings.header.clearChat}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Windows 11 Apps Dock / Quick Launch Row */}
      {showAppsBar && (
        <div className="px-4 py-2 bg-[#090e18] border-b border-cyan-900/20 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 select-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            {strings.header.appsDock}:
          </span>
          {appLaunchItems.map(app => (
            <button
              key={app.id}
              onClick={() => {
                if (onOpenApp) {
                  onOpenApp(app.id);
                } else {
                  handleQuickCommand(app.cmd);
                }
              }}
              className="px-2.5 py-1 rounded-xl bg-zinc-900/80 hover:bg-cyan-950/70 border border-cyan-900/40 hover:border-cyan-500/50 text-zinc-300 hover:text-cyan-200 transition-all flex items-center gap-1.5 text-xs shrink-0 active:scale-95 shadow-sm group"
              title={`Windows: ${app.cmd}`}
            >
              {app.icon}
              <span className="group-hover:text-cyan-300 font-medium">{app.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-cyan-950">
        {chat.messages.length === 0 && (
          <div className="py-8 px-4 max-w-xl mx-auto text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-cyan-950/60 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(0,240,255,0.2)]">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-100">{strings.chat.welcomeTitle}</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto leading-relaxed">
                {strings.chat.welcomeSubtitle}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0c121e] border border-cyan-900/40 text-xs text-zinc-300 leading-relaxed text-left">
              <span className="font-semibold text-cyan-300 block mb-1">💡 Windows buyruqlari:</span>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                {strings.chat.welcomeTip}
              </p>
            </div>
          </div>
        )}

        {chat.messages.map(msg => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div className={`
                w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border
                ${isUser
                  ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                  : 'bg-cyan-950/70 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'}
              `}>
                {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Bubble */}
              <div className={`
                flex flex-col space-y-2 rounded-2xl p-4 text-sm leading-relaxed max-w-xl
                ${isUser
                  ? 'bg-blue-600/15 border border-blue-500/30 text-blue-100 rounded-tr-none'
                  : 'bg-[#0c121e] border border-cyan-900/40 text-zinc-200 shadow-[0_0_20px_rgba(0,240,255,0.05)] rounded-tl-none'}
              `}>
                <div className="flex items-center justify-between gap-4 text-[11px] font-mono opacity-60 mb-1">
                  <span>{isUser ? strings.chat.you : agentName}</span>
                  <span>{msg.timeFormatted}</span>
                </div>

                <div className="whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                {/* Windows Command Executed Badge */}
                {msg.commandDetails?.windowsCommand && (
                  <div className="mt-2 p-2.5 rounded-xl bg-black/50 border border-cyan-950 flex items-center gap-2 text-xs font-mono text-cyan-300">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{strings.chat.windowsCommandLabel} {msg.commandDetails.windowsCommand}</span>
                  </div>
                )}

                {/* Web Link if opened */}
                {msg.webLink && (
                  <a
                    href={msg.webLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 text-xs font-medium transition-all"
                  >
                    <span>{strings.chat.openSite} {msg.webLink.title}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {/* Created File Badge / Download */}
                {msg.createdFile && (
                  <div className="mt-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-emerald-300 block">{msg.createdFile.name}</span>
                      <span className="text-[11px] text-zinc-400">
                        {msg.createdFile.location} ({msg.createdFile.size} bayt)
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const blob = new Blob([msg.createdFile?.content || ''], { type: 'text/plain' });
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(blob);
                        a.download = msg.createdFile?.name || 'fayl.txt';
                        a.click();
                      }}
                      className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 flex items-center gap-1 text-[11px]"
                      title="Qayta yuklab olish"
                    >
                      <Download className="w-3.5 h-3.5" /> {strings.chat.downloadFile}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center gap-3 text-cyan-400 text-xs font-mono py-2 animate-pulse">
            <Bot className="w-4 h-4 animate-spin" />
            <span>{strings.chat.processing}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Command Chips */}
      <div className="px-4 py-2 border-t border-cyan-900/20 bg-[#080c14]/90 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[11px] font-mono text-zinc-500 shrink-0">{strings.chat.quick}</span>
        {strings.quickChips.map((chip, i) => (
          <button
            key={i}
            onClick={() => handleQuickCommand(chip)}
            className="px-3 py-1 rounded-full text-xs bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/40 text-cyan-300/90 whitespace-nowrap transition-all shrink-0 active:scale-95"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Command Input Bar */}
      <div className="p-4 bg-[#0a0f18] border-t border-cyan-900/30 shrink-0 relative">
        {/* Quick Menu Popup */}
        {showQuickMenu && (
          <div className="absolute bottom-20 left-4 w-72 bg-[#0c121e] border border-cyan-500/40 rounded-2xl p-2.5 shadow-[0_0_30px_rgba(0,240,255,0.2)] z-20 space-y-1 text-xs max-h-96 overflow-y-auto">
            <div className="px-3 py-1.5 text-[10px] font-bold text-cyan-400/80 uppercase font-mono">
              {strings.chat.quickActionsTitle}
            </div>
            {appLaunchItems.map(app => (
              <button
                key={app.id}
                onClick={() => {
                  if (onOpenApp) {
                    onOpenApp(app.id);
                    setShowQuickMenu(false);
                  } else {
                    handleQuickCommand(app.cmd);
                  }
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-zinc-300 hover:text-cyan-300 hover:bg-cyan-950/60 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  {app.icon} {app.label}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">App</span>
              </button>
            ))}
            <div className="border-t border-zinc-800 my-1" />
            <button
              onClick={() => handleQuickCommand('Vaqt')}
              className="w-full text-left px-3 py-2 rounded-xl text-zinc-300 hover:text-cyan-300 hover:bg-cyan-950/60 flex items-center justify-between"
            >
              <span>⏰ Vaqt va sana</span>
              <span className="text-[10px] text-zinc-500 font-mono">Time</span>
            </button>
            <button
              onClick={() => handleQuickCommand('Tizim holati')}
              className="w-full text-left px-3 py-2 rounded-xl text-zinc-300 hover:text-cyan-300 hover:bg-cyan-950/60 flex items-center justify-between"
            >
              <span>📊 Tizim holati (CPU / RAM)</span>
              <span className="text-[10px] text-zinc-500 font-mono">Status</span>
            </button>
            <button
              onClick={() => handleQuickCommand('Temporary files clean')}
              className="w-full text-left px-3 py-2 rounded-xl text-zinc-300 hover:text-cyan-300 hover:bg-cyan-950/60 flex items-center justify-between"
            >
              <span>🧹 Kesh tozalash (%temp%)</span>
              <span className="text-[10px] text-cyan-400 font-mono">Clean</span>
            </button>
            <button
              onClick={() => handleQuickCommand('Lock PC')}
              className="w-full text-left px-3 py-2 rounded-xl text-zinc-300 hover:text-cyan-300 hover:bg-cyan-950/60 flex items-center justify-between"
            >
              <span>🔒 Kompyuterni bloklash</span>
              <span className="text-[10px] text-amber-400 font-mono">Lock</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="flex items-center gap-2 max-w-4xl mx-auto">
          {/* Plus / Quick Actions Button */}
          <button
            type="button"
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className={`
              w-11 h-11 rounded-2xl flex items-center justify-center border transition-all shrink-0
              ${showQuickMenu 
                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300' 
                : 'bg-zinc-900/80 border-cyan-900/40 text-zinc-400 hover:text-cyan-400 hover:border-cyan-700/50'}
            `}
            title={strings.chat.quickActionsTitle}
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={strings.chat.placeholder}
              className="w-full pl-4 pr-12 py-3 rounded-2xl bg-[#070b12] border border-cyan-900/40 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/70 shadow-inner transition-all"
              disabled={isProcessing}
            />

            {/* Mic Toggle Button */}
            <button
              type="button"
              onClick={toggleVoice}
              className={`
                absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all
                ${isListening 
                  ? 'bg-rose-500/30 text-rose-400 animate-pulse border border-rose-500/50' 
                  : 'text-zinc-400 hover:text-cyan-300'}
              `}
              title={isListening ? strings.chat.voiceActive : strings.chat.voiceInactive}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className={`
              w-11 h-11 rounded-2xl flex items-center justify-center border transition-all shrink-0
              ${input.trim() && !isProcessing
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:bg-cyan-500/35 active:scale-95'
                : 'bg-zinc-900/40 border-zinc-800 text-zinc-600 cursor-not-allowed'}
            `}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
