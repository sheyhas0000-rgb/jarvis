import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { Settings } from './components/Settings';
import { ChatHistory } from './components/ChatHistory';
import { RecentChats } from './components/RecentChats';
import { Plugins } from './components/Plugins';
import { Projects } from './components/Projects';
import { Updates } from './components/Updates';
import { ProfileModal } from './components/ProfileModal';
import { PermissionModal } from './components/PermissionModal';
import { WindowsAppModal } from './components/WindowsAppModal';
import { LogPanel } from './components/LogPanel';
import { SystemEnvModal } from './components/SystemEnvModal';
import { Dashboard } from './components/Dashboard';
import { CommandCenter } from './components/CommandCenter';
import { DesktopTools } from './components/DesktopTools';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { 
  SidebarTab, 
  ChatSession, 
  ChatMessage, 
  AppSettings, 
  LocalPlugin, 
  Project, 
  PendingPermission,
  WindowsAppId,
  SupportedLanguage,
  OSThemePreference
} from './types';
import { StorageService } from './services/storageService';
import { ChatService } from './services/chatService';
import { PluginService } from './services/pluginService';
import { ProjectService } from './services/projectService';
import { CommandService } from './services/commandService';
import { LocalAgentBridge } from './services/localAgentBridge';
import { TTSService } from './services/ttsService';
import { normalizeLang, t } from './utils/i18n';
import { detectOSInfo, getEffectiveOSType, getOSThemeTokens } from './utils/osDetector';
import { 
  Menu, 
  Globe, 
  LayoutGrid, 
  ShieldCheck, 
  Moon, 
  Sun, 
  Terminal, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Laptop, 
  Monitor, 
  Smartphone, 
  Cpu, 
  Check, 
  Plus, 
  Minus, 
  X,
  MessageSquare,
  Clock,
  Plug,
  FolderKanban,
  Settings as SettingsIcon,
  Search,
  LayoutDashboard
} from 'lucide-react';

export default function App() {
  // Navigation - default to professional Dashboard in v1.6
  const [currentTab, setCurrentTab] = useState<SidebarTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Command Execution Log Panel (v1.5)
  const [isLogPanelOpen, setIsLogPanelOpen] = useState(false);

  // System Environment & OS Diagnostics Modal
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);

  // Local Agent Connection Status
  const [isAgentConnected, setIsAgentConnected] = useState(false);

  // Active Windows Application Modal (11 applications)
  const [activeAppWindow, setActiveAppWindow] = useState<WindowsAppId | null>(null);

  // Poll local agent status
  useEffect(() => {
    let isMounted = true;
    const check = async () => {
      const ok = await LocalAgentBridge.checkStatus();
      if (isMounted) setIsAgentConnected(ok);
    };
    check();
    const interval = setInterval(check, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Core Data State
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());
  const [chats, setChats] = useState<ChatSession[]>(() => StorageService.getChats());
  const [activeChatId, setActiveChatId] = useState<string>(() => StorageService.getActiveChatId());
  const [plugins, setPlugins] = useState<LocalPlugin[]>(() => StorageService.getPlugins());
  const [projects, setProjects] = useState<Project[]>(() => StorageService.getProjects());

  // Execution & Permission state
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingPermission, setPendingPermission] = useState<PendingPermission | null>(null);

  const activeLanguage: SupportedLanguage = normalizeLang(settings.language);
  const strings = t(activeLanguage);

  // Calculate dynamic OS theme tokens
  const effectiveOS = getEffectiveOSType(settings.osTheme);
  const detectedInfo = detectOSInfo();
  const themeTokens = getOSThemeTokens(effectiveOS, settings.theme);
  const isLight = settings.theme === 'light';

  // Sync active chat object
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0] || ChatService.createNewChat();

  // Keep HTML document metadata in sync with language and OS theme
  useEffect(() => {
    document.documentElement.lang = activeLanguage;
    const osSuffix = effectiveOS === 'macos' ? 'macOS 27' : effectiveOS === 'android' ? 'Android 16' : 'Windows 12';
    if (activeLanguage === 'en') {
      document.title = `JARVIS Assistant v1.6.0 (${osSuffix})`;
    } else if (activeLanguage === 'ru') {
      document.title = `JARVIS Ассистент v1.6.0 (${osSuffix})`;
    } else {
      document.title = `JARVIS Yordamchisi v1.6.0 (${osSuffix})`;
    }
  }, [activeLanguage, effectiveOS]);

  // Global Keyboard Shortcuts (Ctrl+K, Ctrl+Shift+D/C/T/L)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Omnibox Search: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
      // Dashboard: Ctrl+Shift+D
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setCurrentTab('dashboard');
      }
      // Command Center: Ctrl+Shift+C
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setCurrentTab('command_center');
      }
      // Desktop Tools: Ctrl+Shift+T
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setCurrentTab('tools');
      }
      // Theme Toggle: Ctrl+Shift+L
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setSettings(prev => {
          const nextTheme = prev.theme === 'light' ? 'dark' : 'light';
          const updated = { ...prev, theme: nextTheme as 'dark' | 'light' };
          StorageService.saveSettings(updated);
          return updated;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load / Refresh lists from services
  const refreshState = useCallback(() => {
    setChats(ChatService.getChats());
    setActiveChatId(StorageService.getActiveChatId());
    setPlugins(PluginService.getPlugins());
    setProjects(ProjectService.getProjects());
    setSettings(StorageService.getSettings());
  }, []);

  // Handle New Chat creation
  const handleNewChat = () => {
    const newChat = ChatService.createNewChat();
    refreshState();
    setActiveChatId(newChat.id);
    setCurrentTab('chat');
  };

  // Handle Select Chat
  const handleSelectChat = (id: string) => {
    ChatService.setActiveChat(id);
    setActiveChatId(id);
    setCurrentTab('chat');
  };

  // Handle Chat Rename
  const handleRenameChat = (id: string, newTitle: string) => {
    ChatService.renameChat(id, newTitle);
    refreshState();
  };

  // Handle Chat Delete
  const handleDeleteChat = (id: string) => {
    ChatService.deleteChat(id);
    refreshState();
  };

  // Handle Archive Chat
  const handleArchiveChat = (id: string) => {
    ChatService.archiveChat(id);
    refreshState();
  };

  // Clear current active chat messages
  const handleClearCurrentChat = () => {
    ChatService.clearChat(activeChat.id);
    refreshState();
  };

  // Quick 1-click language switcher
  const handleSetLanguage = (lang: SupportedLanguage) => {
    const updated = { ...settings, language: lang };
    StorageService.saveSettings(updated);
    setSettings(updated);
  };

  // Quick OS Theme preference updater
  const handleSetOSTheme = (osPref: OSThemePreference) => {
    const updated = { ...settings, osTheme: osPref };
    StorageService.saveSettings(updated);
    setSettings(updated);
  };

  // Central Command Execution Pipeline
  const executeCommandProcess = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    // 1. Add user message
    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
    };
    ChatService.addMessage(activeChat.id, userMsg);
    refreshState();

    setIsProcessing(true);

    try {
      // 2. Parse command
      const parsed = CommandService.parse(text.trim());

      // 3. Check for permission requirements
      if (parsed.permissionType) {
        const permType = parsed.permissionType;
        const permRule = settings.permissions[permType];

        if (!permRule?.enabled) {
          const deniedMsg: ChatMessage = {
            id: `msg_denied_${Date.now()}`,
            sender: 'jarvis',
            text: `⚠️ Ruxsat cheklangan: "${permType}" toifasiga Sozlamalar bo‘limida ruxsat berilmagan. Buyruqni bajarish uchun avval ruxsatni yoqing.`,
            timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now(),
            status: 'error',
          };
          ChatService.addMessage(activeChat.id, deniedMsg);
          refreshState();
          setIsProcessing(false);
          return;
        }

        if (permRule?.requireConfirmation) {
          setPendingPermission({
            id: `perm_${Date.now()}`,
            commandText: text.trim(),
            permissionType: permType,
            actionTitle: parsed.title || 'Lokal Amal',
            details: parsed.confirmationMessage || 'Ushbu amalni lokal kompyuterda bajarishga ruxsat berasizmi?',
            onConfirm: async () => {
              setPendingPermission(null);
              await finalizeExecution(text, parsed);
            },
            onCancel: () => {
              setPendingPermission(null);
              const cancelMsg: ChatMessage = {
                id: `msg_cancel_${Date.now()}`,
                sender: 'jarvis',
                text: '❌ Foydalanuvchi tomonidan bekor qilindi.',
                timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: Date.now(),
                status: 'info',
              };
              ChatService.addMessage(activeChat.id, cancelMsg);
              refreshState();
              setIsProcessing(false);
            },
          });
          return;
        }
      }

      // If no permission roadblock, execute directly
      await finalizeExecution(text, parsed);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        sender: 'jarvis',
        text: `❌ ${err.message || 'Lokal xatolik yuz berdi'}`,
        timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        status: 'error',
      };
      ChatService.addMessage(activeChat.id, errorMsg);
      refreshState();
      setIsProcessing(false);
    }
  };

  const finalizeExecution = async (rawText: string, parsed: any) => {
    try {
      const result = await CommandService.execute(rawText, false, activeLanguage);

      // Handle opening of simulated or real Windows app modal
      if (result.openedApp) {
        setActiveAppWindow(result.openedApp);
      }

      // Handle closing of application modal
      if (result.closedApp) {
        if (activeAppWindow === result.closedApp || !activeAppWindow) {
          setActiveAppWindow(null);
        }
      }

      const jarvisMsg: ChatMessage = {
        id: `msg_jarvis_${Date.now()}`,
        sender: 'jarvis',
        text: result.message,
        timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        status: result.success ? 'success' : 'error',
        commandDetails: {
          commandId: parsed.commandId,
          category: parsed.category,
          permissionUsed: parsed.permissionType,
          windowsCommand: result.windowsCommand,
          executedAt: new Date().toLocaleTimeString(),
        },
        fileItems: result.fileItems,
        createdFile: result.createdFile,
        webLink: result.webLink,
        isRealWindows: result.isRealWindows,
      };

      ChatService.addMessage(activeChat.id, jarvisMsg);
      refreshState();

      // Trigger Text-to-Speech (TTS) voice if enabled in settings
      if (settings.ttsEnabled) {
        const textToSpeak = result.speechText || result.message;
        TTSService.speak(textToSpeak, activeLanguage);
      }

      // Sound notification if enabled
      if (settings.soundEnabled) {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = result.success ? 'sine' : 'square';
          osc.frequency.setValueAtTime(result.success ? 880 : 330, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.15);
        } catch (e) {}
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        sender: 'jarvis',
        text: `❌ ${err.message || 'Lokal xatolik'}`,
        timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        status: 'error',
      };
      ChatService.addMessage(activeChat.id, errorMsg);
      refreshState();
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle Plugin handler
  const handleTogglePlugin = (pluginId: string) => {
    PluginService.togglePlugin(pluginId);
    refreshState();
  };

  // Projects handlers
  const handleCreateProject = (name: string, description: string, color: string, icon: string) => {
    ProjectService.createProject(name, description, color, icon);
    refreshState();
  };

  const handleDeleteProject = (id: string) => {
    ProjectService.deleteProject(id);
    refreshState();
  };

  // Settings update handler
  const handleUpdateSettings = (newSettings: AppSettings) => {
    StorageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  // Clear all data
  const handleClearAllData = () => {
    StorageService.clearAllData();
    refreshState();
    setCurrentTab('chat');
  };

  return (
    <div className={`flex h-screen w-screen font-sans overflow-hidden select-none transition-colors duration-300 ${themeTokens.rootClass}`}>
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onNewChat={handleNewChat}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        recentChats={ChatService.getRecentChats(3)}
        activeChatId={activeChat.id}
        onSelectChat={handleSelectChat}
        agentName={settings.agentName}
        language={activeLanguage}
        theme={settings.theme}
        osTheme={effectiveOS}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Universal Adaptive Top Bar */}
        <header className={`h-13 px-3 sm:px-4 flex items-center justify-between z-20 shrink-0 select-none transition-all ${themeTokens.topBarClass}`}>
          {/* Left: Mobile Menu + macOS Traffic Lights / Brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-xl text-zinc-400 hover:text-cyan-400 hover:bg-cyan-950/40"
              title="Menyu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* macOS Mode: Iconic Liquid Glass Traffic Lights on Header */}
            {effectiveOS === 'macos' && (
              <div className="hidden sm:flex items-center gap-2 mr-2">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:brightness-110 flex items-center justify-center transition-all group cursor-pointer shadow-xs"
                  title="Yon panelni yopish / ochish"
                >
                  <X className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={() => setIsLogPanelOpen(prev => !prev)}
                  className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:brightness-110 flex items-center justify-center transition-all group cursor-pointer shadow-xs"
                  title="Loglar panelini ochish"
                >
                  <Minus className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={handleNewChat}
                  className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] hover:brightness-110 flex items-center justify-center transition-all group cursor-pointer shadow-xs"
                  title="Yangi seans ochish"
                >
                  <Plus className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            )}

            {/* Brand Logo & Name */}
            <div className="flex items-center gap-2 truncate">
              <span className={`font-bold text-xs md:text-sm tracking-wider flex items-center gap-1.5 font-mono ${
                effectiveOS === 'macos' ? 'text-blue-500 dark:text-blue-400' : effectiveOS === 'android' ? 'text-emerald-600 dark:text-emerald-400' : 'text-cyan-600 dark:text-cyan-400'
              }`}>
                <span className={`w-2 h-2 rounded-full animate-pulse ${
                  effectiveOS === 'macos' ? 'bg-blue-400' : effectiveOS === 'android' ? 'bg-emerald-400' : 'bg-cyan-400'
                }`} />
                {settings.agentName}
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                effectiveOS === 'macos'
                  ? 'rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400'
                  : effectiveOS === 'android'
                  ? 'rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                  : 'rounded-md bg-cyan-950/80 border border-cyan-500/30 text-cyan-400'
              }`}>
                {effectiveOS === 'macos' ? 'macOS 27' : effectiveOS === 'android' ? 'Android 16' : 'Windows 12'}
              </span>
            </div>
          </div>

          {/* Center: Quick OS Concept Theme Selector (Auto / macOS / Windows / Android) */}
          <div className="hidden lg:flex items-center p-1 rounded-xl border bg-black/30 dark:bg-black/50 border-white/10 dark:border-white/10 text-xs">
            <button
              onClick={() => handleSetOSTheme('auto')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                settings.osTheme === 'auto'
                  ? 'bg-cyan-500/30 text-cyan-300 font-bold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Avtomatik aniqlash (Auto OS Detection)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto ({detectedInfo.detectedOSName})</span>
            </button>

            <button
              onClick={() => handleSetOSTheme('macos')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                settings.osTheme === 'macos'
                  ? 'bg-blue-500/30 text-blue-300 font-bold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="macOS 27 Liquid Glass Concept"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>macOS 27</span>
            </button>

            <button
              onClick={() => handleSetOSTheme('windows')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                settings.osTheme === 'windows'
                  ? 'bg-cyan-500/30 text-cyan-300 font-bold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Windows 12 Fluent Mica Concept"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Win 12</span>
            </button>

            <button
              onClick={() => handleSetOSTheme('android')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                settings.osTheme === 'android'
                  ? 'bg-emerald-500/30 text-emerald-300 font-bold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Android 16 Material You Expressive Concept"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android 16</span>
            </button>
          </div>

          {/* Right Controls: Search + Diagnostics Badge + Theme + Logs + Lang + Apps */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Global Search Omnibox Trigger (Ctrl+K) */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all active:scale-95 cursor-pointer ${
                effectiveOS === 'macos'
                  ? 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-400/30 text-blue-300'
                  : effectiveOS === 'android'
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
                  : 'bg-cyan-950/40 hover:bg-cyan-900/50 border-cyan-800/40 text-cyan-300'
              }`}
              title="Qidiruv (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-semibold">Qidiruv</span>
              <kbd className="hidden lg:inline text-[9px] bg-black/40 px-1.5 py-0.5 rounded border border-white/10 font-bold">
                Ctrl+K
              </kbd>
            </button>

            {/* Interactive System Environment / Diagnostics Button (No fake stats!) */}
            <button
              onClick={() => setIsEnvModalOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all active:scale-95 cursor-pointer ${
                effectiveOS === 'macos'
                  ? 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-400/30 text-blue-300'
                  : effectiveOS === 'android'
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
                  : 'bg-cyan-950/40 hover:bg-cyan-900/50 border-cyan-800/40 text-cyan-300'
              }`}
              title="Haqiqiy OS va Tizim diagnostikasini ko‘rish"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-semibold">
                {settings.osTheme === 'auto' ? `Auto: ${detectedInfo.detectedOSName}` : themeTokens.name}
              </span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => handleUpdateSettings({ ...settings, theme: settings.theme === 'light' ? 'dark' : 'light' })}
              className={`p-1.5 rounded-xl border text-xs transition-all active:scale-95 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-amber-600'
                  : 'bg-black/50 hover:bg-zinc-800 border-cyan-900/40 text-cyan-300'
              }`}
              title={strings.header.themeToggle}
            >
              {isLight ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Command Execution Logs Panel Button */}
            <button
              onClick={() => setIsLogPanelOpen(prev => !prev)}
              className={`px-2 py-1 rounded-xl border text-xs font-mono transition-all flex items-center gap-1 active:scale-95 ${
                isLogPanelOpen
                  ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300'
                  : (isLight ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' : 'bg-black/50 border-cyan-900/40 text-zinc-400 hover:text-cyan-300')
              }`}
              title={strings.header.logsPanel}
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Logs</span>
            </button>

            {/* 1-Click Language Switcher (UZ / EN / RU) */}
            <div className="flex items-center p-0.5 bg-black/50 border border-cyan-900/40 rounded-xl">
              <button
                onClick={() => handleSetLanguage('uz')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold transition-all ${
                  activeLanguage === 'uz'
                    ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="O‘zbekcha"
              >
                UZ
              </button>
              <button
                onClick={() => handleSetLanguage('en')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold transition-all ${
                  activeLanguage === 'en'
                    ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => handleSetLanguage('ru')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold transition-all ${
                  activeLanguage === 'ru'
                    ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Русский"
              >
                RU
              </button>
            </div>

            {/* Quick App Launcher Button */}
            <button
              onClick={() => setActiveAppWindow('calculator')}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono transition-all active:scale-95 ${
                effectiveOS === 'macos'
                  ? 'rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/40'
                  : effectiveOS === 'android'
                  ? 'rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  : 'rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300'
              }`}
              title="Lokal Ilovalar (Apps)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{strings.header.appsDock}</span>
            </button>
          </div>
        </header>

        {/* View Switcher Main Container */}
        <main className="flex-1 h-full min-h-0 relative overflow-hidden flex flex-col">
          {currentTab === 'dashboard' && (
            <Dashboard
              onSelectTab={(tab) => setCurrentTab(tab)}
              onExecuteCommand={(cmd) => {
                executeCommandProcess(cmd);
                setCurrentTab('chat');
              }}
              onOpenApp={(appId) => setActiveAppWindow(appId)}
              onSelectChat={(chatId) => {
                handleSelectChat(chatId);
                setCurrentTab('chat');
              }}
              onNewChat={() => {
                handleNewChat();
                setCurrentTab('chat');
              }}
              onOpenEnvModal={() => setIsEnvModalOpen(true)}
              recentChats={ChatService.getRecentChats(3)}
              activeChatId={activeChat.id}
              agentName={settings.agentName}
              osTheme={effectiveOS}
              theme={settings.theme}
              language={activeLanguage}
            />
          )}

          {currentTab === 'command_center' && (
            <CommandCenter
              settings={settings}
              onRunCommand={(cmd) => {
                executeCommandProcess(cmd);
                setCurrentTab('chat');
              }}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'tools' && (
            <DesktopTools
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onOpenApp={(appId) => setActiveAppWindow(appId)}
            />
          )}

          {currentTab === 'chat' && (
            <ChatWindow
              chat={activeChat}
              onSendMessage={executeCommandProcess}
              onClearChat={handleClearCurrentChat}
              onRenameChat={(newTitle) => handleRenameChat(activeChat.id, newTitle)}
              agentName={settings.agentName}
              isProcessing={isProcessing}
              language={activeLanguage}
              ttsEnabled={settings.ttsEnabled}
              onToggleTTS={() => handleUpdateSettings({ ...settings, ttsEnabled: !settings.ttsEnabled })}
              theme={settings.theme}
              osTheme={effectiveOS}
              onOpenApp={(appId) => setActiveAppWindow(appId)}
              onOpenLogPanel={() => setIsLogPanelOpen(true)}
            />
          )}

          {currentTab === 'settings' && (
            <Settings
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onClearAllData={handleClearAllData}
              theme={settings.theme}
              osTheme={effectiveOS}
            />
          )}

          {currentTab === 'all_chats' && (
            <ChatHistory
              chats={chats}
              activeChatId={activeChat.id}
              onSelectChat={handleSelectChat}
              onNewChat={handleNewChat}
              onRenameChat={handleRenameChat}
              onDeleteChat={handleDeleteChat}
              onArchiveChat={handleArchiveChat}
              theme={settings.theme}
              osTheme={effectiveOS}
            />
          )}

          {currentTab === 'recent_chats' && (
            <RecentChats
              recentChats={ChatService.getRecentChats(3)}
              activeChatId={activeChat.id}
              onSelectChat={handleSelectChat}
              onNewChat={handleNewChat}
              onViewAll={() => setCurrentTab('all_chats')}
              theme={settings.theme}
              osTheme={effectiveOS}
            />
          )}

          {currentTab === 'plugins' && (
            <Plugins
              plugins={plugins}
              onTogglePlugin={handleTogglePlugin}
              theme={settings.theme}
              osTheme={effectiveOS}
            />
          )}

          {currentTab === 'projects' && (
            <Projects
              projects={projects}
              chats={chats}
              onCreateProject={handleCreateProject}
              onDeleteProject={handleDeleteProject}
              onSelectChat={handleSelectChat}
              theme={settings.theme}
              osTheme={effectiveOS}
            />
          )}

          {currentTab === 'updates' && (
            <Updates 
              theme={settings.theme}
              osTheme={effectiveOS}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileModal
              agentName={settings.agentName}
              onUpdateAgentName={(name) => handleUpdateSettings({ ...settings, agentName: name })}
              theme={settings.theme}
              osTheme={effectiveOS}
            />
          )}
        </main>

        {/* Responsive Mobile / Android Material You Bottom Navigation Bar */}
        <nav className={`md:hidden shrink-0 h-14 border-t flex items-center justify-around px-2 select-none z-20 ${
          effectiveOS === 'macos'
            ? (isLight ? 'bg-white/80 backdrop-blur-xl border-black/10 text-slate-800' : 'bg-[#121824]/80 backdrop-blur-xl border-white/10 text-zinc-100')
            : effectiveOS === 'android'
            ? (isLight ? 'bg-[#e2ebe6] border-[#ceddd4] text-slate-900' : 'bg-[#18212e] border-[#29384e] text-zinc-100')
            : (isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#080d18] border-cyan-900/30 text-zinc-100')
        }`}>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
              currentTab === 'dashboard' 
                ? (effectiveOS === 'android' ? 'bg-emerald-500/25 text-emerald-400 font-bold' : 'text-cyan-400 font-bold') 
                : 'text-zinc-500'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Bosh</span>
          </button>

          <button
            onClick={() => setCurrentTab('chat')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
              currentTab === 'chat' 
                ? (effectiveOS === 'android' ? 'bg-emerald-500/25 text-emerald-400 font-bold' : 'text-cyan-400 font-bold') 
                : 'text-zinc-500'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">{strings.nav.chat}</span>
          </button>

          <button
            onClick={() => setCurrentTab('command_center')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
              currentTab === 'command_center' 
                ? (effectiveOS === 'android' ? 'bg-emerald-500/25 text-emerald-400 font-bold' : 'text-cyan-400 font-bold') 
                : 'text-zinc-500'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Buyruqlar</span>
          </button>

          <button
            onClick={() => setCurrentTab('tools')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
              currentTab === 'tools' 
                ? (effectiveOS === 'android' ? 'bg-emerald-500/25 text-emerald-400 font-bold' : 'text-cyan-400 font-bold') 
                : 'text-zinc-500'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Asboblar</span>
          </button>

          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all text-zinc-500 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Qidiruv</span>
          </button>

          <button
            onClick={() => setCurrentTab('settings')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
              currentTab === 'settings' 
                ? (effectiveOS === 'android' ? 'bg-emerald-500/25 text-emerald-400 font-bold' : 'text-cyan-400 font-bold') 
                : 'text-zinc-500'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">{strings.nav.settings}</span>
          </button>
        </nav>
      </div>

      {/* Global Omnibox Search Modal (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onRunCommand={(cmd) => {
          executeCommandProcess(cmd);
          setCurrentTab('chat');
        }}
        onOpenApp={(appId) => setActiveAppWindow(appId)}
        settings={settings}
      />

      {/* Sensitive Action Permission Confirmation Modal */}
      {pendingPermission && (
        <PermissionModal
          pending={pendingPermission}
          onConfirm={pendingPermission.onConfirm}
          onCancel={pendingPermission.onCancel}
        />
      )}

      {/* Interactive Application Modal (Supports macOS, Windows, Android Chrome) */}
      {activeAppWindow && (
        <WindowsAppModal
          appId={activeAppWindow}
          onClose={() => setActiveAppWindow(null)}
          language={activeLanguage}
          osTheme={effectiveOS}
          theme={settings.theme}
        />
      )}

      {/* Command Execution Logs Panel (v1.5) */}
      <LogPanel
        isOpen={isLogPanelOpen}
        onClose={() => setIsLogPanelOpen(false)}
        language={activeLanguage}
      />

      {/* System Environment & OS Diagnostics Modal */}
      <SystemEnvModal
        isOpen={isEnvModalOpen}
        onClose={() => setIsEnvModalOpen(false)}
        activeOS={effectiveOS}
        osThemePreference={settings.osTheme}
        onSelectOSTheme={handleSetOSTheme}
        theme={settings.theme}
        language={activeLanguage}
      />
    </div>
  );
}
