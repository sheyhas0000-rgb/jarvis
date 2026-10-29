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
  ShieldCheck,
  LayoutDashboard,
  Terminal,
  Monitor
} from 'lucide-react';
import { SidebarTab, ChatSession, SupportedLanguage, ActiveOSType } from '../types';
import { t } from '../utils/i18n';

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
  language: SupportedLanguage;
  theme?: 'dark' | 'light';
  osTheme?: ActiveOSType;
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
  language,
  theme = 'dark',
  osTheme = 'windows',
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const strings = t(language);
  const isLight = theme === 'light';

  const navItems: { id: SidebarTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Bosh Sahifa', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'command_center', label: 'Command Center', icon: <Terminal className="w-5 h-5" />, badge: '2.0' },
    { id: 'tools', label: 'Desktop Tools', icon: <Monitor className="w-5 h-5" /> },
    { id: 'recent_chats', label: strings.nav.recent_chats, icon: <Clock className="w-5 h-5" /> },
    { id: 'all_chats', label: strings.nav.all_chats, icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'plugins', label: strings.nav.plugins, icon: <Plug className="w-5 h-5" /> },
    { id: 'projects', label: strings.nav.projects, icon: <FolderKanban className="w-5 h-5" /> },
    { id: 'settings', label: strings.nav.settings, icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  const bottomItems: { id: SidebarTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'updates', label: strings.nav.updates, icon: <Bell className="w-5 h-5" />, badge: 'v1.6' },
    { id: 'profile', label: strings.nav.profile, icon: <User className="w-5 h-5" /> },
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
          backdrop-blur-2xl
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
          ${collapsed ? 'md:w-20' : 'md:w-64'}
          select-none
          ${osTheme === 'macos'
            ? (isLight ? 'bg-white/80 border-r border-black/10 text-slate-800' : 'bg-[#141923]/80 border-r border-white/10 text-zinc-100')
            : osTheme === 'android'
            ? (isLight ? 'bg-slate-100/95 border-r border-slate-200 text-slate-800' : 'bg-[#0c111c]/95 border-r border-slate-800/80 text-zinc-100')
            : (isLight ? 'bg-white/95 border-r border-slate-200 text-slate-800' : 'bg-[#0a0f18]/95 border-r border-cyan-900/30 text-zinc-100')
          }
        `}
      >
        {/* Top Section */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className={`h-16 flex items-center justify-between px-4 border-b ${
            isLight ? 'border-slate-200/80' : (osTheme === 'macos' ? 'border-white/10' : 'border-cyan-900/20')
          }`}>
            <div 
              onClick={() => handleNavClick('chat')}
              className="flex items-center gap-3 cursor-pointer group overflow-hidden"
            >
              <div className={`
                relative flex items-center justify-center w-10 h-10 transition-all
                ${osTheme === 'macos' 
                  ? 'rounded-2xl bg-white/10 border border-white/20 text-white shadow-sm'
                  : osTheme === 'android'
                  ? 'rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                  : 'rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400'
                }
              `}>
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-black/40" />
              </div>
              {!collapsed && (
                <div className="flex flex-col truncate">
                  <span className={`font-bold tracking-wider text-sm flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>
                    {agentName}
                    <span className={`text-[10px] uppercase px-1.5 py-0.5 font-mono ${
                      osTheme === 'macos'
                        ? 'rounded-full bg-white/10 border border-white/20 text-zinc-300'
                        : osTheme === 'android'
                        ? 'rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                        : 'rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400'
                    }`}>
                      {osTheme === 'macos' ? 'macOS 27' : osTheme === 'android' ? 'Android 16' : 'v1.5 LOCAL'}
                    </span>
                  </span>
                  <span className={`text-[11px] truncate flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    {strings.nav.offlineMode}
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={onToggleCollapse}
              className={`hidden md:flex items-center justify-center w-7 h-7 transition-all ${
                osTheme === 'android' ? 'rounded-full' : osTheme === 'macos' ? 'rounded-xl' : 'rounded-lg'
              } text-zinc-400 hover:text-zinc-200 hover:bg-white/10`}
              title={collapsed ? strings.nav.expand : strings.nav.collapse}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-3">
            <button
              onClick={handleNewChatClick}
              className={`
                w-full flex items-center justify-center gap-2.5 py-2.5 px-3 font-medium text-sm transition-all active:scale-98
                ${osTheme === 'macos'
                  ? 'rounded-2xl bg-white/10 hover:bg-white/15 border border-white/25 text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]'
                  : osTheme === 'android'
                  ? 'rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 shadow-sm'
                  : 'rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-500/40 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                }
              `}
              title={strings.nav.newChat}
            >
              <Plus className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{strings.nav.newChat}</span>}
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              
              let activeClass = '';
              if (isActive) {
                if (osTheme === 'macos') {
                  activeClass = isLight 
                    ? 'bg-black/10 text-black border border-black/15 shadow-sm rounded-2xl'
                    : 'bg-white/15 text-white border border-white/25 shadow-sm rounded-2xl';
                } else if (osTheme === 'android') {
                  activeClass = isLight 
                    ? 'bg-emerald-600/15 text-emerald-800 font-bold rounded-full'
                    : 'bg-emerald-500/20 text-emerald-300 font-bold rounded-full';
                } else {
                  activeClass = isLight 
                    ? 'bg-cyan-500/15 text-cyan-800 border border-cyan-400 font-bold rounded-xl'
                    : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.15)] rounded-xl before:content-[\'\'] before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-1 before:bg-cyan-400 before:rounded-r-full';
                }
              } else {
                activeClass = osTheme === 'android' 
                  ? 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-full' 
                  : osTheme === 'macos'
                  ? 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-2xl'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 rounded-xl';
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium
                    transition-all group relative
                    ${activeClass}
                    ${collapsed ? 'justify-center px-0' : ''}
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-inherit' : 'text-zinc-400'}`}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      osTheme === 'macos' ? 'bg-white/10 text-white' : osTheme === 'android' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-950 border border-cyan-500/30 text-cyan-400'
                    }`}>
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
                    {strings.nav.recent_chats}
                  </span>
                  <button 
                    onClick={() => handleNavClick('all_chats')}
                    className="text-[11px] text-cyan-400/80 hover:text-cyan-300"
                  >
                    {language === 'en' ? 'All' : language === 'ru' ? 'Все' : 'Barchasi'}
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
                        <span className="truncate flex-1">{c.title || strings.chat.untitledChat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Items */}
          <div className="p-3 border-t border-cyan-900/20 space-y-1">
            {bottomItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all group relative
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
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-mono font-bold">
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
