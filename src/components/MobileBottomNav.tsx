import React from 'react';
import { MessageSquare, FolderGit2, History, Smartphone, Download } from 'lucide-react';

export type AppTabType = 'chat' | 'files' | 'logs' | 'phone';

interface MobileBottomNavProps {
  activeTab: AppTabType;
  onChangeTab?: (tab: AppTabType) => void;
  onTabChange?: (tab: AppTabType) => void;
  chatCount?: number;
  filesCount?: number;
  logsCount?: number;
  isInstallable?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onChangeTab,
  onTabChange,
  chatCount = 0,
  filesCount = 0,
  logsCount = 0,
  isInstallable = false,
}) => {
  const handleTabClick = (tab: AppTabType) => {
    if (onTabChange) {
      onTabChange(tab);
    }
    if (onChangeTab) {
      onChangeTab(tab);
    }
  };
  const navItems: { id: AppTabType; label: string; icon: React.FC<{ className?: string }>; badge?: number | string }[] = [
    {
      id: 'chat',
      label: 'Muloqot',
      icon: MessageSquare,
      badge: chatCount > 0 ? chatCount : undefined,
    },
    {
      id: 'files',
      label: 'Fayllar',
      icon: FolderGit2,
      badge: filesCount > 0 ? filesCount : undefined,
    },
    {
      id: 'logs',
      label: 'Tarix',
      icon: History,
      badge: logsCount > 0 ? logsCount : undefined,
    },
    {
      id: 'phone',
      label: 'Telefon',
      icon: Smartphone,
      badge: isInstallable ? 'APK' : undefined,
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobil asosiy navigatsiya"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
    >
      <div className="grid grid-cols-4 h-15 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`tab-btn-${item.id}`}
              onClick={() => handleTabClick(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 transition-all duration-150 cursor-pointer select-none active:scale-95 ${
                isActive
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              {/* Active neon highlight bar */}
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-sky-300 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              )}

              <div className="relative flex items-center justify-center w-7 h-7">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-cyan-300' : ''}`} />

                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full text-[9px] font-mono font-bold flex items-center justify-center bg-cyan-500 text-slate-950 ring-1 ring-slate-950">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="text-[11px] tracking-tight mt-0.5 font-['Space_Grotesk']">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
