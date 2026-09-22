import { CommandExecutionResult, LocalCommandDefinition } from '../types';

export const BROWSER_COMMANDS_META: LocalCommandDefinition[] = [
  {
    id: 'browser_youtube',
    name: 'YouTube',
    category: 'browser',
    pluginId: 'browser_plugin',
    keywords: ['youtube', 'youtube och', 'youtubeni och', 'youtubega kir', 'youtube.com', 'musiqa qoy', "musiqa qo'y", 'video och', 'youtube ochish'],
    description: 'YouTube video portalini brauzerda ochadi.',
    example: 'YouTube och',
    requiresPermission: 'browser_control',
  },
  {
    id: 'browser_telegram',
    name: 'Telegram Web',
    category: 'browser',
    pluginId: 'browser_plugin',
    keywords: ['telegram', 'telegram och', 'telegramni och', 'telegramga kir', 'tg och', 'tgni och', 'telegram web'],
    description: 'Telegram messenjerining veb versiyasini ochadi.',
    example: 'Telegram och',
    requiresPermission: 'browser_control',
  },
  {
    id: 'browser_google',
    name: 'Google Qidiruv',
    category: 'browser',
    pluginId: 'browser_plugin',
    keywords: ['google', 'google och', 'googleni och', 'googleda qidir', 'qidir', 'qidiruv', 'internetdan top', 'google search'],
    description: 'Google qidiruv tizimini ochadi yoki so‘rovni qidiradi.',
    example: 'Google da qidir: O‘zbekiston yangiliklari',
    requiresPermission: 'browser_control',
  },
  {
    id: 'browser_instagram',
    name: 'Instagram Web',
    category: 'browser',
    pluginId: 'browser_plugin',
    keywords: ['instagram', 'instagram och', 'instagramni och', 'insta och', 'instani och', 'instagramga kir', 'insta'],
    description: 'Instagram ijtimoiy tarmog‘i veb saytini ochadi.',
    example: 'Instagram och',
    requiresPermission: 'browser_control',
  },
  {
    id: 'browser_github',
    name: 'GitHub',
    category: 'browser',
    pluginId: 'browser_plugin',
    keywords: ['github', 'github och', 'git och', 'githubga kir'],
    description: 'GitHub dasturiy ta\'minot platformasini ochadi.',
    example: 'GitHub och',
    requiresPermission: 'browser_control',
  },
  {
    id: 'browser_edge',
    name: 'Microsoft Edge',
    category: 'browser',
    pluginId: 'browser_plugin',
    keywords: ['edge', 'microsoft edge', 'edge och', 'edgeni och'],
    description: 'Microsoft Edge brauzerini ishga tushiradi.',
    example: 'Edge och',
    requiresPermission: 'browser_control',
  },
];

export async function executeBrowserCommand(commandId: string, args: Record<string, any>): Promise<CommandExecutionResult> {
  switch (commandId) {
    case 'browser_youtube': {
      const url = 'https://www.youtube.com';
      try {
        window.open(url, '_blank');
      } catch (e) {}
      return {
        success: true,
        message: '🎬 Bajarildi, ser! YouTube brauzerda ochildi.',
        details: `URL: ${url}\nPlatforma: YouTube Web Video Player`,
        webLink: {
          title: 'YouTube',
          url,
          iconType: 'youtube',
        },
        windowsCommand: `start chrome.exe "https://www.youtube.com"`,
      };
    }

    case 'browser_telegram': {
      const url = 'https://web.telegram.org';
      try {
        window.open(url, '_blank');
      } catch (e) {}
      return {
        success: true,
        message: '✈️ Bajarildi, ser! Telegram Web ochildi.',
        details: `URL: ${url}\nPlatforma: Telegram Web Messenger`,
        webLink: {
          title: 'Telegram Web',
          url,
          iconType: 'telegram',
        },
        windowsCommand: `start chrome.exe "https://web.telegram.org"`,
      };
    }

    case 'browser_instagram': {
      const url = 'https://www.instagram.com';
      try {
        window.open(url, '_blank');
      } catch (e) {}
      return {
        success: true,
        message: '📸 Bajarildi, ser! Instagram sahifasi ochildi.',
        details: `URL: ${url}\nPlatforma: Instagram Web`,
        webLink: {
          title: 'Instagram',
          url,
          iconType: 'browser',
        },
        windowsCommand: `start chrome.exe "https://www.instagram.com"`,
      };
    }

    case 'browser_google': {
      const query = args.query ? encodeURIComponent(args.query) : '';
      const url = query ? `https://www.google.com/search?q=${query}` : 'https://www.google.com';
      try {
        window.open(url, '_blank');
      } catch (e) {}
      return {
        success: true,
        message: args.query
          ? `🔍 Bajarildi, ser! Google da "${args.query}" so‘rovi bo‘yicha qidiruv ochildi.`
          : '🌐 Bajarildi, ser! Google bosh sahifasi ochildi.',
        details: `Qidiruv havolasi: ${url}`,
        webLink: {
          title: args.query ? `Google: ${args.query}` : 'Google',
          url,
          iconType: 'google',
        },
        windowsCommand: `start chrome.exe "${url}"`,
      };
    }

    case 'browser_github': {
      const url = 'https://github.com';
      try {
        window.open(url, '_blank');
      } catch (e) {}
      return {
        success: true,
        message: '🐙 Bajarildi, ser! GitHub platformasi ochildi.',
        details: `URL: ${url}\nRepositories & Projects`,
        webLink: {
          title: 'GitHub',
          url,
          iconType: 'github',
        },
        windowsCommand: `start chrome.exe "https://github.com"`,
      };
    }

    case 'browser_edge': {
      return {
        success: true,
        message: '🌐 Bajarildi, ser! Microsoft Edge brauzeri ishga tushirildi.',
        details: 'Dastur: msedge.exe\nWindows Microsoft Edge Web Browser',
        windowsCommand: 'start msedge.exe',
      };
    }

    default:
      return {
        success: false,
        message: '❌ Noma\'lum brauzer buyrug‘i.',
      };
  }
}
