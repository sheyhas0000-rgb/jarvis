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
import { 
  SidebarTab, 
  ChatSession, 
  ChatMessage, 
  AppSettings, 
  LocalPlugin, 
  Project, 
  PendingPermission,
  WindowsAppId,
  SupportedLanguage
} from './types';
import { StorageService } from './services/storageService';
import { ChatService } from './services/chatService';
import { PluginService } from './services/pluginService';
import { ProjectService } from './services/projectService';
import { CommandService } from './services/commandService';
import { LocalAgentBridge } from './services/localAgentBridge';
import { TTSService } from './services/ttsService';
import { normalizeLang, t } from './utils/i18n';
import { Menu, Globe, LayoutGrid, ShieldCheck, Moon, Sun, Terminal, Volume2, VolumeX } from 'lucide-react';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<SidebarTab>('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Command Execution Log Panel (v1.5)
  const [isLogPanelOpen, setIsLogPanelOpen] = useState(false);

  // Windows Agent Connection Status
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
    const interval = setInterval(check, 3500);
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

  // Sync active chat object
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0] || ChatService.createNewChat();

  // Keep HTML document metadata in sync with language
  useEffect(() => {
    document.documentElement.lang = activeLanguage;
    if (activeLanguage === 'en') {
      document.title = 'JARVIS Windows Assistant v1.5';
    } else if (activeLanguage === 'ru') {
      document.title = 'JARVIS Windows Ассистент v1.5';
    } else {
      document.title = 'JARVIS Windows Yordamchisi v1.5';
    }
  }, [activeLanguage]);

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

  // Handle Chat Archive
  const handleArchiveChat = (id: string) => {
    ChatService.archiveChat(id);
    refreshState();
  };

  // Handle Clear Chat Messages
  const handleClearCurrentChat = () => {
    ChatService.clearChat(activeChat.id);
    refreshState();
  };

  // Quick Language Switcher
  const handleSetLanguage = (lang: SupportedLanguage) => {
    const updated = { ...settings, language: lang };
    StorageService.saveSettings(updated);
    setSettings(updated);
  };

  // Handle Command Execution
  const executeCommandProcess = async (text: string, forceConfirmed: boolean = false) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Append user message if not already confirmed step
    if (!forceConfirmed) {
      const userMsg: ChatMessage = {
        id: `msg_user_${Date.now()}`,
        sender: 'user',
        text,
        timeFormatted,
        timestamp: Date.now(),
      };
      ChatService.addMessage(activeChat.id, userMsg);
      refreshState();
    }

    setIsProcessing(true);

    try {
      // 2. Execute via Local Command Service passing the active language
      const result = await CommandService.execute(text, forceConfirmed, activeLanguage);

      // 3. If an application was targeted, automatically open or close the simulated window!
      if (result.openedApp) {
        setActiveAppWindow(result.openedApp);
      }
      if (result.closedApp) {
        if (activeAppWindow === result.closedApp) {
          setActiveAppWindow(null);
        }
      }

      // 4. Check if sensitive action requires confirmation
      if (result.requiresConfirmation && result.permissionType) {
        setPendingPermission({
          id: `perm_${Date.now()}`,
          commandText: text,
          permissionType: result.permissionType,
          actionTitle: result.confirmationMessage || strings.permissionModal.title,
          details: result.confirmationMessage || strings.permissionModal.warning,
          onConfirm: () => {
            setPendingPermission(null);
            executeCommandProcess(text, true);
          },
          onCancel: () => {
            setPendingPermission(null);
            const cancelMsg: ChatMessage = {
              id: `msg_cancel_${Date.now()}`,
              sender: 'jarvis',
              text: `⚠️ ${activeLanguage === 'en' ? 'Action cancelled by user' : activeLanguage === 'ru' ? 'Действие отменено пользователем' : 'Amal foydalanuvchi tomonidan bekor qilindi'}: "${text}"`,
              timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              timestamp: Date.now(),
              status: 'error',
            };
            ChatService.addMessage(activeChat.id, cancelMsg);
            refreshState();
          },
        });
        setIsProcessing(false);
        return;
      }

      // 5. Append JARVIS execution response
      const jarvisMsg: ChatMessage = {
        id: `msg_jarvis_${Date.now()}`,
        sender: 'jarvis',
        text: result.message,
        timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        status: result.success ? 'success' : 'error',
        createdFile: result.createdFile,
        fileItems: result.fileItems,
        webLink: result.webLink,
        commandDetails: {
          windowsCommand: result.windowsCommand,
          executedAt: new Date().toISOString(),
        },
      };

      ChatService.addMessage(activeChat.id, jarvisMsg);
      refreshState();

      // Text-to-Speech (TTS) voice playback if enabled
      if (settings.ttsEnabled) {
        TTSService.speak(result.speechText || result.message, activeLanguage, settings.ttsEnabled);
      }

      // Sound feedback if enabled
      if (settings.soundEnabled) {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = result.success ? 'sine' : 'sawtooth';
          osc.frequency.setValueAtTime(result.success ? 587.33 : 220, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
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
    <div className={`flex h-screen w-screen font-sans overflow-hidden select-none transition-colors duration-200 ${
      settings.theme === 'light' ? 'bg-slate-100 text-slate-800' : 'bg-[#05080e] text-zinc-100'
    }`}>
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
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Top Bar for Desktop and Mobile (Includes Hamburger & Language Switcher) */}
        <div className={`h-12 px-4 border-b flex items-center justify-between z-20 shrink-0 select-none transition-colors ${
          settings.theme === 'light' 
            ? 'bg-white border-slate-200 text-slate-800' 
            : 'bg-[#080d17] border-cyan-900/30 text-zinc-100'
        }`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-xl text-zinc-400 hover:text-cyan-400 hover:bg-cyan-950/40"
              title="Menyu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-cyan-300 text-xs md:text-sm tracking-wider flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              {settings.agentName}
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-mono">
                v1.5
              </span>
            </span>
          </div>

          {/* Center / Right: Status + Theme Toggle + Logs + Language Switcher + App Launcher */}
          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-mono border bg-cyan-950/40 border-cyan-800/40 text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Windows Local</span>
            </div>

            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={() => handleUpdateSettings({ ...settings, theme: settings.theme === 'light' ? 'dark' : 'light' })}
              className={`p-1.5 rounded-xl border text-xs transition-all ${
                settings.theme === 'light'
                  ? 'bg-slate-100 border-slate-300 text-amber-600 hover:bg-slate-200'
                  : 'bg-black/60 border-cyan-900/40 text-cyan-300 hover:bg-cyan-950/60'
              }`}
              title={strings.header.themeToggle}
            >
              {settings.theme === 'light' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Logs Panel Button */}
            <button
              onClick={() => setIsLogPanelOpen(prev => !prev)}
              className={`px-2 py-1 rounded-xl border text-xs font-mono transition-all flex items-center gap-1 ${
                isLogPanelOpen
                  ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300'
                  : (settings.theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' : 'bg-black/60 border-cyan-900/40 text-zinc-400 hover:text-cyan-300')
              }`}
              title={strings.header.logsPanel}
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Logs</span>
            </button>

            {/* 1-Click Language Switcher (UZ / EN / RU) */}
            <div className="flex items-center p-0.5 bg-black/60 border border-cyan-900/40 rounded-xl">
              <button
                onClick={() => handleSetLanguage('uz')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold transition-all ${
                  activeLanguage === 'uz'
                    ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
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
                    ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
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
                    ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Русский"
              >
                RU
              </button>
            </div>

            {/* Quick App launcher button */}
            <button
              onClick={() => setActiveAppWindow('calculator')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition-all"
              title="Windows Ilovalari"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
              <span>{strings.header.appsDock}</span>
            </button>
          </div>
        </div>

        {/* View Switcher */}
        <main className="flex-1 h-full min-h-0 relative overflow-hidden">
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
            />
          )}

          {currentTab === 'recent_chats' && (
            <RecentChats
              recentChats={ChatService.getRecentChats(3)}
              activeChatId={activeChat.id}
              onSelectChat={handleSelectChat}
              onNewChat={handleNewChat}
              onViewAll={() => setCurrentTab('all_chats')}
            />
          )}

          {currentTab === 'plugins' && (
            <Plugins
              plugins={plugins}
              onTogglePlugin={handleTogglePlugin}
            />
          )}

          {currentTab === 'projects' && (
            <Projects
              projects={projects}
              chats={chats}
              onCreateProject={handleCreateProject}
              onDeleteProject={handleDeleteProject}
              onSelectChat={handleSelectChat}
            />
          )}

          {currentTab === 'updates' && (
            <Updates />
          )}

          {currentTab === 'profile' && (
            <ProfileModal
              agentName={settings.agentName}
              onUpdateAgentName={(name) => handleUpdateSettings({ ...settings, agentName: name })}
            />
          )}
        </main>
      </div>

      {/* Sensitive Action Permission Confirmation Modal */}
      {pendingPermission && (
        <PermissionModal
          pending={pendingPermission}
          onConfirm={pendingPermission.onConfirm}
          onCancel={pendingPermission.onCancel}
        />
      )}

      {/* Interactive Simulated Windows Application Modal */}
      {activeAppWindow && (
        <WindowsAppModal
          appId={activeAppWindow}
          onClose={() => setActiveAppWindow(null)}
          language={activeLanguage}
        />
      )}

      {/* Command Execution Logs Panel (v1.5) */}
      <LogPanel
        isOpen={isLogPanelOpen}
        onClose={() => setIsLogPanelOpen(false)}
        language={activeLanguage}
      />
    </div>
  );
}
