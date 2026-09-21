import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { FuturisticOrb } from './components/FuturisticOrb';
import { CommandInput } from './components/CommandInput';
import { ChatDialogue } from './components/ChatDialogue';
import { ActionHistory } from './components/ActionHistory';
import { PermissionsModal } from './components/PermissionsModal';
import { AgentSetupModal } from './components/AgentSetupModal';
import { FileBrowserCard } from './components/FileBrowserCard';
import { FileViewerModal } from './components/FileViewerModal';
import { DownloadAppModal } from './components/DownloadAppModal';
import { YouTubeModal } from './components/YouTubeModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';
import { QuickCommandChips } from './components/QuickCommandChips';
import { MobileBottomNav, AppTabType } from './components/MobileBottomNav';
import { PhoneCompanionView } from './components/PhoneCompanionView';
import { MobileFilesView } from './components/MobileFilesView';
import { MessageSquare, ListFilter, Trash2, Download, HardDrive, Smartphone } from 'lucide-react';
import {
  ApprovedLocation,
  SafeAction,
  ParseResult,
  ActionLogItem,
  AgentStatusInfo,
  FileItem,
  ChatMessage,
} from './types';
import { parseUzbekCommand, getActionDoingMessage } from './utils/uzbekParser';
import { checkLocalAgentStatus, executeSafeAction, parseWithAI } from './services/agentService';
import { SpeechHandler } from './utils/speech';
import { downloadFileToComputer } from './utils/fileDownloader';

const DEFAULT_PERMISSIONS: Record<ApprovedLocation, boolean> = {
  Desktop: true,
  Downloads: true,
  Documents: true,
  Pictures: false,
  Videos: false,
};

let uniqueSeqCounter = 0;
const generateUniqueId = (prefix: string = 'msg'): string => {
  uniqueSeqCounter += 1;
  return `${prefix}-${Date.now()}-${uniqueSeqCounter}-${Math.random().toString(36).slice(2, 7)}`;
};

export default function App() {
  // Active view: 'chat' | 'files' | 'logs' | 'phone'
  const [activeTab, setActiveTab] = useState<AppTabType>('chat');

  // Agent connection state
  const [agentStatus, setAgentStatus] = useState<AgentStatusInfo | null>(null);
  const [isCheckingAgent, setIsCheckingAgent] = useState(false);

  // Permissions state
  const [allowedLocations, setAllowedLocations] = useState<Record<ApprovedLocation, boolean>>(() => {
    try {
      const saved = localStorage.getItem('jarvis_permissions');
      return saved ? JSON.parse(saved) : DEFAULT_PERMISSIONS;
    } catch {
      return DEFAULT_PERMISSIONS;
    }
  });
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isFirstStartup, setIsFirstStartup] = useState(false);

  // Voice feedback state (speech output)
  const [isVoiceFeedbackEnabled, setIsVoiceFeedbackEnabled] = useState(true);

  // Orb visual state
  const [orbStatus, setOrbStatus] = useState<'idle' | 'listening' | 'processing' | 'success' | 'error'>('idle');
  const [orbText, setOrbText] = useState('Buyruq bering, ser: yozing yoki mikrofon orqali gapiring...');
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Active command & state
  const [currentCommand, setCurrentCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentFiles, setRecentFiles] = useState<{ location: ApprovedLocation; items: FileItem[] } | null>(null);
  const [viewingFile, setViewingFile] = useState<{
    isOpen: boolean;
    name: string;
    content: string;
    location: string;
  }>({
    isOpen: false,
    name: '',
    content: '',
    location: 'Desktop',
  });

  // YouTube In-App Player & Navigation State
  const [youTubeState, setYouTubeState] = useState<{
    isOpen: boolean;
    url: string;
    query: string;
  }>({
    isOpen: false,
    url: 'https://www.youtube.com',
    query: '',
  });

  // Written Chat Conversation History
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('jarvis_chat_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const seenIds = new Set<string>();
          return parsed.map((m: ChatMessage, index: number) => {
            if (!m.id || seenIds.has(m.id)) {
              const uniqueId = generateUniqueId(`msg-${index}`);
              seenIds.add(uniqueId);
              return { ...m, id: uniqueId };
            }
            seenIds.add(m.id);
            return m;
          });
        }
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'welcome-1',
        sender: 'jarvis',
        text: `Assalomu alaykum! Men JARVIS — sizning shaxsiy kompyuter yordamchingizman (macOS va Windows tizimlari qo'llab-quvvatlanadi).\n\nHech qanday dastur yoki agent yuklab olishingiz shart emas — to'g'ridan-to'g'ri brauzer orqali yozma yoki ovozli buyruq beravering.\nMasalan: "test.txt yarat" yoki "Desktopda salom.txt yarat ichiga Salom dunyo deb yoz".`,
        timeFormatted: 'Hozir',
        status: 'info',
      },
    ];
  });

  // Action log history
  const [actionLogs, setActionLogs] = useState<ActionLogItem[]>(() => {
    try {
      const saved = localStorage.getItem('jarvis_action_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const seenIds = new Set<string>();
          return parsed.map((item: ActionLogItem, index: number) => {
            if (!item.id || seenIds.has(item.id)) {
              const uniqueId = generateUniqueId(`log-${index}`);
              seenIds.add(uniqueId);
              return { ...item, id: uniqueId };
            }
            seenIds.add(item.id);
            return item;
          });
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Save chat to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jarvis_chat_messages', JSON.stringify(chatMessages));
    } catch {
      // ignore
    }
  }, [chatMessages]);

  // Check first startup
  useEffect(() => {
    const hasStarted = localStorage.getItem('jarvis_initialized');
    if (!hasStarted) {
      setIsFirstStartup(true);
      setIsPermissionsOpen(true);
      localStorage.setItem('jarvis_initialized', 'true');
    }
  }, []);

  // Poll Local Windows Agent (http://127.0.0.1:8765)
  const refreshAgent = useCallback(async () => {
    setIsCheckingAgent(true);
    const status = await checkLocalAgentStatus();
    setAgentStatus(status);
    setIsCheckingAgent(false);
  }, []);

  useEffect(() => {
    refreshAgent();
    const interval = setInterval(refreshAgent, 4000);
    return () => clearInterval(interval);
  }, [refreshAgent]);

  // Save permissions to localStorage
  const handleSavePermissions = () => {
    localStorage.setItem('jarvis_permissions', JSON.stringify(allowedLocations));
  };

  const handleToggleLocation = (loc: ApprovedLocation) => {
    setAllowedLocations((prev) => ({
      ...prev,
      [loc]: !prev[loc],
    }));
  };

  // Helper to format action summary
  const getActionSummary = (action: SafeAction, success: boolean): string => {
    if (!success) {
      return `${action.action} muvaffaqiyatsiz`;
    }
    switch (action.action) {
      case 'chat_reply':
        return 'Suhbat / Javob';
      case 'open_website':
        return `${action.title} sayti ochildi`;
      case 'open_download_modal':
        return `Ilovani yuklab olish (${action.targetPlatform || 'Win/Mac/Android'}) ochildi`;
      case 'create_file':
        return `${action.name} yaratildi`;
      case 'create_folder':
        return `${action.name} papkasi yaratildi`;
      case 'list_files':
        return `${action.location} fayllari ko'rsatildi`;
      case 'open_file':
        return `${action.name} ochildi`;
      case 'open_folder':
        return `${action.location} papkasi ochildi`;
      case 'rename_file':
        return `${action.oldName} → ${action.newName}`;
      case 'delete_file':
        return `${action.name} o'chirildi`;
      case 'clear_screen':
        return 'Ekran tozalandi';
      default:
        return 'Amal bajarildi';
    }
  };

  // Actual execution on Local Agent or Sandbox
  const performActionExecution = async (action: SafeAction, userPrompt: string) => {
    if (action.action === 'clear_screen') {
      handleClearChat();
      setOrbStatus('idle');
      setOrbText('Bajarildi, ser! Ekran tozalandi.');
      if (isVoiceFeedbackEnabled) {
        SpeechHandler.speak('Bajarildi, ser! Ekranni tozaladim.');
      }
      return;
    }

    const doingMessage = getActionDoingMessage(action);
    setIsProcessing(true);
    setOrbStatus(action.action === 'chat_reply' ? 'idle' : 'processing');
    setOrbText(doingMessage);

    // Foydalanuvchi buyruq berganda darhol "Bajarayapman, ser!" deb ovozli aytadi
    if (isVoiceFeedbackEnabled && action.action !== 'chat_reply') {
      SpeechHandler.speak(doingMessage);
    }

    const result = await executeSafeAction(
      action,
      !!agentStatus?.connected,
      allowedLocations
    );

    setIsProcessing(false);

    const now = new Date();
    const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (result.success) {
      setOrbStatus(action.action === 'chat_reply' ? 'idle' : 'success');
      setOrbText(result.message.split('\n')[0]);

      // Foydalanuvchi "yarat" deganida yaratilgan fayl yoki papka avtomatik kompyuteriga yuklansin
      if (action.action === 'create_file') {
        const fileContent = result.createdFile?.content ?? ('content' in action ? (action as any).content : '') ?? '';
        const fileName = result.createdFile?.name || ('name' in action ? (action as any).name : 'yangi_hujjat.txt');
        downloadFileToComputer(fileName, fileContent);
      } else if (action.action === 'create_folder') {
        const folderName = ('name' in action ? (action as any).name : 'yangi_papka');
        const folderLoc = ('location' in action ? (action as any).location : 'Desktop');
        const folderSummary = `JARVIS Papka Ma'lumoti\n------------------------\nPapka nomi: ${folderName}\nJoylashuv: ${folderLoc}\nYaratilgan vaqti: ${new Date().toLocaleString('uz-UZ')}\nHolat: Tizimda muvaffaqiyatli yaratildi.\n`;
        downloadFileToComputer(`${folderName}_papka.txt`, folderSummary);
      }

      // If website, open in new tab (if popup permitted)
      if (action.action === 'open_website') {
        try {
          window.open(action.url, '_blank', 'noopener,noreferrer');
        } catch {
          // Handled by in-chat launch card
        }

        // Seamless macOS / Safari & Desktop fallback: auto-open YouTube modal
        if (action.iconType === 'youtube' || (action.url && action.url.includes('youtube.com'))) {
          setYouTubeState({
            isOpen: true,
            url: action.url,
            query: action.title?.replace(/^YouTube:?\s*/i, '') || '',
          });
        }
      }

      // If download modal requested
      if (action.action === 'open_download_modal') {
        setIsDownloadOpen(true);
      }

      // If user opened a file, show the in-app FileViewerModal
      if (action.action === 'open_file') {
        const fileContent = result.createdFile?.content || (result as any).content || '';
        const fileName = result.createdFile?.name || action.name;
        const fileLoc = result.createdFile?.location || action.location;
        setViewingFile({
          isOpen: true,
          name: fileName,
          content: fileContent,
          location: fileLoc,
        });
      }

      // Always refresh recent files so user sees real-time updates
      if (action.action === 'list_files' && result.items) {
        setRecentFiles({ location: action.location, items: result.items });
      } else if (action.action === 'create_file' || action.action === 'delete_file' || action.action === 'rename_file') {
        const ref = await executeSafeAction(
          { action: 'list_files', location: action.location },
          !!agentStatus?.connected,
          allowedLocations
        );
        if (ref.items) {
          setRecentFiles({ location: action.location, items: ref.items });
        }
      }

      if (isVoiceFeedbackEnabled) {
        SpeechHandler.speak(result.message);
      }
    } else {
      setOrbStatus('error');
      setOrbText(result.message);
      if (isVoiceFeedbackEnabled) {
        SpeechHandler.speak(result.message);
      }
    }

    // Add JARVIS response message to Written Chat
    const jarvisMsg: ChatMessage = {
      id: generateUniqueId('jarvis'),
      sender: 'jarvis',
      text: result.message,
      timeFormatted,
      status: action.action === 'chat_reply' ? 'info' : (result.success ? 'success' : 'error'),
      action,
      isRealWindows: result.isRealWindows,
      fileItems: action.action === 'list_files' ? result.items : undefined,
      webLink: result.webLink || (action.action === 'open_website' ? {
        title: action.title,
        url: action.url,
        iconType: action.iconType,
      } : undefined),
      createdFile: result.createdFile || (action.action === 'create_file' ? {
        name: action.name,
        content: action.content,
        location: action.location,
      } : undefined),
    };
    setChatMessages((prev) => [...prev, jarvisMsg]);

    // Add to action log
    const newLogItem: ActionLogItem = {
      id: generateUniqueId('log'),
      timestamp: now.toISOString(),
      timeFormatted,
      command: userPrompt,
      summary: getActionSummary(action, result.success),
      status: action.action === 'chat_reply' ? 'success' : (result.success ? 'success' : 'error'),
      response: result.message,
      action,
      isRealWindows: result.isRealWindows,
      webLink: result.webLink || (action.action === 'open_website' ? {
        title: action.title,
        url: action.url,
        iconType: action.iconType,
      } : undefined),
    };

    setActionLogs((prev) => {
      const updated = [newLogItem, ...prev].slice(0, 50);
      localStorage.setItem('jarvis_action_logs', JSON.stringify(updated));
      return updated;
    });

    setTimeout(() => {
      setOrbStatus('idle');
      setOrbText('Buyruq bering, ser: yozing yoki mikrofon orqali gapiring...');
    }, 4500);
  };

  // Main Command Processing Pipeline (Yozma yoki Ovozli)
  const handleProcessCommand = async (rawCommand: string) => {
    const trimmed = rawCommand.trim();
    if (!trimmed) return;

    setCurrentCommand(trimmed);

    const now = new Date();
    const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Add user message to Written Chat Dialogue
    const userMsg: ChatMessage = {
      id: generateUniqueId('user'),
      sender: 'user',
      text: trimmed,
      timeFormatted,
    };
    setChatMessages((prev) => [...prev, userMsg]);

    // Step 1: Uzbek Command Parser (Local - No API key required)
    const localParsed = parseUzbekCommand(trimmed);

    if (localParsed.recognized && localParsed.action) {
      // Check if dangerous action requiring confirmation (e.g. DELETE)
      if (localParsed.requiresConfirmation || localParsed.action.action === 'delete_file') {
        const targetName = 'name' in localParsed.action ? localParsed.action.name : 'fayl';
        const confirmMsg = localParsed.confirmationMessage || `⚠️ "${targetName}" faylini o‘chirishni tasdiqlaysizmi?`;

        setOrbStatus('processing');
        setOrbText(confirmMsg);

        if (isVoiceFeedbackEnabled) {
          SpeechHandler.speak(confirmMsg);
        }

        const confirmChatMsg: ChatMessage = {
          id: generateUniqueId('jarvis-confirm'),
          sender: 'jarvis',
          text: confirmMsg,
          timeFormatted,
          status: 'pending',
          pendingConfirmation: {
            action: localParsed.action,
            message: confirmMsg,
            type: 'delete',
          },
        };
        setChatMessages((prev) => [...prev, confirmChatMsg]);
        return;
      }

      // Safe immediate execution
      await performActionExecution(localParsed.action, trimmed);
      return;
    }

    // Step 2: Unrecognized locally -> Try AI fallback if available
    setOrbStatus('processing');
    const waitingText = "Bajarayapman, ser! Buyruq tahlil qilinmoqda...";
    setOrbText(waitingText);
    if (isVoiceFeedbackEnabled) {
      SpeechHandler.speak("Bajarayapman, ser!");
    }
    const aiResult = await parseWithAI(trimmed);

    if (aiResult.recognized) {
      if (aiResult.action?.action === 'chat_reply' || aiResult.reply) {
        const replyText = aiResult.action?.reply || aiResult.reply || "Tushundim. Sizga qanday yordam bera olaman?";
        await performActionExecution({ action: 'chat_reply', reply: replyText }, trimmed);
        return;
      }

      if (aiResult.action) {
        const safeAction = {
          action: aiResult.action.action || aiResult.action,
          location: (aiResult.action.location || aiResult.location || 'Desktop') as ApprovedLocation,
          name: aiResult.action.name || aiResult.name || '',
          content: aiResult.action.content || aiResult.content || '',
          oldName: aiResult.action.oldName || aiResult.oldName || '',
          newName: aiResult.action.newName || aiResult.newName || '',
          url: aiResult.action.url || aiResult.url || '',
          title: aiResult.action.title || aiResult.title || '',
          iconType: aiResult.action.iconType || aiResult.iconType || 'web',
        } as SafeAction;

        if (safeAction.action === 'delete_file') {
          const confirmMsg = `⚠️ "${safeAction.name}" faylini o‘chirishni tasdiqlaysizmi?`;
          setOrbStatus('processing');
          setOrbText(confirmMsg);

          if (isVoiceFeedbackEnabled) {
            SpeechHandler.speak(confirmMsg);
          }

          const confirmChatMsg: ChatMessage = {
            id: generateUniqueId('jarvis-confirm'),
            sender: 'jarvis',
            text: confirmMsg,
            timeFormatted,
            status: 'pending',
            pendingConfirmation: {
              action: safeAction,
              message: confirmMsg,
              type: 'delete',
            },
          };
          setChatMessages((prev) => [...prev, confirmChatMsg]);
          return;
        }

        await performActionExecution(safeAction, trimmed);
        return;
      }
    }

    // Step 3: Unrecognized command response
    setOrbStatus('error');
    const errMsg = localParsed.error || `"${trimmed}" buyrug'ini tushunib bo'lmadi.\nMasalan: "youtubega kir", "test.txt yarat" yoki "salom".`;
    setOrbText(errMsg);

    if (isVoiceFeedbackEnabled) {
      SpeechHandler.speak(errMsg);
    }

    const errChatMsg: ChatMessage = {
      id: generateUniqueId('jarvis-err'),
      sender: 'jarvis',
      text: errMsg,
      timeFormatted,
      status: 'error',
    };
    setChatMessages((prev) => [...prev, errChatMsg]);

    setTimeout(() => {
      setOrbStatus('idle');
      setOrbText('Buyruq bering: yozing yoki mikrofon orqali gapiring...');
    }, 4500);
  };

  const handleConfirmAction = async (action: SafeAction) => {
    // Clear pending confirmations in chat
    setChatMessages((prev) =>
      prev.map((m) => (m.pendingConfirmation ? { ...m, pendingConfirmation: undefined } : m))
    );
    await performActionExecution(action, currentCommand || 'Tasdiqlangan amal');
  };

  const handleCancelAction = () => {
    setChatMessages((prev) =>
      prev.map((m) => (m.pendingConfirmation ? { ...m, pendingConfirmation: undefined } : m))
    );
    setOrbStatus('idle');
    setOrbText('Amal bekor qilindi.');
    const now = new Date();
    const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setChatMessages((prev) => [
      ...prev,
      {
        id: generateUniqueId('cancel'),
        sender: 'jarvis',
        text: 'Amal bekor qilindi.',
        timeFormatted,
        status: 'info',
      },
    ]);
  };

  const handleClearHistory = () => {
    setActionLogs([]);
    localStorage.removeItem('jarvis_action_logs');
  };

  const handleClearChat = () => {
    setChatMessages([
      {
        id: generateUniqueId('cleared'),
        sender: 'jarvis',
        text: "Muloqot tarixi tozalandi. Menga yangi yozma yoki ovozli buyruq berishingiz mumkin.",
        timeFormatted: 'Hozir',
        status: 'info',
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black font-['Space_Grotesk']">
      {/* Top Navbar */}
      <Navbar
        agentStatus={agentStatus}
        onOpenPermissions={() => setIsPermissionsOpen(true)}
        onOpenSetup={() => setIsSetupOpen(true)}
        onOpenDownload={() => setIsDownloadOpen(true)}
        isVoiceFeedbackEnabled={isVoiceFeedbackEnabled}
        onToggleVoiceFeedback={() => setIsVoiceFeedbackEnabled(!isVoiceFeedbackEnabled)}
        allowedLocations={allowedLocations}
      />

      {/* Main JARVIS UI Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-2 sm:px-4 py-2 sm:py-4 flex flex-col pb-20 sm:pb-6 min-h-0">
        {/* Compact Futuristic Core HUD Reactor */}
        <FuturisticOrb
          status={orbStatus}
          statusText={orbText}
          isVoiceActive={isVoiceActive}
          compact={true}
          onOrbClick={() => {
            if (!isProcessing) {
              setOrbText('Buyruq bering: yozing yoki mikrofon orqali gapiring...');
            }
          }}
        />

        {/* View Switcher: Desktop Navigation Bar (hidden on mobile, managed by MobileBottomNav) */}
        <div className="hidden sm:flex items-center justify-between px-2 sm:px-4 my-2 flex-wrap gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Muloqot ({chatMessages.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'files'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Fayllar ({recentFiles?.items.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'logs'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Amallar Jurnali ({actionLogs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('phone')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'phone'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Telefon Versiyasi</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <PWAInstallButton onOpenFullModal={() => setIsDownloadOpen(true)} />

            {activeTab === 'chat' && chatMessages.length > 1 && (
              <button
                onClick={handleClearChat}
                title="Yozishmalarni tozalash"
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Tozalash</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Written Chat Dialogue (Primary View) */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col justify-between min-h-0">
            {/* Tez-tez ishlatiladigan buyruqlar chip-tugmalari qatori */}
            <QuickCommandChips
              onExecuteCommand={handleProcessCommand}
              onClearScreen={handleClearChat}
              isProcessing={isProcessing}
            />

            <ChatDialogue
              messages={chatMessages}
              isProcessing={isProcessing}
              onConfirmAction={handleConfirmAction}
              onCancelAction={handleCancelAction}
              onOpenFile={(fileName) => handleProcessCommand(`${fileName} faylini och`)}
              onDeleteFile={(fileName) => handleProcessCommand(`${fileName} faylini o'chir`)}
              onRenameFile={(fileName) => {
                const newName = prompt(`"${fileName}" uchun yangi nom kiriting:`);
                if (newName && newName.trim()) {
                  handleProcessCommand(`${fileName} nomini ${newName.trim()} qil`);
                }
              }}
              onSelectPrompt={(promptText) => handleProcessCommand(promptText)}
              onOpenSetup={() => setIsSetupOpen(true)}
              onOpenDownload={() => setIsDownloadOpen(true)}
              onViewFile={(fileName, content, location) => {
                setViewingFile({
                  isOpen: true,
                  name: fileName,
                  content: content || '',
                  location: location || 'Desktop',
                });
              }}
              onOpenYouTube={(url, query) => {
                setYouTubeState({
                  isOpen: true,
                  url: url || 'https://www.youtube.com',
                  query: query || '',
                });
              }}
            />

            {/* Input Bar (Written Typing + Voice Microphone) */}
            <div className="pt-2 sticky bottom-1 sm:bottom-2 z-20">
              <CommandInput
                onSubmit={handleProcessCommand}
                isProcessing={isProcessing}
                onListeningChange={(listening, msg) => {
                  setIsVoiceActive(listening);
                  if (listening) {
                    setOrbStatus('listening');
                    setOrbText(msg || '🎤 Tinglayapman... (gapiring)');
                  } else {
                    setOrbStatus('idle');
                    setOrbText(msg || 'Buyruq bering...');
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Mobile Files View */}
        {activeTab === 'files' && (
          <div className="flex-1 overflow-y-auto">
            <MobileFilesView
              location={recentFiles?.location || 'Desktop'}
              items={recentFiles?.items || []}
              onOpenFile={(fileName) => handleProcessCommand(`${fileName} faylini och`)}
              onDeleteFile={(fileName) => handleProcessCommand(`${fileName} faylini o'chir`)}
              onRenameFile={(fileName) => {
                const newName = prompt(`"${fileName}" uchun yangi nom kiriting:`);
                if (newName && newName.trim()) {
                  handleProcessCommand(`${fileName} nomini ${newName.trim()} qil`);
                }
              }}
              onViewFile={(fileName, content, loc) => {
                setViewingFile({
                  isOpen: true,
                  name: fileName,
                  content: content || '',
                  location: loc || 'Desktop',
                });
              }}
              onCreateNewFile={(fileName, content) => {
                handleProcessCommand(`Desktopda ${fileName} yarat ichiga ${content || 'Yangi fayl'} deb yoz`);
              }}
            />
          </div>
        )}

        {/* Tab 3: Action History Logs View */}
        {activeTab === 'logs' && (
          <div className="flex-1 space-y-4 overflow-y-auto">
            {recentFiles && (
              <FileBrowserCard
                location={recentFiles.location}
                items={recentFiles.items}
                onOpenFile={(fileName) => handleProcessCommand(`${fileName} faylini och`)}
                onDeleteFile={(fileName) => handleProcessCommand(`${fileName} faylini o'chir`)}
                onRenameFile={(fileName) => {
                  const newName = prompt(`"${fileName}" uchun yangi nom kiriting:`);
                  if (newName && newName.trim()) {
                    handleProcessCommand(`${fileName} nomini ${newName.trim()} qil`);
                  }
                }}
              />
            )}

            <ActionHistory
              logs={actionLogs}
              onClearHistory={handleClearHistory}
            />

            <div className="pt-2 sticky bottom-1 sm:bottom-2 z-20">
              <CommandInput
                onSubmit={handleProcessCommand}
                isProcessing={isProcessing}
                onListeningChange={(listening, msg) => {
                  setIsVoiceActive(listening);
                  if (listening) {
                    setOrbStatus('listening');
                    setOrbText(msg || '🎤 Tinglayapman...');
                  } else {
                    setOrbStatus('idle');
                    setOrbText(msg || 'Buyruq bering...');
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Tab 4: Phone Companion / Install Guide View */}
        {activeTab === 'phone' && (
          <div className="flex-1 overflow-y-auto">
            <PhoneCompanionView
              onOpenDownloadModal={() => setIsDownloadOpen(true)}
              onRunSampleCommand={(cmd) => {
                setActiveTab('chat');
                handleProcessCommand(cmd);
              }}
            />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (sm:hidden, fixed bottom) */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onChangeTab={setActiveTab}
        chatCount={chatMessages.length}
        filesCount={recentFiles?.items?.length || 0}
        logsCount={actionLogs.length}
      />

      {/* Permissions Modal */}
      <PermissionsModal
        isOpen={isPermissionsOpen}
        onClose={() => setIsPermissionsOpen(false)}
        allowedLocations={allowedLocations}
        onToggleLocation={handleToggleLocation}
        onSave={handleSavePermissions}
        isFirstStartup={isFirstStartup}
      />

      {/* Windows Agent Setup & Bat Download Modal */}
      <AgentSetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        agentStatus={agentStatus}
        onRefreshStatus={refreshAgent}
        isChecking={isCheckingAgent}
      />

      {/* In-App File Viewer & Editor Modal */}
      <FileViewerModal
        isOpen={viewingFile.isOpen}
        fileName={viewingFile.name}
        initialContent={viewingFile.content}
        location={viewingFile.location}
        onClose={() => setViewingFile((prev) => ({ ...prev, isOpen: false }))}
        onSave={(fName, newContent) => {
          handleProcessCommand(`${fName} fayliga "${newContent}" deb yoz`);
        }}
      />

      {/* Multi-Platform Download & Install Modal (Windows .exe, Mac, Android) */}
      <DownloadAppModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />

      {/* YouTube In-App Center & Player Modal */}
      <YouTubeModal
        isOpen={youTubeState.isOpen}
        onClose={() => setYouTubeState((prev) => ({ ...prev, isOpen: false }))}
        url={youTubeState.url}
        initialQuery={youTubeState.query}
      />

      {/* Offline Status Badge */}
      <OfflineIndicator />
    </div>
  );
}

