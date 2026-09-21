import React from 'react';
import { Clock, MessageSquare, ArrowRight, Plus } from 'lucide-react';
import { ChatSession } from '../types';

interface RecentChatsProps {
  recentChats: ChatSession[];
  activeChatId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onViewAll: () => void;
}

export const RecentChats: React.FC<RecentChatsProps> = ({
  recentChats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onViewAll,
}) => {
  return (
    <div className="h-full flex flex-col p-6 max-w-3xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-cyan-200 flex items-center gap-2">
            <Clock className="w-6 h-6 text-cyan-400" />
            So‘nggi Chatlar
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Eng so‘nggi faol ishlatilgan suhbatlar va lokal buyruqlar seansi
          </p>
        </div>

        <button
          onClick={onNewChat}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-medium shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all"
        >
          <Plus className="w-4 h-4 text-cyan-400" />
          Yangi seans
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {recentChats.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 bg-[#0c121e] border border-cyan-900/20 rounded-2xl">
            Hozircha so‘nggi chatlar mavjud emas.
          </div>
        ) : (
          recentChats.map((chat, idx) => {
            const isActive = chat.id === activeChatId;
            const lastMsg = chat.messages[chat.messages.length - 1];

            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`
                  flex items-center justify-between p-4 rounded-2xl border cursor-pointer
                  transition-all duration-200 group
                  ${isActive 
                    ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_25px_rgba(0,240,255,0.15)] text-cyan-100' 
                    : 'bg-[#0c121e] border-cyan-900/20 hover:border-cyan-700/40 hover:bg-[#0f1726] text-zinc-300'}
                `}
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0
                    ${isActive ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-cyan-400'}
                  `}>
                    #{idx + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold truncate">{chat.title || 'Nomsiz chat'}</h3>
                      {isActive && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                          Hozirgi faol
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 truncate mt-1">
                      {lastMsg ? `So‘nggi xabar: ${lastMsg.text.slice(0, 70)}` : 'Xabarlar yo‘q'}
                    </p>
                    <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-3">
                      <span>{chat.messages.length} ta xabar</span>
                      <span>•</span>
                      <span>Yangilangan: {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-xl text-zinc-500 group-hover:text-cyan-300 group-hover:bg-cyan-950/40 transition-all shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-cyan-900/20 flex justify-center">
        <button
          onClick={onViewAll}
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 py-2 px-4 rounded-xl bg-cyan-950/30 border border-cyan-800/30 hover:border-cyan-600/40 transition-all"
        >
          Barcha chatlarni ko‘rish
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
