import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ExternalLink,
  Search,
  Tv,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface YouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  url?: string;
}

export const YouTubeModal: React.FC<YouTubeModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  url = 'https://www.youtube.com'
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  // Default to a tech/Uzbek coding or tech highlight video playlist/embed, or search embed
  const [currentVideoId, setCurrentVideoId] = useState<string>('jfKfPfyJRdk'); // lofi / relax coding live stream as default ambient, or user can search
  const [activeTab, setActiveTab] = useState<'featured' | 'search'>('featured');

  if (!isOpen) return null;

  const currentExternalUrl = searchQuery.trim()
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery.trim())}`
    : url || 'https://www.youtube.com';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Open search in external tab or navigate
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery.trim())}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  const quickVideos = [
    {
      id: 'dQw4w9WgXcQ',
      title: 'YouTube Trend & Musiqa',
      category: 'Musiqa',
    },
    {
      id: 'jfKfPfyJRdk',
      title: 'Lofi & Coding Musiqa (24/7)',
      category: 'Fokus',
    },
    {
      id: 'kJQP7kiw5Fk',
      title: 'Despacito - Global Hit',
      category: 'Musiqa',
    },
    {
      id: 'fJ9rUzIMcZQ',
      title: 'Bohemian Rhapsody',
      category: 'Klassika',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-red-500/40 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.25)] overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border-b border-red-500/30">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>YouTube Video Markazi</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 font-semibold">
                    Mac & Windows
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  JARVIS orqali YouTube-ni to'g'ridan-to'g'ri ko'rish yoki yangi darchada ochish
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={currentExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>YouTube.com da ochish ↗</span>
              </a>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Yopish"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search bar & Quick controls */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-800/80 space-y-3">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="YouTube-dan qidirish (masalan: O'zbekiston, Musiqa, Dasturlash)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-200 text-xs sm:text-sm placeholder:text-slate-500 transition-all outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Qidirish</span>
              </button>

              <a
                href={currentExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-400 border border-red-500/40 font-bold text-xs flex items-center gap-1 shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ochish</span>
              </a>
            </form>

            {/* Quick Suggestions */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-red-400" />
                Tezkor:
              </span>
              {[
                { label: "O'zbekcha Musiqa", q: "uzbek music 2026" },
                { label: "IT va Dasturlash", q: "dasturlash darslari uzbek" },
                { label: "Yangiliklar", q: "ozbekiston yangiliklari" },
                { label: "Kulguli videolar", q: "qiziqarli videolar uzbek" },
                { label: "Fokus Lofi", q: "lofi hip hop radio" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setSearchQuery(item.q);
                    window.open(
                      `https://www.youtube.com/results?search_query=${encodeURIComponent(item.q)}`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-red-950/50 hover:text-red-300 border border-slate-700 hover:border-red-500/40 text-slate-300 shrink-0 transition-colors cursor-pointer"
                >
                  {item.label} ↗
                </button>
              ))}
            </div>
          </div>

          {/* Player & Content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
            {/* Embedded YouTube Player */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-red-500/30 shadow-2xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1`}
                title="YouTube Video Player"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Mac Safari Notice */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-3">
              <div className="text-xs text-slate-300 leading-relaxed">
                <p className="font-semibold text-slate-100 mb-0.5">
                  💡 Apple Mac (Safari / Chrome) foydalanuvchilari uchun:
                </p>
                <p className="text-slate-400">
                  Safari va Mac brauzerlarida popup cheklovi bo'lsa, YouTube-ni to'liq yangi oynada ochish uchun quyidagi qizil tugmani bosing:
                </p>
              </div>

              <a
                href={currentExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>To'liq YouTube.com ↗</span>
              </a>
            </div>

            {/* Recommended stream buttons */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Tezkor Ko'rish Videolari:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {quickVideos.map((vid) => (
                  <button
                    key={vid.id}
                    onClick={() => setCurrentVideoId(vid.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      currentVideoId === vid.id
                        ? 'bg-red-950/50 border-red-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold truncate">{vid.title}</p>
                      <p className="text-[10px] text-slate-400">{vid.category}</p>
                    </div>
                    <span className="text-xs text-red-400 font-bold shrink-0">
                      {currentVideoId === vid.id ? '▶ Ijro etilmoqda' : 'Ko‘rish'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>JARVIS YouTube Integratsiyasi</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
            >
              Yopish
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
