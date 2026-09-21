import { AppSettings, ChatSession, LocalPlugin, Project, FileItem, ApprovedLocation, PermissionSettings } from '../types';

const STORAGE_KEYS = {
  CHATS: 'jarvis_local_chats_v1',
  ACTIVE_CHAT_ID: 'jarvis_active_chat_id_v1',
  SETTINGS: 'jarvis_settings_v1',
  PLUGINS: 'jarvis_plugins_v1',
  PROJECTS: 'jarvis_projects_v1',
  FILES: 'jarvis_virtual_fs_v1',
};

export const DEFAULT_PERMISSIONS: PermissionSettings = {
  application_launch: {
    enabled: true,
    requireConfirmation: false,
    label: 'Dasturlarni ishga tushirish',
    description: 'Chrome, Notepad, Calculator va boshqa lokal dasturlarni ochishga ruxsat berish.',
  },
  file_access: {
    enabled: true,
    requireConfirmation: false,
    label: 'Fayllarni o‘qish va ko‘rish',
    description: 'Kompyuterdagi ruxsat etilgan papkalardagi fayllarni ochish va ko‘rish.',
  },
  file_delete: {
    enabled: true,
    requireConfirmation: true, // Requires confirmation
    label: 'Fayllarni o‘chirish',
    description: 'Fayl yoki papkalarni o‘chirishdan oldin tasdiq so‘rash.',
  },
  browser_control: {
    enabled: true,
    requireConfirmation: false,
    label: 'Brauzer boshqaruvi',
    description: 'Saytlar, YouTube, Telegram va qidiruv so‘rovlarini ochish.',
  },
  windows_commands: {
    enabled: true,
    requireConfirmation: true, // Dangerous commands (shutdown, restart) require confirmation
    label: 'Windows tizim buyruqlari',
    description: 'Kompyuterni o‘chirish, qayta yuklash, ekran qulflash kabi tizim amallari.',
  },
  system_settings: {
    enabled: true,
    requireConfirmation: true,
    label: 'Tizim sozlamalari',
    description: 'Windows sozlamalari va ovoz/parametrlarni o‘zgartirish.',
  },
  automation: {
    enabled: true,
    requireConfirmation: false,
    label: 'Avtomatlashtirish',
    description: 'Ketma-ket amallar va optimizatsiya skriptlarini bajarish.',
  },
};

export const DEFAULT_SETTINGS: AppSettings = {
  agentName: 'JARVIS',
  language: 'uz_lat',
  theme: 'dark',
  animations: true,
  soundEnabled: true,
  showTimestamps: true,
  notifications: true,
  defaultLocation: 'Desktop',
  permissions: DEFAULT_PERMISSIONS,
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj_jarvis',
    name: 'JARVIS',
    description: 'Asosiy lokal tizim buyruqlari va monitoring',
    color: '#00f0ff',
    icon: 'Bot',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'proj_web',
    name: 'Web',
    description: 'Brauzer, vebsaytlar va onlayn resurslar',
    color: '#3b82f6',
    icon: 'Globe',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'proj_desktop',
    name: 'Desktop',
    description: 'Windows dasturlari, Explorer va fayllar',
    color: '#10b981',
    icon: 'Monitor',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'proj_testing',
    name: 'Testing',
    description: 'Avtomatlashtirish va tajribalar',
    color: '#a855f7',
    icon: 'Cpu',
    createdAt: Date.now(),
  },
];

export const DEFAULT_PLUGINS: LocalPlugin[] = [
  {
    id: 'browser_plugin',
    name: 'Browser Plugin',
    description: 'Brauzerni boshqarish, veb-saytlar, YouTube, qidiruv va URL ochish.',
    status: 'active',
    enabled: true,
    version: '1.2.0',
    icon: 'Globe',
    category: 'Internet & Browser',
    commandsCount: 8,
    guide: 'Brauzerni ochish, qidiruv o‘tkazish ("Google da qidir: ...") yoki ma\'lum vebsaytlarga kirish imkonini beradi. Hech qanday AI ishlatmaydi.',
  },
  {
    id: 'file_plugin',
    name: 'File Plugin',
    description: 'Lokal fayllar bilan ishlash (yaratish, o‘qish, ko‘rish, tahrirlash, o‘chirish).',
    status: 'active',
    enabled: true,
    version: '1.4.0',
    icon: 'Folder',
    category: 'Filesystem',
    commandsCount: 12,
    guide: 'Kompyuterning Desktop, Downloads, Documents papkalarida matnli fayllar yaratish, ro‘yxatini ko‘rish va ochish uchun xizmat qiladi.',
  },
  {
    id: 'windows_plugin',
    name: 'Windows Plugin',
    description: 'Windows operatsion tizimi buyruqlari (kompyuterni bloklash, o‘chirish, restart, explorer).',
    status: 'active',
    enabled: true,
    version: '2.0.0',
    icon: 'Terminal',
    category: 'Windows Core',
    commandsCount: 10,
    guide: 'Windows cmd/powershell va rundll32 tizim buyruqlarini xavfsiz whitelist orqali boshqaradi. Xavfli amallarda doimo tasdiq so‘raydi.',
  },
  {
    id: 'system_plugin',
    name: 'System Plugin',
    description: 'Tizim monitoringi (RAM, CPU, Uptime, tovush/volume, skrinshot olib saqlash).',
    status: 'active',
    enabled: true,
    version: '1.1.0',
    icon: 'Cpu',
    category: 'System Diagnostics',
    commandsCount: 6,
    guide: 'Kompyuter parametrlarini monitoring qilish, ovoz balandligini sozlash va ekran rasmini olish vositasi.',
  },
  {
    id: 'automation_plugin',
    name: 'Automation Plugin',
    description: 'Ketma-ket amallar, kesh tozalash va tizim optimizatsiyasi skriptlari.',
    status: 'active',
    enabled: true,
    version: '1.0.0',
    icon: 'Zap',
    category: 'Automation',
    commandsCount: 5,
    guide: 'Bir nechta lokal buyruqlarni bitta buyruq orqali bajarish yoki Windows keshini tozalash skriptlarini yaratish imkonini beradi.',
  },
];

export const INITIAL_FILES: Record<ApprovedLocation, FileItem[]> = {
  Desktop: [
    {
      name: 'hujjat.txt',
      type: 'file',
      size: 142,
      sizeFormatted: '142 B',
      modifiedAt: new Date().toLocaleDateString(),
      location: 'Desktop',
      content: 'JARVIS Lokal Desktop Agent - 100% oflayn ishlovchi tizim.',
    },
    {
      name: 'Reja_2026.txt',
      type: 'file',
      size: 280,
      sizeFormatted: '280 B',
      modifiedAt: new Date().toLocaleDateString(),
      location: 'Desktop',
      content: '1. Lokal buyruqlarni sozlash\n2. Windows pluginlarini tekshirish\n3. Oflayn rejimda ishlash',
    },
  ],
  Documents: [
    {
      name: 'Hisobot.txt',
      type: 'file',
      size: 512,
      sizeFormatted: '512 B',
      modifiedAt: new Date().toLocaleDateString(),
      location: 'Documents',
      content: 'JARVIS hisoboti: Tizim lokal ish stantsiyasida muvaffaqiyatli ishga tushdi.',
    },
  ],
  Downloads: [
    {
      name: 'install.bat',
      type: 'file',
      size: 84,
      sizeFormatted: '84 B',
      modifiedAt: new Date().toLocaleDateString(),
      location: 'Downloads',
      content: '@echo off\necho JARVIS o‘rnatildi.',
    },
  ],
  Pictures: [],
  Videos: [],
};

export class StorageService {
  // --- CHATS ---
  static getChats(): ChatSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHATS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('StorageService.getChats error:', e);
    }
    // Default initial chat session
    const initialChat: ChatSession = {
      id: 'chat_init_1',
      title: 'Yangi seans',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      projectId: 'proj_jarvis',
      messages: [
        {
          id: 'welcome_msg_1',
          sender: 'jarvis',
          text: `Assalomu alaykum, ser! Men sizning shaxsiy LOCAL DESKTOP AGENTIZMAN.\n\n⚡ Men 100% lokal rejimda ishlayman va hech qanday tashqi AI, LLM yoki bulutli xizmatlarga ulanmayman. Barcha buyruqlar oldindan yozilgan lokal handlerlar va whitelist orqali to‘g‘ridan-to‘g‘ri kompyuteringizda bajariladi.\n\n💡 Sinab ko‘ring:\n• "Chrome och"\n• "Notepad och"\n• "Calculator och"\n• "Desktopda test.txt yarat"\n• "Downloads papkasini och"\n• "Kompyuterni blokla"`,
          timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: Date.now(),
          status: 'info',
        }
      ],
    };
    this.saveChats([initialChat]);
    this.setActiveChatId(initialChat.id);
    return [initialChat];
  }

  static saveChats(chats: ChatSession[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
    } catch (e) {
      console.warn('StorageService.saveChats error:', e);
    }
  }

  static getActiveChatId(): string {
    const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_CHAT_ID);
    if (id) return id;
    const chats = this.getChats();
    return chats[0]?.id || 'chat_init_1';
  }

  static setActiveChatId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CHAT_ID, id);
  }

  // --- SETTINGS ---
  static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('StorageService.getSettings error:', e);
    }
    return DEFAULT_SETTINGS;
  }

  static saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('StorageService.saveSettings error:', e);
    }
  }

  // --- PLUGINS ---
  static getPlugins(): LocalPlugin[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLUGINS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('StorageService.getPlugins error:', e);
    }
    this.savePlugins(DEFAULT_PLUGINS);
    return DEFAULT_PLUGINS;
  }

  static savePlugins(plugins: LocalPlugin[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PLUGINS, JSON.stringify(plugins));
    } catch (e) {
      console.warn('StorageService.savePlugins error:', e);
    }
  }

  // --- PROJECTS ---
  static getProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('StorageService.getProjects error:', e);
    }
    this.saveProjects(DEFAULT_PROJECTS);
    return DEFAULT_PROJECTS;
  }

  static saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.warn('StorageService.saveProjects error:', e);
    }
  }

  // --- VIRTUAL FILESYSTEM ---
  static getFiles(): Record<ApprovedLocation, FileItem[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FILES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('StorageService.getFiles error:', e);
    }
    this.saveFiles(INITIAL_FILES);
    return INITIAL_FILES;
  }

  static saveFiles(files: Record<ApprovedLocation, FileItem[]>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
    } catch (e) {
      console.warn('StorageService.saveFiles error:', e);
    }
  }

  // --- RESET / CLEAR ---
  static clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.CHATS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_CHAT_ID);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.PLUGINS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.FILES);
  }
}
