import { ActiveOSType, OSThemePreference } from '../types';

export interface DetectedOSInfo {
  activeOS: ActiveOSType;
  detectedOSName: string;
  versionGuess?: string;
  deviceType: 'desktop' | 'tablet' | 'mobile';
  isTouch: boolean;
  rawPlatform: string;
  screenSize: string;
}

/**
 * Detects the client's operating system, device form-factor, and platform hints.
 * 100% offline, synchronous, and privacy-preserving using standard client-side Web APIs.
 */
export function detectOSInfo(): DetectedOSInfo {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      activeOS: 'windows',
      detectedOSName: 'Windows',
      deviceType: 'desktop',
      isTouch: false,
      rawPlatform: 'unknown',
      screenSize: '1920x1080',
    };
  }

  const userAgent = navigator.userAgent || '';
  const platform = (navigator as any).userAgentData?.platform || navigator.platform || '';
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const isTouch = maxTouchPoints > 0;
  const screenWidth = typeof window.innerWidth !== 'undefined' ? window.innerWidth : 1200;
  const screenHeight = typeof window.innerHeight !== 'undefined' ? window.innerHeight : 800;
  const screenSize = `${screenWidth}x${screenHeight}`;

  // 1. Android Detection
  const isAndroid = /android/i.test(userAgent) || /android/i.test(platform);
  if (isAndroid) {
    const isTablet = screenWidth >= 768 && screenWidth <= 1280;
    return {
      activeOS: 'android',
      detectedOSName: 'Android 16',
      deviceType: isTablet ? 'tablet' : 'mobile',
      isTouch: true,
      rawPlatform: platform || 'Android',
      screenSize,
    };
  }

  // 2. Apple / macOS / iOS Detection
  const isApple = 
    /macintosh|mac os x|macintel/i.test(userAgent) || 
    /mac/i.test(platform) ||
    /iphone|ipad|ipod/i.test(userAgent) ||
    (platform === 'MacIntel' && maxTouchPoints > 1); // iPad Pro masquerading as Mac

  if (isApple) {
    const isIOS = /iphone|ipad|ipod/i.test(userAgent) || (platform === 'MacIntel' && maxTouchPoints > 1);
    return {
      activeOS: 'macos',
      detectedOSName: isIOS ? 'Apple iOS' : 'macOS 27',
      deviceType: isIOS ? (screenWidth >= 768 ? 'tablet' : 'mobile') : 'desktop',
      isTouch: isTouch,
      rawPlatform: platform || 'macOS',
      screenSize,
    };
  }

  // 3. Windows Detection
  const isWindows = /windows|win32|win64/i.test(userAgent) || /win/i.test(platform);
  if (isWindows) {
    return {
      activeOS: 'windows',
      detectedOSName: 'Windows 12',
      deviceType: isTouch && screenWidth < 1024 ? 'tablet' : 'desktop',
      isTouch: isTouch,
      rawPlatform: platform || 'Windows',
      screenSize,
    };
  }

  // 4. Linux and others (ChromeOS, etc.)
  if (/linux/i.test(userAgent) || /linux/i.test(platform)) {
    if (isTouch && screenWidth < 768) {
      return {
        activeOS: 'android',
        detectedOSName: 'Linux Mobile (Android)',
        deviceType: 'mobile',
        isTouch: true,
        rawPlatform: platform || 'Linux',
        screenSize,
      };
    }
    return {
      activeOS: 'windows',
      detectedOSName: 'Linux Desktop',
      deviceType: 'desktop',
      isTouch: isTouch,
      rawPlatform: platform || 'Linux',
      screenSize,
    };
  }

  // Fallback
  return {
    activeOS: 'windows',
    detectedOSName: screenWidth < 768 ? 'Mobile OS' : 'Desktop OS',
    deviceType: screenWidth < 768 ? 'mobile' : 'desktop',
    isTouch: isTouch,
    rawPlatform: platform || 'Generic',
    screenSize,
  };
}

/**
 * Resolves the effective active OS theme given user preference ('auto' | 'macos' | 'windows' | 'android').
 */
export function getEffectiveOSType(preference: OSThemePreference = 'auto'): ActiveOSType {
  if (preference === 'macos') return 'macos';
  if (preference === 'windows') return 'windows';
  if (preference === 'android') return 'android';
  return detectOSInfo().activeOS;
}

export interface OSThemeTokens {
  name: string;
  conceptTag: string;
  rootClass: string;
  topBarClass: string;
  sidebarClass: string;
  contentBg: string;
  cardClass: string;
  buttonClass: string;
  accentClass: string;
  inputClass: string;
}

/**
 * Returns tailored CSS classes for each OS theme and dark/light mode
 */
export function getOSThemeTokens(os: ActiveOSType, theme: 'dark' | 'light'): OSThemeTokens {
  const isLight = theme === 'light';

  if (os === 'macos') {
    return {
      name: 'macOS 27',
      conceptTag: 'Liquid Glass',
      rootClass: isLight 
        ? 'bg-gradient-to-br from-[#f0f4f9] via-[#e5ecf5] to-[#f8fafc] text-slate-800' 
        : 'bg-gradient-to-br from-[#0c1017] via-[#101726] to-[#0a0e17] text-zinc-100',
      topBarClass: isLight
        ? 'bg-white/60 backdrop-blur-2xl border-b border-black/10 shadow-[0_2px_15px_rgba(0,0,0,0.03)] text-slate-800'
        : 'bg-[#141b2b]/60 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.4)] text-zinc-100',
      sidebarClass: isLight
        ? 'bg-white/70 backdrop-blur-2xl border-r border-black/10 shadow-[2px_0_20px_rgba(0,0,0,0.03)] text-slate-800'
        : 'bg-[#121824]/70 backdrop-blur-2xl border-r border-white/10 shadow-[2px_0_25px_rgba(0,0,0,0.5)] text-zinc-100',
      contentBg: isLight ? 'bg-transparent' : 'bg-transparent',
      cardClass: isLight
        ? 'bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl'
        : 'bg-[#151d2e]/70 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl',
      buttonClass: isLight
        ? 'bg-white/80 hover:bg-white text-slate-800 border border-black/10 shadow-sm active:scale-95'
        : 'bg-white/10 hover:bg-white/15 text-zinc-100 border border-white/15 shadow-sm active:scale-95',
      accentClass: isLight
        ? 'bg-blue-600 text-white shadow-blue-500/25'
        : 'bg-blue-500/30 text-blue-300 border border-blue-400/40 shadow-[0_0_20px_rgba(59,130,246,0.3)]',
      inputClass: isLight
        ? 'bg-white/80 border-black/15 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
        : 'bg-black/40 border-white/15 text-zinc-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20',
    };
  }

  if (os === 'android') {
    return {
      name: 'Android 16',
      conceptTag: 'Material You Expressive',
      rootClass: isLight 
        ? 'bg-[#f4f7f6] text-slate-800' 
        : 'bg-[#0f141c] text-zinc-100',
      topBarClass: isLight
        ? 'bg-[#e7eeea] border-b border-[#d0ded5] text-slate-800'
        : 'bg-[#18202c] border-b border-[#253245] text-zinc-100',
      sidebarClass: isLight
        ? 'bg-[#eef3f0] border-r border-[#d4e0d9] text-slate-800'
        : 'bg-[#141b25] border-r border-[#222c3c] text-zinc-100',
      contentBg: isLight ? 'bg-[#f4f7f6]' : 'bg-[#0f141c]',
      cardClass: isLight
        ? 'bg-[#e2ebe6] border border-[#d2ded7] shadow-sm rounded-[24px]'
        : 'bg-[#1a2332] border border-[#26354a] shadow-sm rounded-[24px]',
      buttonClass: isLight
        ? 'bg-[#d8e5df] hover:bg-[#c9dbd3] text-emerald-950 font-medium rounded-full active:scale-95'
        : 'bg-[#223043] hover:bg-[#2c3d55] text-emerald-300 font-medium rounded-full active:scale-95',
      accentClass: isLight
        ? 'bg-emerald-600 text-white font-medium rounded-full'
        : 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-medium rounded-full',
      inputClass: isLight
        ? 'bg-[#e7eeea] border-[#cbd8d1] text-slate-900 rounded-[20px] focus:border-emerald-600'
        : 'bg-[#131922] border-[#2c394d] text-zinc-100 rounded-[20px] focus:border-emerald-400',
    };
  }

  // Windows 12 Fluent Design (default)
  return {
    name: 'Windows 12',
    conceptTag: 'Fluent Mica',
    rootClass: isLight 
      ? 'bg-[#f3f5f8] text-slate-800' 
      : 'bg-[#070b13] text-zinc-100',
    topBarClass: isLight
      ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200 text-slate-800'
      : 'bg-[#0a0f1c]/90 backdrop-blur-xl border-b border-cyan-900/30 text-zinc-100',
    sidebarClass: isLight
      ? 'bg-white/95 backdrop-blur-xl border-r border-slate-200 text-slate-800'
      : 'bg-[#090e1a]/95 backdrop-blur-xl border-r border-cyan-900/30 text-zinc-100',
    contentBg: isLight ? 'bg-[#f3f5f8]' : 'bg-[#070b13]',
    cardClass: isLight
      ? 'bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm rounded-xl'
      : 'bg-[#0d1424]/90 backdrop-blur-md border border-cyan-900/40 shadow-[0_0_20px_rgba(0,240,255,0.05)] rounded-xl',
    buttonClass: isLight
      ? 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-sm rounded-lg active:scale-95'
      : 'bg-zinc-900/90 hover:bg-cyan-950/60 text-zinc-200 border border-cyan-900/40 shadow-sm rounded-lg active:scale-95',
    accentClass: isLight
      ? 'bg-cyan-600 text-white rounded-lg shadow-sm'
      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.2)]',
    inputClass: isLight
      ? 'bg-white border-slate-300 text-slate-900 rounded-lg focus:border-cyan-500'
      : 'bg-black/50 border-cyan-900/50 text-cyan-200 rounded-lg focus:border-cyan-400',
  };
}

export function getThemeTokens(os: ActiveOSType | OSThemePreference = 'windows', theme: 'dark' | 'light' = 'dark') {
  const effective = getEffectiveOSType(os as OSThemePreference);
  const isLight = theme === 'light';
  return {
    effective,
    isLight,
    cardBg: isLight ? 'bg-white/80 backdrop-blur-xl' : 'bg-slate-900/60 backdrop-blur-xl',
    cardBorder: isLight ? 'border border-slate-200' : 'border border-white/10',
    textPrimary: isLight ? 'text-slate-900' : 'text-zinc-100',
    textSecondary: isLight ? 'text-slate-600' : 'text-zinc-400',
  };
}

