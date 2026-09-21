import { SafeAction, ExecutionResult, AgentStatusInfo, ApprovedLocation } from '../types';

const LOCAL_AGENT_URL = 'http://127.0.0.1:8765';

/**
 * Checks connection to local Windows agent on 127.0.0.1:8765
 */
export async function checkLocalAgentStatus(): Promise<AgentStatusInfo | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const res = await fetch(`${LOCAL_AGENT_URL}/status`, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const isDarwin = data.platform === 'darwin';
      return {
        connected: true,
        url: LOCAL_AGENT_URL,
        username: data.username || (isDarwin ? 'Mac Foydalanuvchisi' : 'Windows Foydalanuvchisi'),
        hostname: data.hostname || (isDarwin ? 'Mac' : 'PC'),
        platform: data.platform || (isDarwin ? 'darwin' : 'win32'),
        platformName: data.platformName || (isDarwin ? 'macOS' : (data.platform === 'win32' ? 'Windows' : 'Linux')),
        homeDir: data.homeDir,
        version: data.version || '1.2.0',
        allowedPaths: data.allowedPaths || {},
        lastChecked: Date.now(),
      };
    }
  } catch {
    // Agent offline or network blocked
  }
  return null;
}

/**
 * Executes a safe action:
 * - If Local Windows Agent is connected: performs REAL Windows action on 127.0.0.1:8765!
 * - If offline: executes via sandbox fallback so user can preview/test in web browser.
 */
export async function executeSafeAction(
  action: SafeAction,
  isAgentOnline: boolean,
  allowedLocations: Record<ApprovedLocation, boolean>
): Promise<ExecutionResult> {
  // 0. Website and Web App launch handling
  if (action.action === 'open_website') {
    if (isAgentOnline) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(`${LOCAL_AGENT_URL}/execute`, {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action),
        });
        clearTimeout(timeoutId);
        const data = await res.json();
        return {
          success: true,
          message: data.message || `🌐 ${action.title} brauzerda ochildi: ${action.url}`,
          webLink: {
            title: action.title,
            url: action.url,
            iconType: action.iconType,
          },
          isRealWindows: true,
        };
      } catch (err: any) {
        console.warn('Local agent sayt ochishda uzilish:', err.message);
      }
    }

    return {
      success: true,
      message: `🌐 ${action.title} ochilmoqda: ${action.url}`,
      webLink: {
        title: action.title,
        url: action.url,
        iconType: action.iconType,
      },
      isRealWindows: false,
    };
  }

  // Handle open download modal
  if (action.action === 'open_download_modal') {
    return {
      success: true,
      message: `📥 JARVIS dasturini yuklab olish oynasi ochildi. Windows (.exe), macOS va Android uchun variantlar mavjud.`,
      isRealWindows: false,
    };
  }

  // Handle conversational chat reply
  if (action.action === 'chat_reply') {
    return {
      success: true,
      message: action.reply,
      isRealWindows: false,
    };
  }

  // Handle clear screen action
  if (action.action === 'clear_screen') {
    return {
      success: true,
      message: "Ekranni tozaladim. Yangi buyruq berishingiz mumkin.",
      isRealWindows: false,
    };
  }

  // 1. Check user permission
  if (!allowedLocations[action.location]) {
    const locNames: Record<ApprovedLocation, string> = {
      Desktop: 'Ish stoli',
      Downloads: 'Yuklamalar',
      Documents: 'Hujjatlar',
      Pictures: 'Rasmlar',
      Videos: 'Videolar',
    };
    return {
      success: false,
      message: `❌ Ruxsat yo'q: "${locNames[action.location]}" papkasiga JARVIS ruxsatlarida ruxsat berilmagan.`,
      details: 'Iltimos, yuqoridagi "Ruxsatlar" bo\'limidan ushbu papkaga ruxsat bering.',
      isRealWindows: false,
    };
  }

  // 2. If Real Local Agent is online, call it
  if (isAgentOnline) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(`${LOCAL_AGENT_URL}/execute`, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      return {
        success: data.success,
        message: data.message,
        details: data.error,
        items: data.items,
        path: data.path,
        isRealWindows: true,
      };
    } catch (err: any) {
      console.warn('Local agent bilan aloqada uzilish:', err.message);
      // Fallback to server sandbox if local agent suddenly went offline
    }
  }

  // 3. Fallback: server virtual sandbox
  try {
    const res = await fetch('/api/sandbox/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action),
    });
    const data = await res.json();
    return {
      success: data.success,
      message: data.message,
      details: data.error,
      items: data.items,
      path: data.path,
      isRealWindows: false,
      createdFile: data.createdFile || (action.action === 'create_file' ? {
        name: action.name,
        content: action.content,
        location: action.location,
      } : undefined),
    };
  } catch (err: any) {
    return {
      success: false,
      message: `❌ Buyruqni bajarishda xatolik yuz berdi: ${err.message}`,
      isRealWindows: false,
    };
  }
}

/**
 * Optional AI fallback parser call to server
 */
export async function parseWithAI(prompt: string) {
  try {
    const res = await fetch('/api/ai-parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('AI parser bilan bog\'lanib bo\'lmadi:', err);
  }
  return { recognized: false };
}
