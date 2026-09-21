import React, { useState } from 'react';
import { 
  Search, 
  MessageSquare, 
  Trash2, 
  Edit2, 
  Archive, 
  Plus, 
  Check, 
  X,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ChatSession } from '../types';

interface ChatHistoryProps {
  chats: ChatSession[];
  activeChatId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onDeleteChat: (id: string) => void;
  onArchiveChat: (id: string) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onRenameChat,
  onDeleteChat,
  onArchiveChat,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  // Filter chats by search
  const filtered = chats.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.messages.some(m => m.text.toLowerCase().includes(searchTerm.toLowerCase()));
    if (showArchived) return matchesSearch && c.isArchived;
    return matchesSearch && !c.isArchived;
  });

  // Group by Today, Yesterday, Older
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;

  const todayChats = filtered.filter(c => c.updatedAt >= todayStart);
  const yesterdayChats = filtered.filter(c => c.updatedAt >= yesterdayStart && c.updatedAt < todayStart);
  const olderChats = filtered.filter(c => c.updatedAt < yesterdayStart);

  const startEditing = (chat: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const saveEditing = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameChat(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const renderChatGroup = (title: string, groupChats: ChatSession[]) => {
    if (groupChats.length === 0) return null;

    return (
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 px-2 text-[11px] font-bold tracking-wider text-cyan-400/70 uppercase">
          <Clock className="w-3.5 h-3.5" />
          <span>{title}</span>
          <span className="ml-auto text-[10px] text-zinc-500 font-mono">
            {groupChats.length} ta
          </span>
        </div>

        <div className="space-y-1.5">
          {groupChats.map(chat => {
            const isActive = chat.id === activeChatId;
            const isEditing = chat.id === editingId;

            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`
                  group relative flex items-center justify-between p-3.5 rounded-xl border
                  cursor-pointer transition-all duration-200
                  ${isActive
                    ? 'bg-cyan-950/40 border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.1)] text-cyan-200'
                    : 'bg-[#0c121e]/80 border-cyan-900/20 hover:border-cyan-700/40 hover:bg-[#0f1726] text-zinc-300'}
                `}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                    ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-zinc-800 text-zinc-400 group-hover:text-cyan-400'}
                  `}>
                    <MessageSquare className="w-4 h-4" />
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-1.5 flex-1" onClick={e => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="flex-1 bg-black/60 border border-cyan-500/60 rounded px-2 py-1 text-xs text-cyan-200 focus:outline-none"
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') saveEditing(chat.id, e);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <button 
                        onClick={e => saveEditing(chat.id, e)}
                        className="p-1 rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={cancelEditing}
                        className="p-1 rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{chat.title || 'Nomsiz chat'}</span>
                        {chat.isArchived && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400">
                            Arxiv
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate mt-0.5 flex items-center gap-2">
                        <span>{chat.messages.length} ta xabar</span>
                        <span>•</span>
                        <span>{new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover Actions */}
                {!isEditing && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => startEditing(chat, e)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-cyan-300 hover:bg-cyan-950/60 transition-all"
                      title="Nomini o‘zgartirish"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onArchiveChat(chat.id);
                      }}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-300 hover:bg-amber-950/60 transition-all"
                      title={chat.isArchived ? "Arxivdan chiqarish" : "Arxivlash"}
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (confirm(`"${chat.title}" chatini o‘chirishni tasdiqlaysizmi?`)) {
                          onDeleteChat(chat.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-950/60 transition-all"
                      title="O‘chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col p-6 max-w-4xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-cyan-200 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-cyan-400" />
            Lokal Chatlar Tarixi
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Barcha suhbatlar va buyruqlar 100% lokal xotirada saqlanadi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`
              px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5
              ${showArchived 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'}
            `}
          >
            <Archive className="w-3.5 h-3.5" />
            {showArchived ? 'Arxivlanganlar' : 'Faol chatlar'}
          </button>

          <button
            onClick={onNewChat}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-medium shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all active:scale-98"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            Yangi seans
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Chatlar bo‘yicha qidirish..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0c121e] border border-cyan-900/30 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60 shadow-inner transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Chat Groups */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/40 border border-cyan-800/30 flex items-center justify-center text-cyan-400 mb-3">
              <MessageSquare className="w-6 h-6 opacity-60" />
            </div>
            <p className="text-sm font-medium text-zinc-400">
              {searchTerm ? 'Qidiruv bo‘yicha chatlar topilmadi' : 'Hozircha birorta ham chat mavjud emas'}
            </p>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              Yangi seans ochish uchun "Yangi seans" tugmasini bosing.
            </p>
            <button
              onClick={onNewChat}
              className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-medium"
            >
              <Plus className="w-4 h-4" />
              Yangi seans boshlash
            </button>
          </div>
        ) : (
          <>
            {renderChatGroup('BUGUN', todayChats)}
            {renderChatGroup('KECHA', yesterdayChats)}
            {renderChatGroup('OLDINGI SEANSLAR', olderChats)}
          </>
        )}
      </div>
    </div>
  );
};
