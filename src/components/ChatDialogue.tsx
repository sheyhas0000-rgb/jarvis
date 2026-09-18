import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Folder,
  FileText,
  ExternalLink,
  Globe,
  Edit3,
  Trash2,
  Bot,
  User,
  Sparkles,
  HardDrive,
  Download,
  Eye,
  X,
  Monitor,
  Smartphone,
  Apple
} from 'lucide-react';
import { ChatMessage, SafeAction, FileItem } from '../types';
import { SpeechHandler } from '../utils/speech';
import { downloadFileToComputer } from '../utils/fileDownloader';
import { downloadOfflineAppHtml } from '../utils/offlineAppGenerator';

interface ChatDialogueProps {
  messages: ChatMessage[];
  isProcessing: boolean;
  onConfirmAction: (action: SafeAction) => void;
  onCancelAction: () => void;
  onOpenFile: (fileName: string) => void;
  onDeleteFile: (fileName: string) => void;
  onRenameFile: (fileName: string) => void;
  onSelectPrompt: (prompt: string) => void;
  onOpenSetup?: () => void;
  onViewFile?: (fileName: string, content?: string, location?: string) => void;
  onOpenDownload?: () => void;
  onOpenYouTube?: (url?: string, query?: string) => void;
}

export const ChatDialogue: React.FC<ChatDialogueProps> = ({
  messages,
  isProcessing,
  onConfirmAction,
  onCancelAction,
  onOpenFile,
  onDeleteFile,
  onRenameFile,
  onSelectPrompt,
  onOpenSetup,
  onViewFile,
  onOpenDownload,
  onOpenYouTube,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const isClientMac = typeof navigator !== 'undefined' && /Macintosh|Mac OS/i.test(navigator.userAgent);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isProcessing]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const starterPrompts = [
    { text: 'salom', label: '👋 Salomlashish' },
    { text: 'sen kimsan', label: '🤖 JARVIS haqida' },
    { text: 'youtubega kir', label: '▶️ YouTube' },
    { text: 'telegramga kir', label: '✈️ Telegram' },
    { text: 'instagramga kir', label: '📸 Instagram' },
    { text: 'chatgptga kir', label: '🤖 ChatGPT' },
    { text: 'Desktopda test.txt yarat', label: '📄 Fayl yaratish' },
    { text: 'Desktopda salom.txt yarat ichiga Salom dunyo deb yoz', label: '✍️ Matn bilan fayl' },
    { text: 'fayllarni och', label: '📂 Fayllarni ochish' },
    { text: 'test.txt faylini och', label: '👁️ Faylni ko‘rish' },
    { text: 'optimizatsiya.bat yarat', label: '⚡ Kesh tozalash skripti' },
    { text: 'har hil narsalar yuklash kerakmi', label: '💡 O‘rnatish va yuklashlar haqida' },
  ];

  return (
    <div
      ref={scrollRef}
      className="flex-1 w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 overflow-y-auto space-y-4 min-h-[350px] max-h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-slate-800"
    >
      {/* Welcome Screen if no messages */}
      {messages.length === 0 && (
        <div className="py-6 px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)] mb-4">
            <Bot className="w-8 h-8 animate-pulse text-cyan-300" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-['Chakra_Petch'] tracking-wide">
            JARVIS Yozma & Ovozli Muloqot
          </h2>

          <p className="mt-2 text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Assalomu alaykum! Men sizning shaxsiy Windows kompyuter yordamchingizman.
            Quyida <strong className="text-cyan-300 font-medium">yozma xabar</strong> yozishingiz
            yoki <strong className="text-cyan-300 font-medium">mikrofon</strong> orqali ovozli buyruq berishingiz mumkin.
          </p>

          <div className="mt-6 max-w-xl mx-auto text-left">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Yozma buyruq namunalari:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {starterPrompts.map((p) => (
                <button
                  key={p.text}
                  onClick={() => onSelectPrompt(p.text)}
                  className="flex flex-col p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 hover:border-cyan-500/40 text-left transition-all group"
                >
                  <span className="text-[11px] font-semibold text-cyan-400 group-hover:text-cyan-300">
                    {p.label}
                  </span>
                  <span className="text-xs text-slate-300 mt-0.5 truncate">
                    "{p.text}"
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Message History */}
      <AnimatePresence initial={false}>
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id ? `${msg.id}-${index}` : `chat-msg-${index}`}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* Bot Avatar for JARVIS */}
            {msg.sender === 'jarvis' && (
              <div className="shrink-0 w-8 h-8 rounded-xl bg-cyan-950/90 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)] mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            {/* Message Bubble Container */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 transition-all shadow-md ${
                msg.sender === 'user'
                  ? 'bg-cyan-950/60 border border-cyan-500/40 text-slate-100 rounded-tr-none'
                  : 'bg-slate-900/95 border border-slate-700/80 text-slate-200 rounded-tl-none backdrop-blur-md'
              }`}
            >
              {/* Header inside bubble */}
              <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-slate-800/60 text-xs">
                <span
                  className={`font-semibold font-['Chakra_Petch'] tracking-wide ${
                    msg.sender === 'user' ? 'text-cyan-300' : 'text-cyan-400'
                  }`}
                >
                  {msg.sender === 'user' ? 'Siz (Buyruq)' : 'JARVIS'}
                </span>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{msg.timeFormatted}</span>

                  {msg.sender === 'jarvis' && (
                    <>
                      {/* Audio playback button */}
                      <button
                        onClick={() => SpeechHandler.speak(msg.text)}
                        title="Ovozli eshitish"
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Copy message button */}
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        title="Nusxa olish"
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Message Text */}
              <div className="text-sm font-medium leading-relaxed whitespace-pre-line text-slate-100 font-['Space_Grotesk']">
                {msg.text}
              </div>

              {/* Status Badge & Created File Card */}
              {msg.sender === 'jarvis' && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex flex-col gap-2.5 text-[11px]">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      JARVIS Tayyor • Qo‘shimcha yuklash shart emas
                    </span>

                    {msg.status === 'success' && (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Bajarildi
                      </span>
                    )}
                    {msg.status === 'info' && (
                      <span className="inline-flex items-center gap-1 text-cyan-400 font-medium">
                        <Sparkles className="w-3.5 h-3.5" /> Javob berildi
                      </span>
                    )}
                    {msg.status === 'error' && (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
                        <XCircle className="w-3.5 h-3.5" /> Xatolik
                      </span>
                    )}
                  </div>

                  {/* Created File Interactive Card */}
                  {(msg.createdFile || (msg.action?.action === 'create_file' && msg.status === 'success')) && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)] space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-100 font-mono truncate">
                              {msg.createdFile?.name || ('name' in (msg.action || {}) ? (msg.action as any).name : 'hujjat.txt')}
                            </p>
                            <p className="text-[11px] text-cyan-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Virtual xotirada yaratildi • Ortiqcha narsa yuklanmaydi</span>
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              const fName = msg.createdFile?.name || ('name' in (msg.action || {}) ? (msg.action as any).name : 'hujjat.txt');
                              const fContent = msg.createdFile?.content ?? ('content' in (msg.action || {}) ? (msg.action as any).content : '');
                              downloadFileToComputer(fName, fContent);
                            }}
                            title="Faylni kompyuteringizga saqlash (ixtiyoriy)"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-[11px] transition-colors border border-slate-700 shadow-sm cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Yuklab olish (Ixtiyoriy)</span>
                          </button>

                          {onViewFile && (
                            <button
                              onClick={() => {
                                const fName = msg.createdFile?.name || ('name' in (msg.action || {}) ? (msg.action as any).name : 'hujjat.txt');
                                const fContent = msg.createdFile?.content ?? ('content' in (msg.action || {}) ? (msg.action as any).content : '');
                                const fLoc = msg.createdFile?.location || msg.action?.location || 'Desktop';
                                onViewFile(fName, fContent, fLoc);
                              }}
                              title="Fayl matnini ko'rish va tahrirlash"
                              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content Preview if available */}
                      {(msg.createdFile?.content || ('content' in (msg.action || {}) && (msg.action as any).content)) && (
                        <div className="p-2 rounded-lg bg-black/60 border border-slate-800/80">
                          <p className="text-[11px] text-slate-400 font-mono line-clamp-2">
                            {msg.createdFile?.content || (msg.action as any).content}
                          </p>
                        </div>
                      )}

                      {/* Tips for .bat execution */}
                      {(msg.createdFile?.name?.endsWith('.bat') || ((msg.action as any)?.name?.endsWith('.bat'))) && (
                        <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-200">
                          <span className="font-semibold text-cyan-300">💡 Ishga tushirish bo‘yicha maslahat:</span> Kompyuteringizda ushbu faylni sichqonchaning o‘ng tugmasi bilan bosib, <em>"Administrator sifatida ishga tushirish"</em> (Run as administrator) ni tanlasangiz, barcha Temp va kesh fayllarini to‘liq tozalaydi!
                        </div>
                      )}
                    </div>
                  )}

                  {/* Web App / Link Launch Card */}
                  {msg.webLink && (
                    <div className={`p-4 rounded-xl border space-y-3 ${
                      msg.webLink.iconType === 'youtube'
                        ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/40 border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.2)]'
                        : 'bg-slate-900/95 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    }`}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`p-2.5 rounded-xl border shrink-0 ${
                            msg.webLink.iconType === 'instagram' ? 'bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-500/20 border-rose-500/50 text-rose-400' :
                            msg.webLink.iconType === 'youtube' ? 'bg-red-600 text-white border-red-400 shadow-md' :
                            msg.webLink.iconType === 'facebook' ? 'bg-blue-950/80 border-blue-500/50 text-blue-400' :
                            msg.webLink.iconType === 'telegram' ? 'bg-sky-950/80 border-sky-500/50 text-sky-400' :
                            msg.webLink.iconType === 'chatgpt' ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400' :
                            msg.webLink.iconType === 'github' ? 'bg-purple-950/80 border-purple-500/50 text-purple-300' :
                            'bg-cyan-950/80 border-cyan-500/50 text-cyan-400'
                          }`}>
                            <Globe className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-100 font-['Chakra_Petch'] truncate flex items-center gap-2">
                              <span>{msg.webLink.title}</span>
                              {msg.webLink.iconType === 'youtube' && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 font-semibold">
                                  Mac & Win
                                </span>
                              )}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate font-mono">
                              {msg.webLink.url}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {msg.webLink.iconType === 'youtube' && onOpenYouTube && (
                            <button
                              onClick={() => onOpenYouTube(msg.webLink?.url, msg.webLink?.title)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-400 border border-red-500/40 font-bold text-xs transition-all cursor-pointer shadow-sm"
                            >
                              <span>📺 Ilova ichida ko'rish</span>
                            </button>
                          )}

                          <a
                            href={msg.webLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all shrink-0 cursor-pointer ${
                              msg.webLink.iconType === 'youtube'
                                ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                            }`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>{msg.webLink.iconType === 'youtube' ? 'YouTube-ni Ochish ↗' : 'Ochish ↗'}</span>
                          </a>
                        </div>
                      </div>

                      {msg.webLink.iconType === 'youtube' && (
                        <p className="text-[11px] text-slate-400/90 pt-1 border-t border-slate-800/80 leading-relaxed">
                          💡 <strong className="text-slate-300">Apple Mac (Safari) va brauzerlar uchun:</strong> Agar brauzer popup oynani avtomatik ochishni cheklasa, yuqoridagi qizil <span className="text-red-400 font-semibold">"YouTube-ni Ochish ↗"</span> tugmasini bosing yoki <span className="text-red-300 font-semibold">"Ilova ichida ko'rish"</span> orqali bevosita JARVIS-da tomosha qiling.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Download & Installation Card */}
                  {msg.action?.action === 'open_download_modal' && (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                            <Download className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-100 font-['Chakra_Petch']">
                              JARVIS Dasturini O'rnatish
                            </h4>
                            <p className="text-[11px] text-cyan-300/80">
                              Windows (.exe), macOS va Android uchun
                            </p>
                          </div>
                        </div>

                        {onOpenDownload && (
                          <button
                            onClick={onOpenDownload}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all cursor-pointer shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>O'rnatish oynasini ochish</span>
                          </button>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                        <button
                          onClick={() => downloadOfflineAppHtml('jarvis.html')}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5 text-cyan-400" />
                          <span>⚡ jarvis.html ni yuklab olish (Original dizayn)</span>
                        </button>
                        <a
                          href="/jarvis.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-xs font-semibold transition-all flex items-center gap-1"
                        >
                          <span>Ochish ↗</span>
                        </a>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <button
                          onClick={onOpenDownload}
                          className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors text-[11px] font-medium gap-1"
                        >
                          <Monitor className="w-4 h-4 text-cyan-400" />
                          <span>Windows (.exe)</span>
                        </button>
                        <button
                          onClick={onOpenDownload}
                          className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors text-[11px] font-medium gap-1"
                        >
                          <Smartphone className="w-4 h-4 text-emerald-400" />
                          <span>Android APK</span>
                        </button>
                        <button
                          onClick={onOpenDownload}
                          className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors text-[11px] font-medium gap-1"
                        >
                          <Apple className="w-4 h-4 text-purple-400" />
                          <span>macOS</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Inline Confirmation Card for Delete / Sensitive Actions */}
              {msg.pendingConfirmation && (
                <div className="mt-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/50">
                  <div className="flex items-center gap-2 text-amber-300 mb-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className="font-semibold text-xs sm:text-sm">
                      {msg.pendingConfirmation.message}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-3">
                    Ushbu amalni kompyuteringizda tasdiqlaysizmi?
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onConfirmAction(msg.pendingConfirmation!.action)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-[0_0_10px_rgba(244,63,94,0.4)] transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      HA, O‘CHIRISH
                    </button>
                    <button
                      onClick={onCancelAction}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      BEKOR QILISH
                    </button>
                  </div>
                </div>
              )}

              {/* Inline Files Explorer if action returned listed items */}
              {msg.fileItems && msg.fileItems.length > 0 && (
                <div className="mt-3 rounded-xl border border-slate-700/80 bg-slate-950/70 overflow-hidden">
                  <div className="px-3 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-bold">Topilgan fayllar ({msg.fileItems.length}):</span>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-800/60 max-h-48 overflow-y-auto">
                    {msg.fileItems.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between px-3 py-2 hover:bg-slate-850/60 transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {item.type === 'folder' ? (
                            <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                          )}
                          <span className="text-xs text-slate-200 truncate">{item.name}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => onOpenFile(item.name)}
                            title="Ochish"
                            className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onRenameFile(item.name)}
                            title="Nomini o'zgartirish"
                            className="p-1 rounded text-slate-400 hover:text-amber-300 hover:bg-slate-800"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteFile(item.name)}
                            title="O'chirish"
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            {msg.sender === 'user' && (
              <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Typing / Processing indicator */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-950/90 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Bot className="w-4 h-4 animate-spin text-cyan-400" />
          </div>
          <div className="px-4 py-2.5 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>JARVIS Windows operatsiyasini bajarmoqda...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
