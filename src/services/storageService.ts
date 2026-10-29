import { 
  AppSettings, 
  ChatSession, 
  LocalPlugin, 
  Project, 
  FileItem, 
  ApprovedLocation, 
  PermissionSettings,
  WindowsAppId,
  CustomAlias,
  CustomMacro,
  MacroAction
} from '../types';

const STORAGE_KEYS = {
  CHATS: 'jarvis_local_chats_v1',
  ACTIVE_CHAT_ID: 'jarvis_active_chat_id_v1',
  SETTINGS: 'jarvis_settings_v1',
  PLUGINS: 'jarvis_plugins_v1',
  PROJECTS: 'jarvis_projects_v1',
  FILES: 'jarvis_virtual_fs_v1',
  COMMAND_HISTORY: 'jarvis_command_history_v1',
  ALIASES: 'jarvis_custom_aliases_v1',
  MACROS: 'jarvis_custom_macros_v1',
  FAVORITES: 'jarvis_favorite_apps_v1',
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
    label: 'Windows / OS tizim buyruqlari',
    description: 'Kompyuterni o‘chirish, qayta yuklash, ekran qulflash kabi tizim amallari.',
  },
  system_settings: {
    enabled: true,
    requireConfirmation: true,
    label: 'Tizim sozlamalari',
    description: 'OS sozlamalari va ovoz/parametrlarni o‘zgartirish.',
  },
  automation: {
    enabled: true,
    requireConfirmation: false,
    label: 'Avtomatlashtirish & Makroslar',
    description: 'Ketma-ket amallar va optimizatsiya skriptlarini bajarish.',
  },
};

export const DEFAULT_ALIASES: CustomAlias[] = [
  { id: 'alias_1', alias: 'ish', command: 'open notepad', createdAt: Date.now() - 3600000 * 5 },
  { id: 'alias_2', alias: 'hisob', command: 'open calculator', createdAt: Date.now() - 3600000 * 4 },
  { id: 'alias_3', alias: 'fayllar', command: 'open file explorer', createdAt: Date.now() - 3600000 * 3 },
  { id: 'alias_4', alias: 'holat', command: 'tizim holati', createdAt: Date.now() - 3600000 * 2 },
  { id: 'alias_5', alias: 'vaqt', command: 'time', createdAt: Date.now() - 3600000 },
];

export const DEFAULT_MACROS: CustomMacro[] = [
  {
    id: 'macro_work',
    name: 'Ish Stolni Tayyorlash',
    description: 'Bloknot, CMD va Kalkulyatorni ketma-ket ishga tushiradi',
    shortcut: 'Ctrl+Shift+1',
    createdAt: Date.now() - 86400000,
    actions: [
      { id: 'act_1', command: 'open notepad', delayMs: 300, description: 'Bloknot ochish' },
      { id: 'act_2', command: 'open cmd', delayMs: 400, description: 'Terminal ochish' },
      { id: 'act_3', command: 'open calculator', delayMs: 400, description: 'Kalkulyator ochish' },
    ],
  },
  {
    id: 'macro_clean',
    name: 'Tezkor Kesh Tozalash',
    description: 'Keshni tozalash va tizim xotirasini tekshirish',
    shortcut: 'Ctrl+Shift+2',
    createdAt: Date.now() - 86400000 * 2,
    actions: [
      { id: 'act_c1', command: 'kesh tozalash', delayMs: 400, description: 'Kesh tozalash' },
      { id: 'act_c2', command: 'tizim holati', delayMs: 300, description: 'Tizim parametrlarini olish' },
    ],
  },
];

export const DEFAULT_FAVORITE_APPS: WindowsAppId[] = [
  'calculator',
  'notepad',
  'cmd',
  'explorer',
  'browser',
  'taskmgr',
];

export const DEFAULT_SETTINGS: AppSettings = {
  agentName: 'JARVIS',
  language: 'uz',
  theme: 'dark',
  osTheme: 'auto',
  animations: true,
  soundEnabled: true,
  ttsEnabled: true,
  showTimestamps: true,
  notifications: true,
  defaultLocation: 'Desktop',
  permissions: DEFAULT_PERMISSIONS,
  favoriteApps: DEFAULT_FAVORITE_APPS,
  customAliases: DEFAULT_ALIASES,
  customMacros: DEFAULT_MACROS,
  feedbackVolume: 80,
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj_jarvis',
    name: 'JARVIS Core',
    description: 'Asosiy lokal tizim buyruqlari, monitoring va avtomatlashtirish',
    color: '#00f0ff',
    icon: 'Bot',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'proj_web',
    name: 'Internet & Web',
    description: 'Brauzer, vebsaytlar, qidiruv va onlayn resurslar',
    color: '#3b82f6',
    icon: 'Globe',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'proj_desktop',
    name: 'Desktop & Files',
    description: 'Tizim dasturlari, Explorer, fayllar va xotira',
    color: '#10b981',
    icon: 'Monitor',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'proj_testing',
    name: 'Testing & Macros',
    description: 'Lokal avtomatlashtirish va ketma-ket makroslar',
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
    version: '1.6.0',
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
    version: '1.6.0',
    icon: 'Folder',
    category: 'Filesystem',
    commandsCount: 12,
    guide: 'Kompyuterning Desktop, Downloads, Documents papkalarida matnli fayllar (.txt, .json, .log) yaratish, ro‘yxatini ko‘rish va ochish uchun xizmat qiladi.',
  },
  {
    id: 'windows_plugin',
    name: 'OS & System Plugin',
    description: 'Windows, macOS va Android operatsion tizimi buyruqlari (ilovalarni ochish, bloklash, xotira).',
    status: 'active',
    enabled: true,
    version: '1.6.0',
    icon: 'Terminal',
    category: 'System Core',
    commandsCount: 15,
    guide: '11 ta lokal dasturni ochish, yopish, kompyuterni bloklash yoki o‘chirish buyruqlarini boshqaradi.',
  },
  {
    id: 'system_plugin',
    name: 'Hardware & Diagnostic Plugin',
    description: 'CPU yadrolari, RAM xotira, audio dinamik va batareya holati diagnostikasi.',
    status: 'active',
    enabled: true,
    version: '1.6.0',
    icon: 'Cpu',
    category: 'Hardware & Diagnostic',
    commandsCount: 9,
    guide: 'Haqiqiy kompyuter apparat ma\'lumotlarini o‘qish va ovoz parametrlarini boshqarish.',
  },
  {
    id: 'automation_plugin',
    name: 'Automation & Macros Plugin',
    description: 'Ketma-ket makroslar, custom aliaslar va kesh tozalash avtomatizatsiyasi.',
    status: 'active',
    enabled: true,
    version: '1.6.0',
    icon: 'Zap',
    category: 'Automation & Productivity',
    commandsCount: 6,
    guide: 'Bir nechta buyruqlarni bitta tugma yoki kalit so‘z bilan ketma-ket bajarish.',
  },
];

export const INITIAL_FILES: Record<ApprovedLocation, FileItem[]> = {
  Desktop: [
    {
      name: 'Eslatma.txt',
      type: 'file',
      size: 142,
      sizeFormatted: '142 B',
      modifiedAt: 'Bugun, 09:30',
      location: 'Desktop',
      content: 'JARVIS 1.6: 100% oflayn rejimda ishlaydi. AI va tashqi serverlarga bog‘liq emas.',
    },
    {
      name: 'Rejalar.txt',
      type: 'file',
      size: 215,
      sizeFormatted: '215 B',
      modifiedAt: 'Kecha, 18:20',
      location: 'Desktop',
      content: '1. Kompyuter xotirasini tekshirish\n2. Yangi makroslarni yaratish\n3. settings.json zaxirasini olish',
    },
  ],
  Documents: [
    {
      name: 'Hisobot.txt',
      type: 'file',
      size: 512,
      sizeFormatted: '512 B',
      modifiedAt: '2 kun oldin',
      location: 'Documents',
      content: 'Lokal tizim xavfsizlik audit hisoboti: barcha ruxsatlar nazorat ostida.',
    },
  ],
  Downloads: [
    {
      name: 'JARVIS_Guide.txt',
      type: 'file',
      size: 820,
      sizeFormatted: '820 B',
      modifiedAt: '1 hafta oldin',
      location: 'Downloads',
      content: 'JARVIS 1.6 foydalanish qo‘llanmasi: barcha buyruqlar va klaviatura yorliqlari.',
    },
  ],
  Pictures: [
    {
      name: 'Screenshot_Sample.png',
      type: 'file',
      size: 245000,
      sizeFormatted: '240 KB',
      modifiedAt: '3 kun oldin',
      location: 'Pictures',
    },
  ],
  Videos: [
    {
      name: 'Tutorial_Clip.mp4',
      type: 'file',
      size: 1540000,
      sizeFormatted: '1.5 MB',
      modifiedAt: '5 kun oldin',
      location: 'Videos',
    },
  ],
};

export class StorageService {
  // --- CHATS ---
  static getChats(): ChatSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHATS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('StorageService.getChats error:', e);
    }

    const initialChats: ChatSession[] = [
      {
        id: 'chat_init_1',
        title: 'Asosiy Tizim Boshqaruvi',
        createdAt: Date.now() - 3600000 * 2,
        updatedAt: Date.now() - 600000,
        projectId: 'proj_jarvis',
        messages: [
          {
            id: 'msg_welcome',
            sender: 'jarvis',
            text: 'Salom, ser! JARVIS 1.6 mahalliy ish stolingizda xizmatingizga tayyor.\n\nBarcha buyruqlar 100% lokal va xavfsiz ishlaydi. Qanday buyruq bajaramiz?\n\nMasalan: "open calculator", "time", "date", "kesh tozalash", "tizim holati" yoki "help".',
            timeFormatted: new Date(Date.now() - 3600000 * 2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now() - 3600000 * 2,
            status: 'info',
          },
        ],
      },
    ];

    this.saveChats(initialChats);
    return initialChats;
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
        const parsed = JSON.parse(data);
        return { 
          ...DEFAULT_SETTINGS, 
          ...parsed,
          favoriteApps: parsed.favoriteApps || DEFAULT_FAVORITE_APPS,
          customAliases: parsed.customAliases || DEFAULT_ALIASES,
          customMacros: parsed.customMacros || DEFAULT_MACROS,
          feedbackVolume: typeof parsed.feedbackVolume === 'number' ? parsed.feedbackVolume : 80,
        };
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

  static exportSettingsJson(): string {
    const settings = this.getSettings();
    return JSON.stringify(settings, null, 2);
  }

  static importSettingsJson(jsonStr: string): AppSettings | null {
    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed === 'object' && parsed !== null) {
        const merged: AppSettings = { ...DEFAULT_SETTINGS, ...parsed };
        this.saveSettings(merged);
        return merged;
      }
    } catch (e) {
      console.warn('StorageService.importSettingsJson error:', e);
    }
    return null;
  }

  // --- FULL BACKUP (Chats + Projects + Plugins + Aliases + Macros + Settings) ---
  static exportFullBackupJson(): string {
    const backup = {
      version: '1.6.0',
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      chats: this.getChats(),
      projects: this.getProjects(),
      plugins: this.getPlugins(),
      aliases: this.getCustomAliases(),
      macros: this.getCustomMacros(),
      favorites: this.getFavoriteApps(),
      files: this.getFiles(),
    };
    return JSON.stringify(backup, null, 2);
  }

  static importFullBackupJson(jsonStr: string): { success: boolean; message: string; importedItems?: string[] } {
    try {
      const backup = JSON.parse(jsonStr);
      if (backup && typeof backup === 'object') {
        const imported: string[] = [];
        if (backup.settings) {
          this.saveSettings({ ...DEFAULT_SETTINGS, ...backup.settings });
          imported.push('Sozlamalar');
        }
        if (Array.isArray(backup.chats)) {
          this.saveChats(backup.chats);
          imported.push(`Chatlar (${backup.chats.length})`);
        }
        if (Array.isArray(backup.projects)) {
          this.saveProjects(backup.projects);
          imported.push(`Loyihalar (${backup.projects.length})`);
        }
        if (Array.isArray(backup.plugins)) {
          this.savePlugins(backup.plugins);
          imported.push('Pluginlar');
        }
        if (Array.isArray(backup.aliases)) {
          this.saveCustomAliases(backup.aliases);
          imported.push(`Taxalluslar (${backup.aliases.length})`);
        }
        if (Array.isArray(backup.macros)) {
          this.saveCustomMacros(backup.macros);
          imported.push(`Makroslar (${backup.macros.length})`);
        }
        if (Array.isArray(backup.favorites)) {
          this.saveFavoriteApps(backup.favorites);
          imported.push('Sevimli ilovalar');
        }
        if (backup.files) {
          this.saveFiles(backup.files);
          imported.push('Virtual fayllar');
        }
        return { 
          success: true, 
          message: 'Zaxira nusxasi muvaffaqiyatli tiklandi!', 
          importedItems: imported 
        };
      }
      return { success: false, message: 'JSON formati yaroqsiz.' };
    } catch (e: any) {
      console.warn('StorageService.importFullBackupJson error:', e);
      return { success: false, message: `Xatolik: ${e.message || 'Fayl formati noto‘g‘ri'}` };
    }
  }

  // --- FAVORITE APPS ---
  static getFavoriteApps(): WindowsAppId[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return DEFAULT_FAVORITE_APPS;
  }

  static saveFavoriteApps(favorites: WindowsAppId[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) {}
  }

  static toggleFavoriteApp(appId: WindowsAppId): WindowsAppId[] {
    const current = this.getFavoriteApps();
    const updated = current.includes(appId)
      ? current.filter(id => id !== appId)
      : [...current, appId];
    this.saveFavoriteApps(updated);
    return updated;
  }

  // --- CUSTOM ALIASES ---
  static getCustomAliases(): CustomAlias[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALIASES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return DEFAULT_ALIASES;
  }

  static saveCustomAliases(aliases: CustomAlias[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ALIASES, JSON.stringify(aliases));
    } catch (e) {}
  }

  static addCustomAlias(alias: string, command: string): CustomAlias {
    const list = this.getCustomAliases();
    const cleanAlias = alias.trim().toLowerCase();
    const filtered = list.filter(a => a.alias.toLowerCase() !== cleanAlias);
    const newAlias: CustomAlias = {
      id: `alias_${Date.now()}`,
      alias: cleanAlias,
      command: command.trim(),
      createdAt: Date.now(),
    };
    const updated = [newAlias, ...filtered];
    this.saveCustomAliases(updated);
    return newAlias;
  }

  static deleteCustomAlias(id: string): void {
    const list = this.getCustomAliases();
    const updated = list.filter(a => a.id !== id);
    this.saveCustomAliases(updated);
  }

  // --- CUSTOM MACROS ---
  static getCustomMacros(): CustomMacro[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MACROS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return DEFAULT_MACROS;
  }

  static saveCustomMacros(macros: CustomMacro[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MACROS, JSON.stringify(macros));
    } catch (e) {}
  }

  static addCustomMacro(name: string, description: string, actions: MacroAction[], shortcut?: string): CustomMacro {
    const list = this.getCustomMacros();
    const newMacro: CustomMacro = {
      id: `macro_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      actions,
      shortcut: shortcut?.trim(),
      createdAt: Date.now(),
    };
    const updated = [newMacro, ...list];
    this.saveCustomMacros(updated);
    return newMacro;
  }

  static deleteCustomMacro(id: string): void {
    const list = this.getCustomMacros();
    const updated = list.filter(m => m.id !== id);
    this.saveCustomMacros(updated);
  }

  // --- COMMAND HISTORY (Last 20 commands) ---
  static getCommandHistory(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMMAND_HISTORY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed.slice(0, 20);
      }
    } catch (e) {
      console.warn('StorageService.getCommandHistory error:', e);
    }
    return [];
  }

  static addCommandToHistory(command: string): string[] {
    const cmd = command.trim();
    if (!cmd) return this.getCommandHistory();

    const existing = this.getCommandHistory().filter(c => c.toLowerCase() !== cmd.toLowerCase());
    const updated = [cmd, ...existing].slice(0, 20);

    try {
      localStorage.setItem(STORAGE_KEYS.COMMAND_HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.warn('StorageService.addCommandToHistory error:', e);
    }
    return updated;
  }

  static clearCommandHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.COMMAND_HISTORY);
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
    localStorage.removeItem(STORAGE_KEYS.COMMAND_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.ALIASES);
    localStorage.removeItem(STORAGE_KEYS.MACROS);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
  }
}
