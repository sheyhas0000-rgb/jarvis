import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Terminal, 
  Clock, 
  MessageSquare, 
  LayoutGrid, 
  Calculator, 
  FileText, 
  Activity, 
  Folder, 
  Globe, 
  Settings as SettingsIcon, 
  Calendar, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Battery, 
  BatteryCharging, 
  Zap, 
  ArrowRight, 
  Star, 
  Plus, 
  Play, 
  Camera, 
  RotateCcw,
  CheckCircle2,
  Sliders,
  Volume2
} from 'lucide-react';
import { 
  ChatSession, 
  ActiveOSType, 
  SupportedLanguage, 
  WindowsAppId, 
  SidebarTab,
  HardwareDiagnostics
} from '../types';
import { StorageService } from '../services/storageService';
import { detectOSInfo } from '../utils/osDetector';
import { t } from '../utils/i18n';

interface DashboardProps {
  onSelectTab: (tab: SidebarTab) => void;
  onExecuteCommand: (command: string) => void;
  onOpenApp: (appId: WindowsAppId) => void;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onOpenEnvModal: () => void;
  recentChats: ChatSession[];
  activeChatId: string;
  agentName: string;
  osTheme: ActiveOSType;
  theme: 'dark' | 'light';
  language: SupportedLanguage;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectTab,
  onExecuteCommand,
  onOpenApp,
  onSelectChat,
  onNewChat,
  onOpenEnvModal,
  recentChats,
  activeChatId,
  agentName,
  osTheme,
  theme,
  language,
}) => {
  const strings = t(language);
  const isLight = theme === 'light';
  const osInfo = detectOSInfo();

  const [favorites, setFavorites] = useState<WindowsAppId[]>(() => StorageService.getFavoriteApps());
  const [commandHistory, setCommandHistory] = useState<string[]>(() => StorageService.getCommandHistory());
  const [hwStats, setHwStats] = useState<HardwareDiagnostics>({
    cpuCores: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4,
    deviceMemoryGb: typeof navigator !== 'undefined' ? (navigator as any).deviceMemory : undefined,
    screenResolution: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '1920x1080',
    pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
    touchSupport: typeof navigator !== 'undefined' ? navigator.maxTouchPoints > 0 : false,
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    platform: typeof navigator !== 'undefined' ? navigator.platform || 'Local' : 'Local',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  });

  // Battery API check
  useEffect(() => {
    if (typeof navigator !== 'undefined' && (navigator as any).getBattery) {
      (navigator as any).getBattery().then((battery: any) => {
        setHwStats(prev => ({
          ...prev,
          batteryLevel: Math.round(battery.level * 100),
          batteryCharging: battery.charging,
        }));
        battery.addEventListener('levelchange', () => {
          setHwStats(prev => ({ ...prev, batteryLevel: Math.round(battery.level * 100) }));
        });
        battery.addEventListener('chargingchange', () => {
          setHwStats(prev => ({ ...prev, batteryCharging: battery.charging }));
        });
      }).catch(() => {});
    }

    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(est => {
        if (est.usage) {
          setHwStats(prev => ({ ...prev, storageEstimateMb: Math.round(est.usage! / (1024 * 1024)) }));
        }
      }).catch(() => {});
    }
  }, []);

  const handleToggleFavorite = (appId: WindowsAppId, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = StorageService.toggleFavoriteApp(appId);
    setFavorites(updated);
  };

  const appMetaList: { id: WindowsAppId; name: string; icon: React.ReactNode; cmd: string }[] = [
    { id: 'calculator', name: strings.apps.calculator.name, icon: <Calculator className="w-5 h-5 text-cyan-400" />, cmd: 'open calculator' },
    { id: 'notepad', name: strings.apps.notepad.name, icon: <FileText className="w-5 h-5 text-blue-400" />, cmd: 'open notepad' },
    { id: 'cmd', name: strings.apps.cmd.name, icon: <Terminal className="w-5 h-5 text-zinc-300" />, cmd: 'open cmd' },
    { id: 'explorer', name: strings.apps.explorer.name, icon: <Folder className="w-5 h-5 text-amber-400" />, cmd: 'open file explorer' },
    { id: 'taskmgr', name: strings.apps.taskmgr.name, icon: <Activity className="w-5 h-5 text-rose-400" />, cmd: 'open task manager' },
    { id: 'clock', name: strings.apps.clock.name, icon: <Clock className="w-5 h-5 text-emerald-400" />, cmd: 'open clock' },
    { id: 'browser', name: strings.apps.browser.name, icon: <Globe className="w-5 h-5 text-indigo-400" />, cmd: 'open browser' },
    { id: 'calendar', name: strings.apps.calendar.name, icon: <Calendar className="w-5 h-5 text-cyan-400" />, cmd: 'open calendar' },
    { id: 'settings', name: strings.apps.settings.name, icon: <SettingsIcon className="w-5 h-5 text-sky-400" />, cmd: 'open settings' },
    { id: 'control', name: strings.apps.control.name, icon: <LayoutGrid className="w-5 h-5 text-teal-400" />, cmd: 'open control panel' },
  ];

  const quickActions = [
    {
      id: 'qa_calc',
      title: 'Kalkulyator',
      desc: 'open calculator',
      icon: <Calculator className="w-4 h-4 text-cyan-400" />,
      action: () => onOpenApp('calculator'),
    },
    {
      id: 'qa_notepad',
      title: 'Bloknot (Notepad)',
      desc: 'open notepad',
      icon: <FileText className="w-4 h-4 text-blue-400" />,
      action: () => onOpenApp('notepad'),
    },
    {
      id: 'qa_cmd',
      title: 'CMD Terminal',
      desc: 'open cmd',
      icon: <Terminal className="w-4 h-4 text-zinc-300" />,
      action: () => onOpenApp('cmd'),
    },
    {
      id: 'qa_time',
      title: 'Aniq Vaqt & Sana',
      desc: 'time & date',
      icon: <Clock className="w-4 h-4 text-emerald-400" />,
      action: () => { onExecuteCommand('time'); onSelectTab('chat'); },
    },
    {
      id: 'qa_clean',
      title: 'Keshni Tozalash',
      desc: 'kesh tozalash',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      action: () => { onExecuteCommand('kesh tozalash'); onSelectTab('chat'); },
    },
    {
      id: 'qa_ss',
      title: 'Ekran Surati',
      desc: 'Screenshot tool',
      icon: <Camera className="w-4 h-4 text-rose-400" />,
      action: () => onSelectTab('tools'),
    },
  ];

  return (
    <div className="h-full flex flex-col p-4 md:p-6 lg:p-8 max-w-6xl mx-auto overflow-y-auto space-y-6">
      {/* 1. Header Banner & Status */}
      <div className={`p-6 border transition-all ${
        osTheme === 'macos'
          ? (isLight 
              ? 'rounded-3xl bg-white/75 backdrop-blur-2xl border-black/10 shadow-[0_10px_35px_rgba(0,0,0,0.04)] text-slate-800' 
              : 'rounded-3xl bg-[#141b28]/75 backdrop-blur-2xl border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] text-zinc-100')
          : osTheme === 'android'
          ? (isLight 
              ? 'rounded-[28px] bg-[#e3ede7] border-[#ceddd3] shadow-sm text-slate-900' 
              : 'rounded-[28px] bg-[#17212f] border-[#29384d] shadow-sm text-zinc-100')
          : (isLight 
              ? 'rounded-2xl bg-white border-slate-200 shadow-sm text-slate-800' 
              : 'rounded-2xl bg-[#0c121e] border-cyan-900/40 shadow-[0_0_30px_rgba(0,240,255,0.06)] text-zinc-100')
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 flex items-center justify-center shrink-0 transition-all ${
              osTheme === 'macos'
                ? 'rounded-2xl bg-blue-500/15 border border-blue-400/30 text-blue-400'
                : osTheme === 'android'
                ? 'rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                : 'rounded-2xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
            }`}>
              <Bot className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                  {agentName} <span className="font-mono text-cyan-400">1.6</span>
                </h1>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                  osTheme === 'macos' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' :
                  osTheme === 'android' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  'bg-cyan-950 border border-cyan-500/40 text-cyan-300'
                }`}>
                  {osTheme === 'macos' ? 'macOS 27 Liquid Glass' : osTheme === 'android' ? 'Android 16 Material You' : 'Windows 12 Fluent'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  100% Oflayn Lokal
                </span>
              </div>
              <p className={`text-xs max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                {language === 'en'
                  ? 'All local utilities, custom aliases, macros, and offline voice capabilities are ready.'
                  : language === 'ru'
                  ? 'Все локальные утилиты, алиасы, макросы и голосовые команды готовы к работе.'
                  : 'Barcha lokal asboblar, custom taxalluslar, makroslar va ovozli boshqaruv ishlashga tayyor.'}
              </p>
            </div>
          </div>

          {/* Action buttons on banner */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onNewChat}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-all active:scale-95 shadow-sm ${
                osTheme === 'macos'
                  ? 'rounded-2xl bg-blue-600 hover:bg-blue-500 text-white'
                  : osTheme === 'android'
                  ? 'rounded-full bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Seans (Chat)</span>
            </button>

            <button
              onClick={onOpenEnvModal}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-mono border transition-all active:scale-95 ${
                isLight 
                  ? 'rounded-xl bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' 
                  : 'rounded-xl bg-black/40 hover:bg-black/60 border-cyan-900/40 text-cyan-300'
              }`}
              title="Tizim diagnostikasini ko‘rish"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Diagnostika</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Real System Hardware Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`p-4 border transition-all ${
          isLight ? 'rounded-2xl bg-white border-slate-200 text-slate-800 shadow-xs' : 'rounded-2xl bg-[#0c121e] border-cyan-900/30 text-zinc-200'
        }`}>
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider">CPU Yadrolar</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold font-mono text-cyan-400">
            {hwStats.cpuCores} <span className="text-xs font-normal text-zinc-400">Cores</span>
          </div>
          <div className="text-[10px] text-zinc-500 mt-1 truncate">
            {osInfo.rawPlatform}
          </div>
        </div>

        <div className={`p-4 border transition-all ${
          isLight ? 'rounded-2xl bg-white border-slate-200 text-slate-800 shadow-xs' : 'rounded-2xl bg-[#0c121e] border-cyan-900/30 text-zinc-200'
        }`}>
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider">Batareya</span>
            {hwStats.batteryCharging ? (
              <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
            ) : (
              <Battery className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400">
            {hwStats.batteryLevel !== undefined ? `${hwStats.batteryLevel}%` : 'Mavjud emas'}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">
            {hwStats.batteryCharging ? '⚡ Zaryadlanmoqda' : 'Avtonom rejim'}
          </div>
        </div>

        <div className={`p-4 border transition-all ${
          isLight ? 'rounded-2xl bg-white border-slate-200 text-slate-800 shadow-xs' : 'rounded-2xl bg-[#0c121e] border-cyan-900/30 text-zinc-200'
        }`}>
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider">Ekran & Sensor</span>
            <HardDrive className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-sm font-bold font-mono truncate">
            {hwStats.screenResolution}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">
            {hwStats.touchSupport ? 'Touch faol' : 'Sichqoncha / Klaviatura'}
          </div>
        </div>

        <div className={`p-4 border transition-all ${
          isLight ? 'rounded-2xl bg-white border-slate-200 text-slate-800 shadow-xs' : 'rounded-2xl bg-[#0c121e] border-cyan-900/30 text-zinc-200'
        }`}>
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider">Lokal Xotira</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-lg font-bold font-mono text-teal-400">
            {hwStats.storageEstimateMb !== undefined ? `${hwStats.storageEstimateMb} MB` : 'IndexedDB'}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">
            Zero Server / Sandbox
          </div>
        </div>
      </div>

      {/* 3. Tezkor Amallar (Quick Actions) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-wide uppercase flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Tezkor Amallar (Quick Actions)
          </h2>
          <button
            onClick={() => onSelectTab('command_center')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
          >
            Command Center 2.0 <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={action.action}
              className={`p-3.5 border text-left flex flex-col justify-between transition-all group active:scale-95 ${
                osTheme === 'macos'
                  ? (isLight ? 'rounded-2xl bg-white/80 hover:bg-white border-black/10 shadow-xs' : 'rounded-2xl bg-[#121825]/80 hover:bg-[#162030] border-white/10 shadow-sm')
                  : osTheme === 'android'
                  ? (isLight ? 'rounded-[20px] bg-[#dbe6df] hover:bg-[#d0dfd6] border-transparent' : 'rounded-[20px] bg-[#1a2332] hover:bg-[#212d40] border-transparent')
                  : (isLight ? 'rounded-xl bg-white hover:bg-slate-50 border-slate-200 shadow-xs' : 'rounded-xl bg-[#0c121e] hover:bg-[#0f1726] border-cyan-900/30')
              }`}
            >
              <div className="p-2 rounded-lg bg-black/30 dark:bg-black/50 w-fit mb-3 group-hover:scale-105 transition-transform">
                {action.icon}
              </div>
              <div>
                <span className="text-xs font-bold block truncate">{action.title}</span>
                <span className="text-[10px] text-zinc-500 font-mono block truncate mt-0.5">{action.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Sevimli Dasturlar (Favorite Apps Grid with Pin/Unpin) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-wide uppercase flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400/30" />
            Sevimli Dasturlar (11 ta Lokal Dastur)
          </h2>
          <span className="text-[11px] text-zinc-500 font-mono">
            Yulduzcha orqali saralash
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {appMetaList.map(app => {
            const isFav = favorites.includes(app.id);
            return (
              <div
                key={app.id}
                onClick={() => onOpenApp(app.id)}
                className={`p-3.5 border flex items-center justify-between cursor-pointer transition-all group active:scale-98 ${
                  isFav
                    ? (isLight ? 'bg-cyan-50/80 border-cyan-400/60 shadow-xs' : 'bg-cyan-950/30 border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.08)]')
                    : (isLight ? 'bg-white hover:bg-slate-50 border-slate-200' : 'bg-[#0c121e] hover:bg-[#0f1726] border-cyan-900/20')
                } ${osTheme === 'macos' ? 'rounded-2xl' : osTheme === 'android' ? 'rounded-[20px]' : 'rounded-xl'}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-black/30 shrink-0">
                    {app.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate">{app.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono block truncate">{app.cmd}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleToggleFavorite(app.id, e)}
                  className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                    isFav ? 'text-amber-400 hover:text-amber-300' : 'text-zinc-600 hover:text-zinc-400'
                  }`}
                  title={isFav ? "Sevimli ro‘yxatdan chiqarish" : "Sevimlilarga qo‘shish"}
                >
                  <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Two Columns: Oxirgi 3 ta Chat & Oxirgi Bajarilgan Buyruqlar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Oxirgi 3 ta Chat */}
        <div className={`p-5 border space-y-4 ${
          isLight ? 'rounded-2xl bg-white border-slate-200 shadow-sm' : 'rounded-2xl bg-[#0c121e] border-cyan-900/30 shadow-[0_0_20px_rgba(0,240,255,0.05)]'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              Oxirgi Suhbatlar (Recent Chats)
            </h3>
            <button
              onClick={() => onSelectTab('all_chats')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono"
            >
              Barchasi ({recentChats.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {recentChats.slice(0, 3).map((chat, idx) => {
              const lastMsg = chat.messages[chat.messages.length - 1];
              const isCurrent = chat.id === activeChatId;

              return (
                <div
                  key={chat.id}
                  onClick={() => { onSelectChat(chat.id); onSelectTab('chat'); }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isCurrent
                      ? (isLight ? 'bg-cyan-50 border-cyan-400 text-cyan-950 font-medium' : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200')
                      : (isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800' : 'bg-black/30 hover:bg-black/50 border-zinc-800/80 text-zinc-300')
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold truncate">{chat.title || 'Nomsiz chat'}</span>
                      {isCurrent && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-400 font-mono">
                          Hozirgi
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] opacity-70 truncate mt-0.5">
                      {lastMsg ? lastMsg.text.slice(0, 50) : 'Xabarlar yo‘q'}
                    </p>
                    <div className="text-[10px] text-zinc-500 mt-1 font-mono">
                      {chat.messages.length} xabar • {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 opacity-50 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Oxirgi Bajarilgan Commandlar */}
        <div className={`p-5 border space-y-4 ${
          isLight ? 'rounded-2xl bg-white border-slate-200 shadow-sm' : 'rounded-2xl bg-[#0c121e] border-cyan-900/30 shadow-[0_0_20px_rgba(0,240,255,0.05)]'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Oxirgi Bajarilgan Buyruqlar (Tarix)
            </h3>
            <span className="text-xs text-zinc-500 font-mono">
              Oxirgi {Math.min(5, commandHistory.length)} ta
            </span>
          </div>

          <div className="space-y-2">
            {commandHistory.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500 font-mono">
                Hozircha buyruqlar bajarilmadi.
              </div>
            ) : (
              commandHistory.slice(0, 5).map((cmd, idx) => (
                <div
                  key={`${cmd}_${idx}`}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-all ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-zinc-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate flex-1 mr-2">
                    <span className="text-zinc-500 text-[10px]">#{idx + 1}</span>
                    <span className="text-cyan-400 truncate">"{cmd}"</span>
                  </div>

                  <button
                    onClick={() => { onExecuteCommand(cmd); onSelectTab('chat'); }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-[10px] font-semibold transition-all shrink-0 active:scale-95"
                    title="Qayta bajarish"
                  >
                    <Play className="w-3 h-3" />
                    <span>Qayta chaqirish</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
