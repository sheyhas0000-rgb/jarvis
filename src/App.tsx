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
import { 
  SidebarTab, 
  ChatSession, 
  ChatMessage, 
  AppSettings, 
  LocalPlugin, 
  Project, 
  PendingPermission 
} from './types';
import { StorageService } from './services/storageService';
import { ChatService } from './services/chatService';
import { PluginService } from './services/pluginService';
import { ProjectService } from './services/projectService';
import { CommandService } from './services/commandService';
import { Menu } from 'lucide-react';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<SidebarTab>('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Core Data State
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());
  const [chats, setChats] = useState<ChatSession[]>(() => StorageService.getChats());
  const [activeChatId, setActiveChatId] = useState<string>(() => StorageService.getActiveChatId());
  const [plugins, setPlugins] = useState<LocalPlugin[]>(() => StorageService.getPlugins());
  const [projects, setProjects] = useState<Project[]>(() => StorageService.getProjects());

  // Execution & Permission state
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingPermission, setPendingPermission] = useState<PendingPermission | null>(null);

  // Sync active chat object
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0] || ChatService.createNewChat();

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
      // 2. Execute via Local Command Service
      const result = await CommandService.execute(text, forceConfirmed);

      // 3. Check if sensitive action requires confirmation
      if (result.requiresConfirmation && result.permissionType) {
        setPendingPermission({
          id: `perm_${Date.now()}`,
          commandText: text,
          permissionType: result.permissionType,
          actionTitle: result.confirmationMessage || 'Xavfsiz amal tasdig‘i',
          details: result.confirmationMessage || 'Ushbu amal kompyuteringizda bajarilishidan oldin tasdiqlashingiz kerak.',
          onConfirm: () => {
            setPendingPermission(null);
            executeCommandProcess(text, true);
          },
          onCancel: () => {
            setPendingPermission(null);
            const cancelMsg: ChatMessage = {
              id: `msg_cancel_${Date.now()}`,
              sender: 'jarvis',
              text: `⚠️ Amal foydalanuvchi tomonidan bekor qilindi: "${text}"`,
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

      // 4. Append JARVIS execution response
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
        text: `❌ Xatolik yuz berdi: ${err.message || 'Lokal xatolik'}`,
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
    <div className="flex h-screen w-screen bg-[#05080e] text-zinc-100 font-sans overflow-hidden select-none">
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
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Mobile Header with Hamburger */}
        <div className="md:hidden h-14 px-4 bg-[#0a0f18] border-b border-cyan-900/30 flex items-center justify-between z-20 shrink-0">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-xl text-zinc-400 hover:text-cyan-400 hover:bg-cyan-950/40"
            title="Menyuni ochish"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-cyan-300 text-sm tracking-wider">
            {settings.agentName} • LOCAL AGENT
          </span>
          <div className="w-9" />
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
            />
          )}

          {currentTab === 'settings' && (
            <Settings
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onClearAllData={handleClearAllData}
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
    </div>
  );
}
