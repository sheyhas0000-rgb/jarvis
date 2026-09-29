import { SupportedLanguage } from '../types';

export function normalizeLang(lang?: string): SupportedLanguage {
  if (!lang) return 'uz';
  if (lang.startsWith('uz')) return 'uz';
  if (lang === 'ru') return 'ru';
  if (lang === 'en') return 'en';
  return 'uz';
}

export interface I18nDict {
  nav: {
    chat: string;
    settings: string;
    all_chats: string;
    recent_chats: string;
    plugins: string;
    projects: string;
    updates: string;
    profile: string;
    newChat: string;
    collapse: string;
    expand: string;
    offlineMode: string;
    versionBadge: string;
  };
  header: {
    offline: string;
    localAgent: string;
    clearChat: string;
    clearConfirm: string;
    langSelect: string;
    appsDock: string;
    openAppTitle: string;
  };
  chat: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    welcomeTip: string;
    placeholder: string;
    voiceActive: string;
    voiceInactive: string;
    voiceNotSupported: string;
    quick: string;
    quickActionsTitle: string;
    processing: string;
    windowsCommandLabel: string;
    openSite: string;
    downloadFile: string;
    you: string;
    today: string;
    yesterday: string;
    older: string;
    noChats: string;
    searchChatPlaceholder: string;
    untitledChat: string;
    rename: string;
    delete: string;
    archive: string;
    unarchive: string;
    archivedSection: string;
  };
  apps: {
    calculator: { name: string; desc: string };
    clock: { name: string; desc: string };
    cmd: { name: string; desc: string };
    notepad: { name: string; desc: string };
    paint: { name: string; desc: string };
    explorer: { name: string; desc: string };
    taskmgr: { name: string; desc: string };
    settings: { name: string; desc: string };
    browser: { name: string; desc: string };
    control: { name: string; desc: string };
    calendar: { name: string; desc: string };
  };
  quickChips: string[];
  settings: {
    title: string;
    subtitle: string;
    tabGeneral: string;
    tabPermissions: string;
    tabCommands: string;
    tabStorage: string;
    agentName: string;
    language: string;
    languageUz: string;
    languageEn: string;
    languageRu: string;
    animations: string;
    animationsDesc: string;
    sound: string;
    soundDesc: string;
    timestamps: string;
    timestampsDesc: string;
    permissionsNotice: string;
    storageTitle: string;
    storageDesc: string;
    clearAllBtn: string;
    clearAllConfirm: string;
  };
  updates: {
    title: string;
    subtitle: string;
    currentBadge: string;
    offlineBadge: string;
  };
  profile: {
    title: string;
    subtitle: string;
    userName: string;
    role: string;
    station: string;
    agentNameLabel: string;
    save: string;
    cancel: string;
  };
  permissionModal: {
    title: string;
    subtitle: string;
    warning: string;
    actionType: string;
    command: string;
    permission: string;
    confirmBtn: string;
    cancelBtn: string;
  };
}

export const TRANSLATIONS: Record<SupportedLanguage, I18nDict> = {
  uz: {
    nav: {
      chat: 'Chat',
      settings: 'Sozlamalar',
      all_chats: 'Chatlar',
      recent_chats: 'So‘nggi chatlar',
      plugins: 'Pluginlar',
      projects: 'Loyihalar',
      updates: 'Yangilanishlar',
      profile: 'Profil',
      newChat: 'Yangi chat',
      collapse: 'Yon panelni yig‘ish',
      expand: 'Yon panelni ochish',
      offlineMode: 'No AI • 100% Oflayn',
      versionBadge: 'v1.4 LOCAL',
    },
    header: {
      offline: '100% Oflayn',
      localAgent: 'LOCAL AGENT',
      clearChat: 'Chatni tozalash',
      clearConfirm: 'Joriy chat xabarlarini tozalashni xohlaysizmi?',
      langSelect: 'Tilni tanlash',
      appsDock: 'Ilovalar',
      openAppTitle: 'Windows Ilovalarini Ishga Tushirish',
    },
    chat: {
      welcomeTitle: 'JARVIS Local Agent v1.4',
      welcomeSubtitle: '100% Oflayn Windows Yordamchisi. Hech qanday AI yoki tashqi API ishlatilmaydi.',
      welcomeTip: 'Quyidagi tugmalardan birini bosing yoki buyruq yozing: "open calculator", "open cmd", "open clock", "open notepad", "open paint", "open file explorer", "open task manager", "open settings", "open browser", "open control panel", "open calendar"',
      placeholder: 'Command yozing... (masalan: "open calculator", "open cmd", "open clock", "open notepad")',
      voiceActive: 'Ovozli tinglash faol...',
      voiceInactive: 'Ovozli buyruq berish',
      voiceNotSupported: 'Brauzeringiz ovozli tanib olishni qo‘llab-quvvatlamaydi.',
      quick: 'Tezkor:',
      quickActionsTitle: 'Tezkor Lokal Amallar',
      processing: 'Lokal buyruq bajarilmoqda...',
      windowsCommandLabel: 'Windows buyrug‘i:',
      openSite: 'Saytni ochish:',
      downloadFile: 'Yuklab olish',
      you: 'Siz',
      today: 'Bugun',
      yesterday: 'Kecha',
      older: 'Avvalgi',
      noChats: 'Hozircha chatlar mavjud emas',
      searchChatPlaceholder: 'Chatlardan qidirish...',
      untitledChat: 'Nomsiz seans',
      rename: 'Nomni tahrirlash',
      delete: 'O‘chirish',
      archive: 'Arxivlash',
      unarchive: 'Arxivdan chiqarish',
      archivedSection: 'Arxivlangan chatlar',
    },
    apps: {
      calculator: { name: 'Kalkulyator', desc: 'Windows kalkulyatori (calc.exe)' },
      clock: { name: 'Soat va Taymer', desc: 'Windows soat, sekundomer va budilnik (ms-clock:)' },
      cmd: { name: 'CMD / Terminal', desc: 'Windows buyruqlar satri (cmd.exe)' },
      notepad: { name: 'Bloknot (Notepad)', desc: 'Matn muharriri (notepad.exe)' },
      paint: { name: 'MS Paint', desc: 'Grafik rasm chizish dasturi (mspaint.exe)' },
      explorer: { name: 'Fayl Menejeri (Explorer)', desc: 'Windows Explorer fayl tizimi (explorer.exe)' },
      taskmgr: { name: 'Vazifalar Menejeri (Task Manager)', desc: 'Jarayonlar va tizim monitoringi (taskmgr.exe)' },
      settings: { name: 'Windows Sozlamalari', desc: 'Tizim parametrlari (ms-settings:)' },
      browser: { name: 'Brauzer', desc: 'Internet brauzeri (Google Chrome / Edge)' },
      control: { name: 'Boshqaruv Paneli (Control Panel)', desc: 'Windows boshqaruv paneli (control.exe)' },
      calendar: { name: 'Kalendar', desc: 'Windows kalendari va rejalashtiruvchi (outlookcal:)' },
    },
    quickChips: [
      'open calculator',
      'open cmd',
      'open clock',
      'open notepad',
      'open paint',
      'open file explorer',
      'open task manager',
      'open settings',
      'open browser',
      'open control panel',
      'open calendar',
      'Tizim holati',
      'Vaqt',
      'Batareya',
      'Kesh tozalash',
      'Lock PC',
    ],
    settings: {
      title: 'Sozlamalar va Konfiguratsiya',
      subtitle: 'JARVIS Local Desktop Agentining ishlash parametrlari va xavfsizlik qoidalari',
      tabGeneral: 'Umumiy',
      tabPermissions: 'Permissionlar',
      tabCommands: 'Commandlar Katalogi',
      tabStorage: 'Ma’lumotlar & Kesh',
      agentName: 'Agent Nomi',
      language: 'Til (Language)',
      languageUz: 'O‘zbekcha',
      languageEn: 'English',
      languageRu: 'Русский',
      animations: 'Silliq animatsiyalar',
      animationsDesc: 'O‘tish va UI vizual effektlari',
      sound: 'Tovush effektlari',
      soundDesc: 'Buyruq bajarilgandagi audio bildirishnoma',
      timestamps: 'Vaqt tamg‘alari (Timestamps)',
      timestampsDesc: 'Har bir xabarda vaqtni ko‘rsatish',
      permissionsNotice: 'Xavfsizlik Whitelist Nazorati: JARVIS faqat siz ruxsat bergan buyruqlarni bajaradi.',
      storageTitle: 'Lokal Xotira va Kesh',
      storageDesc: 'Barcha chatlar va fayllar brauzer/tizim xotirasida saqlanadi.',
      clearAllBtn: 'Barcha ma’lumotlarni tozalash',
      clearAllConfirm: 'Haqiqatan ham barcha chatlar va sozlamalarni o‘chirmoqchimisiz?',
    },
    updates: {
      title: 'Yangilanishlar va Versiyalar',
      subtitle: 'JARVIS Local Desktop Agentining oflayn versiyalar jurnali',
      currentBadge: 'Joriy versiya',
      offlineBadge: 'Oflayn Rejim Faol',
    },
    profile: {
      title: 'Foydalanuvchi va Agent Profili',
      subtitle: 'Lokal stansiya identifikatsiyasi va agent sozlamalari',
      userName: 'Foydalanuvchi',
      role: 'Administrator',
      station: 'Lokal Windows Ish Stantsiyasi Operator',
      agentNameLabel: 'Agent Nomi:',
      save: 'Saqlash',
      cancel: 'Bekor qilish',
    },
    permissionModal: {
      title: 'Xavfsizlik Tasdig‘i Talab Qilinadi',
      subtitle: 'JARVIS Local Agent Xavfsizlik Qoidasi',
      warning: 'Ushbu buyruq kompyuteringizda sezilarli o‘zgarish qilishi mumkin:',
      actionType: 'Amal turi:',
      command: 'Kiritilgan buyruq:',
      permission: 'Permission toifasi:',
      confirmBtn: 'Ha, ruxsat beraman',
      cancelBtn: 'Bekor qilish',
    },
  },

  en: {
    nav: {
      chat: 'Chat',
      settings: 'Settings',
      all_chats: 'All Chats',
      recent_chats: 'Recent Chats',
      plugins: 'Plugins',
      projects: 'Projects',
      updates: 'Updates',
      profile: 'Profile',
      newChat: 'New Chat',
      collapse: 'Collapse Sidebar',
      expand: 'Expand Sidebar',
      offlineMode: 'No AI • 100% Offline',
      versionBadge: 'v1.4 LOCAL',
    },
    header: {
      offline: '100% Offline',
      localAgent: 'LOCAL AGENT',
      clearChat: 'Clear Chat',
      clearConfirm: 'Are you sure you want to clear current chat messages?',
      langSelect: 'Language',
      appsDock: 'Apps',
      openAppTitle: 'Launch Windows Applications',
    },
    chat: {
      welcomeTitle: 'JARVIS Local Agent v1.4',
      welcomeSubtitle: '100% Offline Windows Assistant. Zero external AI and zero cloud APIs.',
      welcomeTip: 'Click any application button below or type commands: "open calculator", "open cmd", "open clock", "open notepad", "open paint", "open file explorer", "open task manager", "open settings", "open browser", "open control panel", "open calendar"',
      placeholder: 'Type a command... (e.g., "open calculator", "open cmd", "open clock", "open notepad")',
      voiceActive: 'Listening...',
      voiceInactive: 'Voice Input',
      voiceNotSupported: 'Your browser does not support Speech Recognition.',
      quick: 'Quick:',
      quickActionsTitle: 'Quick Local Actions',
      processing: 'Executing local command...',
      windowsCommandLabel: 'Windows Command:',
      openSite: 'Open Website:',
      downloadFile: 'Download',
      you: 'You',
      today: 'Today',
      yesterday: 'Yesterday',
      older: 'Older',
      noChats: 'No chat sessions yet',
      searchChatPlaceholder: 'Search conversations...',
      untitledChat: 'Untitled Session',
      rename: 'Rename',
      delete: 'Delete',
      archive: 'Archive',
      unarchive: 'Unarchive',
      archivedSection: 'Archived Chats',
    },
    apps: {
      calculator: { name: 'Calculator', desc: 'Windows Calculator (calc.exe)' },
      clock: { name: 'Clock & Timer', desc: 'Windows Clock, Stopwatch & Alarms (ms-clock:)' },
      cmd: { name: 'CMD / Terminal', desc: 'Windows Command Prompt (cmd.exe)' },
      notepad: { name: 'Notepad', desc: 'Windows Text Editor (notepad.exe)' },
      paint: { name: 'MS Paint', desc: 'Graphics & Drawing App (mspaint.exe)' },
      explorer: { name: 'File Explorer', desc: 'Windows File Explorer (explorer.exe)' },
      taskmgr: { name: 'Task Manager', desc: 'Processes & Resource Monitoring (taskmgr.exe)' },
      settings: { name: 'Windows Settings', desc: 'Operating System Settings (ms-settings:)' },
      browser: { name: 'Browser', desc: 'Web Browser (Google Chrome / Edge)' },
      control: { name: 'Control Panel', desc: 'Windows Control Panel (control.exe)' },
      calendar: { name: 'Calendar', desc: 'Windows Calendar & Schedule (outlookcal:)' },
    },
    quickChips: [
      'open calculator',
      'open cmd',
      'open clock',
      'open notepad',
      'open paint',
      'open file explorer',
      'open task manager',
      'open settings',
      'open browser',
      'open control panel',
      'open calendar',
      'System status',
      'Time',
      'Battery',
      'Clean temp',
      'Lock PC',
    ],
    settings: {
      title: 'Settings & Configuration',
      subtitle: 'JARVIS Local Desktop Agent operating parameters and security rules',
      tabGeneral: 'General',
      tabPermissions: 'Permissions',
      tabCommands: 'Commands Catalog',
      tabStorage: 'Data & Storage',
      agentName: 'Agent Name',
      language: 'Language',
      languageUz: 'O‘zbekcha',
      languageEn: 'English',
      languageRu: 'Русский',
      animations: 'Smooth Animations',
      animationsDesc: 'UI transitions and visual effects',
      sound: 'Sound Effects',
      soundDesc: 'Audio chime upon command execution',
      timestamps: 'Timestamps',
      timestampsDesc: 'Display time on each message',
      permissionsNotice: 'Security Whitelist Control: JARVIS only runs explicitly permitted local operations.',
      storageTitle: 'Local Data & Cache',
      storageDesc: 'All chats, virtual files and configurations are stored offline on this machine.',
      clearAllBtn: 'Clear All Local Data',
      clearAllConfirm: 'Are you sure you want to delete all chats and restore default settings?',
    },
    updates: {
      title: 'Updates & Version History',
      subtitle: 'Offline release changelog of JARVIS Local Desktop Agent',
      currentBadge: 'Current Version',
      offlineBadge: 'Offline Mode Active',
    },
    profile: {
      title: 'User & Agent Profile',
      subtitle: 'Local workstation identification and agent identity',
      userName: 'User',
      role: 'Administrator',
      station: 'Local Windows Workstation Operator',
      agentNameLabel: 'Agent Name:',
      save: 'Save',
      cancel: 'Cancel',
    },
    permissionModal: {
      title: 'Security Confirmation Required',
      subtitle: 'JARVIS Local Agent Safe Operation Guard',
      warning: 'This command will make changes on your local Windows system:',
      actionType: 'Action Type:',
      command: 'Input Command:',
      permission: 'Permission Category:',
      confirmBtn: 'Yes, Proceed',
      cancelBtn: 'Cancel',
    },
  },

  ru: {
    nav: {
      chat: 'Чат',
      settings: 'Настройки',
      all_chats: 'Все чаты',
      recent_chats: 'Недавние чаты',
      plugins: 'Плагины',
      projects: 'Проекты',
      updates: 'Обновления',
      profile: 'Профиль',
      newChat: 'Новый чант',
      collapse: 'Свернуть панель',
      expand: 'Развернуть панель',
      offlineMode: 'Без ИИ • 100% Офлайн',
      versionBadge: 'v1.4 LOCAL',
    },
    header: {
      offline: '100% Офлайн',
      localAgent: 'LOCAL AGENT',
      clearChat: 'Очистить чат',
      clearConfirm: 'Вы действительно хотите очистить текущий диалог?',
      langSelect: 'Выбор языка',
      appsDock: 'Приложения',
      openAppTitle: 'Запуск Windows Приложений',
    },
    chat: {
      welcomeTitle: 'JARVIS Local Agent v1.4',
      welcomeSubtitle: '100% Офлайн Windows Ассистент. Никаких внешних ИИ или облачных сервисов.',
      welcomeTip: 'Нажмите на кнопку любого приложения ниже или введите команду: "open calculator", "open cmd", "open clock", "open notepad", "open paint", "open file explorer", "open task manager", "open settings", "open browser", "open control panel", "open calendar"',
      placeholder: 'Введите команду... (например: "open calculator", "open cmd", "открыть блокнот", "время")',
      voiceActive: 'Слушаю команду...',
      voiceInactive: 'Голосовой ввод',
      voiceNotSupported: 'Ваш браузер не поддерживает распознавание речи.',
      quick: 'Быстро:',
      quickActionsTitle: 'Быстрые локальные действия',
      processing: 'Выполнение локальной команды...',
      windowsCommandLabel: 'Команда Windows:',
      openSite: 'Открыть сайт:',
      downloadFile: 'Скачать',
      you: 'Вы',
      today: 'Сегодня',
      yesterday: 'Вчера',
      older: 'Ранее',
      noChats: 'Нет сохраненных чатов',
      searchChatPlaceholder: 'Поиск по чатам...',
      untitledChat: 'Безымянный сеанс',
      rename: 'Переименовать',
      delete: 'Удалить',
      archive: 'В архив',
      unarchive: 'Из архива',
      archivedSection: 'Архивные чаты',
    },
    apps: {
      calculator: { name: 'Калькулятор', desc: 'Windows Калькулятор (calc.exe)' },
      clock: { name: 'Часы и Таймер', desc: 'Часы, секундомер и будильник (ms-clock:)' },
      cmd: { name: 'Командная строка (CMD)', desc: 'Терминал Windows (cmd.exe)' },
      notepad: { name: 'Блокнот (Notepad)', desc: 'Текстовый редактор (notepad.exe)' },
      paint: { name: 'MS Paint', desc: 'Графический редактор (mspaint.exe)' },
      explorer: { name: 'Проводник (Explorer)', desc: 'Файловый менеджер Windows (explorer.exe)' },
      taskmgr: { name: 'Диспетчер задач', desc: 'Мониторинг процессов и ресурсов (taskmgr.exe)' },
      settings: { name: 'Параметры Windows', desc: 'Настройки операционной системы (ms-settings:)' },
      browser: { name: 'Браузер', desc: 'Веб-браузер (Google Chrome / Edge)' },
      control: { name: 'Панель управления', desc: 'Классическая панель управления (control.exe)' },
      calendar: { name: 'Календарь', desc: 'Календарь и планировщик (outlookcal:)' },
    },
    quickChips: [
      'open calculator',
      'open cmd',
      'open clock',
      'open notepad',
      'open paint',
      'open file explorer',
      'open task manager',
      'open settings',
      'open browser',
      'open control panel',
      'open calendar',
      'Состояние системы',
      'Время',
      'Батарея',
      'Очистить кэш',
      'Lock PC',
    ],
    settings: {
      title: 'Настройки и Конфигурация',
      subtitle: 'Параметры работы и правила безопасности локального агента JARVIS',
      tabGeneral: 'Общие',
      tabPermissions: 'Разрешения',
      tabCommands: 'Каталог команд',
      tabStorage: 'Данные и память',
      agentName: 'Имя агента',
      language: 'Язык (Language)',
      languageUz: 'O‘zbekcha',
      languageEn: 'English',
      languageRu: 'Русский',
      animations: 'Плавная анимация',
      animationsDesc: 'Визуальные эффекты переходов интерфейса',
      sound: 'Звуковые эффекты',
      soundDesc: 'Звуковой сигнал при выполнении команд',
      timestamps: 'Метки времени',
      timestampsDesc: 'Показывать время для каждого сообщения',
      permissionsNotice: 'Контроль безопасности: JARVIS выполняет только разрешенные действия.',
      storageTitle: 'Локальное хранилище и кэш',
      storageDesc: 'Все чаты и виртуальные файлы сохраняются локально на этом ПК.',
      clearAllBtn: 'Очистить все локальные данные',
      clearAllConfirm: 'Вы действительно хотите удалить все чаты и восстановить стандартные настройки?',
    },
    updates: {
      title: 'Обновления и Версии',
      subtitle: 'Журнал офлайн релизов JARVIS Local Desktop Agent',
      currentBadge: 'Текущая версия',
      offlineBadge: 'Офлайн Режим Активен',
    },
    profile: {
      title: 'Профиль Пользователя и Агента',
      subtitle: 'Идентификация локальной станции и параметры агента',
      userName: 'Пользователь',
      role: 'Администратор',
      station: 'Оператор локальной рабочей станции Windows',
      agentNameLabel: 'Имя Агента:',
      save: 'Сохранить',
      cancel: 'Отмена',
    },
    permissionModal: {
      title: 'Требуется подтверждение безопасности',
      subtitle: 'Защита безопасных операций JARVIS Local Agent',
      warning: 'Данная команда выполнит изменения в локальной системе Windows:',
      actionType: 'Тип действия:',
      command: 'Введенная команда:',
      permission: 'Категория разрешения:',
      confirmBtn: 'Да, выполнить',
      cancelBtn: 'Отмена',
    },
  },
};

export function t(lang?: string): I18nDict {
  const norm = normalizeLang(lang);
  return TRANSLATIONS[norm] || TRANSLATIONS.uz;
}
