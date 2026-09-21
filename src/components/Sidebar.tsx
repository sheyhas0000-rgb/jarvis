import React from 'react';
import { 
  Bot, 
  Plus, 
  Settings as SettingsIcon, 
  MessageSquare, 
  Clock, 
  Plug, 
  FolderKanban, 
  Bell, 
  User, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { SidebarTab, ChatSession } from '../types';

interface SidebarProps {
  currentTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  onNewChat: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  recentChats: ChatSession[];
  activeChatId: string;
  onSelectChat: (id: string) => void;
  agentName: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onNewChat,
  collapsed,
  onToggleCollapse,
  recentChats,
  activeChatId,
  onSelectChat,
  agentName,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems: { id: SidebarTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'settings', label: 'Sozlamalar', icon: <SettingsIcon className="w-5 h-5" /> },
    { id: 'all_chats', label: 'Chatlar', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'recent_chats', label: 'So‘nggi chatlar', icon: <Clock className="w-5 h-5" /> },
    { id: 'plugins', label: 'Pluginlar', icon: <Plug className="w-5 h-5" /> },
    { id: 'projects', label: 'Loyihalar', icon: <FolderKanban className="w-5 h-5" /> },
  ];

  const bottomItems: { id: SidebarTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'updates', label: 'Yangilanishlar', icon: <Bell className="w-5 h-5" />, badge: 'v1.2' },
    { id: 'profile', label: 'Profil', icon: <User className="w-5 h-5" /> },
  ];

  const handleNavClick = (tab: SidebarTab) => {
    onSelectTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const handleNewChatClick = () => {
    onNewChat();
    onSelectTab('chat');
    if (onCloseMobile) onCloseMobile();
  };

  const handleRecentChatClick = (id: string) => {
    onSelectChat(id);
    onSelectTab('chat');
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-50
          flex flex-col justify-between
          bg-[#0a0f18]/95 backdrop-blur-xl border-r border-cyan-900/30
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
          ${collapsed ? 'md:w-20' : 'md:w-64'}
          select-none
        `}
      >
        {/* Top Section */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-cyan-900/20">
            <div 
              onClick={() => handleNavClick('chat')}
              className="flex items-center gap-3 cursor-pointer group overflow-hidden"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0a0f18]" />
              </div>
              {!collapsed && (
                <div className="flex flex-col truncate">
                  <span className="font-bold tracking-wider text-cyan-300 text-sm flex items-center gap-1.5">
                    {agentName}
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-mono">
                      LOCAL
                    </span>
                  </span>
                  <span className="text-[11px] text-zinc-400 truncate flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    No AI • 100% Oflayn
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-zinc-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-transparent hover:border-cyan-800/40 transition-all"
              title={collapsed ? "Yon panelni ochish" : "Yon panelni yig'ish"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-3">
            <button
              onClick={handleNewChatClick}
              className={`
                w-full flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl
                bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30
                border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 font-medium text-sm
                shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_rgba(0,240,255,0.25)]
                transition-all active:scale-98
              `}
              title="Yangi chat"
            >
              <Plus className="w-5 h-5 text-cyan-400 shrink-0" />
              {!collapsed && <span>Yangi chat</span>}
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1 scrollbar-thin scrollbar-thumb-cyan-950">
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all group relative
                    ${isActive 
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.15)]' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent'}
                    ${collapsed ? 'justify-center px-0' : ''}
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`shrink-0 ${isActive ? 'text-cyan-400' : 'text-zinc-400 group-hover:text-cyan-400'}`}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Inline Recent Chats List (When Expanded) */}
            {!collapsed && recentChats.length > 0 && (
              <div className="pt-4 pb-2">
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                    So‘nggi seanslar
                  </span>
                  <button 
                    onClick={() => handleNavClick('all_chats')}
                    className="text-[11px] text-cyan-400/80 hover:text-cyan-300"
                  >
                    Barchasi
                  </button>
                </div>
                <div className="space-y-1">
                  {recentChats.map(c => {
                    const isChatActive = currentTab === 'chat' && activeChatId === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleRecentChatClick(c.id)}
                        className={`
                          w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs truncate
                          transition-all text-left
                          ${isChatActive 
                            ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 font-medium' 
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'}
                        `}
                      >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60" />
                        <span className="truncate flex-1">{c.title || 'Nomsiz chat'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-cyan-900/20 my-1 mx-3" />

          {/* Bottom Items (Updates & Profile) */}
          <div className="p-3 space-y-1">
            {bottomItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium
                    transition-all group
                    ${isActive 
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent'}
                    ${collapsed ? 'justify-center px-0' : ''}
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`shrink-0 ${isActive ? 'text-cyan-400' : 'text-zinc-400 group-hover:text-cyan-400'}`}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};
