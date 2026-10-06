import { CommandExecutionResult, LocalCommandDefinition, SupportedLanguage, WindowsAppId } from '../types';
import { normalizeLang } from '../utils/i18n';
import { LocalAgentBridge } from '../services/localAgentBridge';

export const APPLICATION_COMMANDS_META: LocalCommandDefinition[] = [
  {
    id: 'app_calculator',
    name: 'Calculator (Kalkulyator)',
    category: 'applications',
    pluginId: 'system_plugin',
    keywords: [
      'calculator', 'kalkulyator', 'calc', 'open calculator', 'open calc',
      'calculator och', 'calculatorni och', 'kalkulyator och', 'kalkulyatorni och',
      'och calculator', 'och kalkulyator', 'kalkulyatorni ishga tushir',
      'калькулятор', 'открыть калькулятор', 'запустить калькулятор'
    ],
    description: 'Windows kalkulyator dasturini ishga tushiradi (calc.exe).',
    example: 'open calculator',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_clock',
    name: 'Clock (Soat va Taymer)',
    category: 'applications',
    pluginId: 'system_plugin',
    keywords: [
      'clock', 'soat', 'budilnik', 'alarms', 'open clock',
      'clock och', 'clockni och', 'soat och', 'soatni och', 'och clock', 'och soat',
      'soatni ishga tushir', 'часы', 'открыть часы', 'будильник', 'таймер', 'запустить часы'
    ],
    description: 'Windows soat, taymer va budilnik dasturini ishga tushiradi (ms-clock:).',
    example: 'open clock',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_cmd',
    name: 'CMD / Terminal (Buyruqlar Satri)',
    category: 'applications',
    pluginId: 'windows_plugin',
    keywords: [
      'cmd', 'terminal', 'command prompt', 'powershell', 'open cmd', 'open terminal',
      'cmd och', 'cmdni och', 'terminal och', 'terminalni och', 'och cmd', 'och terminal',
      'командная строка', 'открыть cmd', 'открыть терминал', 'открыть командную строку', 'запустить cmd'
    ],
    description: 'Windows buyruqlar satri (Command Prompt / CMD) darchasini ochadi (cmd.exe).',
    example: 'open cmd',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_notepad',
    name: 'Notepad (Bloknot)',
    category: 'applications',
    pluginId: 'file_plugin',
    keywords: [
      'notepad', 'bloknot', 'matn muharriri', 'daftar', 'open notepad',
      'notepad och', 'notepadni och', 'bloknot och', 'bloknotni och', 'och notepad', 'och bloknot',
      'блокнот', 'открыть блокнот', 'запустить блокнот'
    ],
    description: 'Windows Notepad (Bloknot) matn muharririni ishga tushiradi (notepad.exe).',
    example: 'open notepad',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_paint',
    name: 'MS Paint (Rasm chizish)',
    category: 'applications',
    pluginId: 'system_plugin',
    keywords: [
      'paint', 'ms paint', 'mspaint', 'rasm chizish', 'open paint',
      'paint och', 'paintni och', 'och paint', 'mspaint och',
      'паинт', 'открыть paint', 'запустить paint', 'рисование'
    ],
    description: 'Windows Paint grafik muharririni ishga tushiradi (mspaint.exe).',
    example: 'open paint',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_explorer',
    name: 'File Explorer (Fayl Menejeri)',
    category: 'applications',
    pluginId: 'windows_plugin',
    keywords: [
      'file explorer', 'explorer', 'fayl menejeri', 'fayllar', 'open file explorer', 'open explorer',
      'explorer och', 'explorerni och', 'fayl menejerini och', 'och explorer', 'och file explorer',
      'проводник', 'открыть проводник', 'открыть файлы', 'запустить проводник'
    ],
    description: 'Windows File Explorer fayl menejeri darchasini ochadi (explorer.exe).',
    example: 'open file explorer',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_taskmgr',
    name: 'Task Manager (Vazifalar Menejeri)',
    category: 'applications',
    pluginId: 'windows_plugin',
    keywords: [
      'task manager', 'taskmgr', 'vazifalar menejeri', 'dispetcher', 'dispetcher zadach', 'open task manager', 'open taskmgr',
      'task manager och', 'task managerni och', 'taskmgr och', 'dispetcher och', 'vazifalar menejerini och',
      'диспетчер задач', 'открыть диспетчер задач', 'запустить диспетчер задач'
    ],
    description: 'Windows Task Manager (Vazifalar dispetcheri) darchasini ochadi (taskmgr.exe).',
    example: 'open task manager',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_settings',
    name: 'Settings (Windows Sozlamalari)',
    category: 'applications',
    pluginId: 'windows_plugin',
    keywords: [
      'settings', 'sozlamalar', 'windows sozlamalari', 'parametrlar', 'windows settings', 'open settings',
      'settings och', 'sozlamalarni och', 'sozlamalar och', 'och settings',
      'настройки', 'параметры', 'открыть настройки', 'открыть параметры'
    ],
    description: 'Windows tizim sozlamalari (Settings) oynasini ochadi (ms-settings:).',
    example: 'open settings',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_browser',
    name: 'Browser (Internet Brauzeri)',
    category: 'applications',
    pluginId: 'browser_plugin',
    keywords: [
      'browser', 'brauzer', 'chrome', 'google chrome', 'open browser', 'open chrome',
      'browser och', 'brauzerni och', 'brauzer och', 'chrome och', 'chromeni och', 'och browser', 'och chrome',
      'браузер', 'хром', 'открыть браузер', 'запустить браузер', 'открыть хром'
    ],
    description: 'Lokal kompyuterda internet brauzerini ishga tushiradi.',
    example: 'open browser',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_control',
    name: 'Control Panel (Boshqaruv Paneli)',
    category: 'applications',
    pluginId: 'windows_plugin',
    keywords: [
      'control panel', 'boshqaruv paneli', 'control', 'open control panel', 'open control',
      'control panel och', 'boshqaruv panelini och', 'boshqaruv paneli och', 'och control panel',
      'панель управления', 'открыть панель управления', 'запустить панель управления'
    ],
    description: 'Windows klassik boshqaruv panelini (Control Panel) ochadi (control.exe).',
    example: 'open control panel',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_calendar',
    name: 'Calendar (Windows Kalendari)',
    category: 'applications',
    pluginId: 'system_plugin',
    keywords: [
      'calendar', 'kalendar', 'taqvim', 'open calendar',
      'calendar och', 'kalendarni och', 'kalendar och', 'taqvim och', 'och calendar', 'och kalendar',
      'календарь', 'открыть календарь', 'запустить календарь'
    ],
    description: 'Windows kalendar va rejalashtiruvchi dasturini ochadi (outlookcal:).',
    example: 'open calendar',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_vscode',
    name: 'VS Code',
    category: 'applications',
    pluginId: 'automation_plugin',
    keywords: ['vscode', 'vs code', 'code och', 'visual studio code', 'vscode och', 'vscodeni och', 'open vscode'],
    description: 'Visual Studio Code dasturchilar muhitini ishga tushiradi.',
    example: 'open vscode',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_word',
    name: 'Microsoft Word',
    category: 'applications',
    pluginId: 'file_plugin',
    keywords: ['word', 'ms word', 'microsoft word', 'word och', 'wordni och', 'open word'],
    description: 'Microsoft Word matn protsessorini ishga tushiradi.',
    example: 'open word',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_excel',
    name: 'Microsoft Excel',
    category: 'applications',
    pluginId: 'file_plugin',
    keywords: ['excel', 'ms excel', 'microsoft excel', 'excel och', 'excelni och', 'open excel'],
    description: 'Microsoft Excel elektron jadval dasturini ishga tushiradi.',
    example: 'open excel',
    requiresPermission: 'application_launch',
  },
];

export async function executeApplicationCommand(
  commandId: string, 
  langInput?: string
): Promise<CommandExecutionResult> {
  const lang: SupportedLanguage = normalizeLang(langInput);

  switch (commandId) {
    case 'app_calculator': {
      await LocalAgentBridge.launchApp('calculator');

      const msg = lang === 'en'
        ? '🔢 Done, sir! Windows Calculator has been launched on your computer.'
        : lang === 'ru'
        ? '🔢 Выполнено, сэр! Приложение «Калькулятор Windows» успешно запущено.'
        : '🔢 Bajarildi, ser! Windows Kalkulyator dasturi kompyuteringizda ishga tushirildi.';

      return {
        success: true,
        message: msg,
        details: 'Executable: C:\\Windows\\System32\\calc.exe\nProtocol: calculator:\nStatus: Process active',
        windowsCommand: 'start calc.exe',
        openedApp: 'calculator',
        isRealWindows: true,
      };
    }

    case 'app_clock': {
      await LocalAgentBridge.launchApp('clock');

      const msg = lang === 'en'
        ? '⏰ Done, sir! Windows Clock & Alarms has been launched.'
        : lang === 'ru'
        ? '⏰ Выполнено, сэр! Приложение «Часы и Таймер Windows» запущено.'
        : '⏰ Bajarildi, ser! Windows Soat va Budilnik dasturi kompyuteringizda ishga tushirildi.';

      return {
        success: true,
        message: msg,
        details: 'Protocol: ms-clock:\nExecutable: timedate.cpl\nStatus: Window active',
        windowsCommand: 'start ms-clock:',
        openedApp: 'clock',
        isRealWindows: true,
      };
    }

    case 'app_cmd':
    case 'app_terminal': {
      await LocalAgentBridge.launchApp('cmd');

      const msg = lang === 'en'
        ? '⚡ Done, sir! Windows Command Prompt (CMD) terminal has been opened on your PC.'
        : lang === 'ru'
        ? '⚡ Выполнено, сэр! Командная строка Windows (CMD) запущена на вашем ПК.'
        : '⚡ Bajarildi, ser! Haqiqiy Windows Command Prompt (CMD) terminali ishga tushirildi.';

      return {
        success: true,
        message: msg,
        details: 'Executable: C:\\Windows\\System32\\cmd.exe\nShell: Windows NT Command Shell (Win32 Console)',
        windowsCommand: 'start cmd.exe /k "title Windows Command Prompt (CMD)"',
        openedApp: 'cmd',
        isRealWindows: true,
      };
    }

    case 'app_notepad': {
      await LocalAgentBridge.launchApp('notepad');

      const msg = lang === 'en'
        ? '📝 Done, sir! Windows Notepad text editor has been launched on your PC.'
        : lang === 'ru'
        ? '📝 Выполнено, сэр! Текстовый редактор «Блокнот Windows» запущен на вашем ПК.'
        : '📝 Bajarildi, ser! Haqiqiy Windows Notepad (Bloknot) matn muharriri ishga tushirildi.';

      return {
        success: true,
        message: msg,
        details: 'Executable: C:\\Windows\\System32\\notepad.exe\nStatus: Process active',
        windowsCommand: 'start notepad.exe',
        openedApp: 'notepad',
        isRealWindows: true,
      };
    }

    case 'app_paint': {
      await LocalAgentBridge.launchApp('paint');

      const msg = lang === 'en'
        ? '🎨 Done, sir! Microsoft Paint graphics editor has been opened on your PC.'
        : lang === 'ru'
        ? '🎨 Выполнено, сэр! Графический редактор «Paint» запущен на вашем ПК.'
        : '🎨 Bajarildi, ser! Haqiqiy Microsoft Paint grafik muharriri ishga tushirildi.';

      return {
        success: true,
        message: msg,
        details: 'Executable: C:\\Windows\\System32\\mspaint.exe\nStatus: Graphics workspace ready',
        windowsCommand: 'start mspaint.exe',
        openedApp: 'paint',
        isRealWindows: true,
      };
    }

    case 'app_explorer': {
      await LocalAgentBridge.launchApp('explorer');

      const msg = lang === 'en'
        ? '📁 Done, sir! Windows File Explorer has been opened.'
        : lang === 'ru'
        ? '📁 Выполнено, сэр! Проводник Windows (File Explorer) запущен.'
        : '📁 Bajarildi, ser! Haqiqiy Windows File Explorer fayl menejeri ochildi.';

      return {
        success: true,
        message: msg,
        details: 'Executable: C:\\Windows\\explorer.exe\nStatus: Local filesystem browsing active',
        windowsCommand: 'start explorer.exe',
        openedApp: 'explorer',
        isRealWindows: true,
      };
    }

    case 'app_taskmgr': {
      await LocalAgentBridge.launchApp('taskmgr');

      const msg = lang === 'en'
        ? '📊 Done, sir! Windows Task Manager has been launched on your PC.'
        : lang === 'ru'
        ? '📊 Выполнено, сэр! «Диспетчер задач Windows» запущен на вашем ПК.'
        : '📊 Bajarildi, ser! Haqiqiy Windows Task Manager (Vazifalar menejeri) ochildi.';

      return {
        success: true,
        message: msg,
        details: 'Executable: C:\\Windows\\System32\\taskmgr.exe\nStatus: Process & resource monitor active',
        windowsCommand: 'start taskmgr.exe',
        openedApp: 'taskmgr',
        isRealWindows: true,
      };
    }

    case 'app_settings': {
      await LocalAgentBridge.launchApp('settings');

      const msg = lang === 'en'
        ? '⚙️ Done, sir! Windows Operating System Settings has been opened.'
        : lang === 'ru'
        ? '⚙️ Выполнено, сэр! Параметры операционной системы Windows запущены.'
        : '⚙️ Bajarildi, ser! Windows tizim sozlamalari (Settings) ochildi.';

      return {
        success: true,
        message: msg,
        details: 'Protocol: ms-settings:\nStatus: Windows 10/11 Settings launched',
        windowsCommand: 'start ms-settings:',
        openedApp: 'settings',
        isRealWindows: true,
      };
    }

    case 'app_browser':
    case 'app_chrome': {
      await LocalAgentBridge.launchApp('browser');

      const msg = lang === 'en'
        ? '🚀 Done, sir! Web Browser has been launched.'
        : lang === 'ru'
        ? '🚀 Выполнено, сэр! Браузер запущен на локальном компьютере.'
        : '🚀 Bajarildi, ser! Internet brauzeri ishga tushirildi.';

      return {
        success: true,
        message: msg,
        details: 'Executable: chrome.exe / msedge.exe\nURL: https://www.google.com\nStatus: Browser active',
        windowsCommand: 'start https://www.google.com',
        openedApp: 'browser',
        isRealWindows: true,
      };
    }

    case 'app_control': {
      await LocalAgentBridge.launchApp('control');

      const msg = lang === 'en'
        ? '🎛️ Done, sir! Windows Control Panel has been launched on your PC.'
        : lang === 'ru'
        ? '🎛️ Выполнено, сэр! «Панель управления Windows» открыта на вашем ПК.'
        : '🎛️ Bajarildi, ser! Haqiqiy Windows Boshqaruv Paneli (Control Panel) ochildi.';

      return {
        success: true,
        message: msg,
        details: 'Executable: C:\\Windows\\System32\\control.exe\nStatus: Control applets ready',
        windowsCommand: 'start control.exe',
        openedApp: 'control',
        isRealWindows: true,
      };
    }

    case 'app_calendar': {
      await LocalAgentBridge.launchApp('calendar');

      const msg = lang === 'en'
        ? '📅 Done, sir! Windows Calendar & Schedule has been opened.'
        : lang === 'ru'
        ? '📅 Выполнено, сэр! Календарь Windows запущен.'
        : '📅 Bajarildi, ser! Windows Kalendar dasturi ochildi.';

      return {
        success: true,
        message: msg,
        details: 'Protocol: outlookcal:\nStatus: Calendar & Agenda active',
        windowsCommand: 'start outlookcal:',
        openedApp: 'calendar',
        isRealWindows: true,
      };
    }

    case 'app_vscode': {
      try {
        window.location.href = 'vscode:';
      } catch (e) {}

      const msg = lang === 'en'
        ? '💻 Done, sir! Visual Studio Code workspace has been opened.'
        : lang === 'ru'
        ? '💻 Выполнено, сэр! Visual Studio Code запущен.'
        : '💻 Bajarildi, ser! Visual Studio Code ishchi muhiti ochildi.';

      return {
        success: true,
        message: msg,
        details: 'Executable: Code.exe\nProtocol: vscode:\nStatus: Editor active',
        windowsCommand: 'code .',
        isRealWindows: true,
      };
    }

    case 'app_word': {
      await LocalAgentBridge.launchApp('winword');

      const msg = lang === 'en'
        ? '📄 Done, sir! Microsoft Word has been launched.'
        : lang === 'ru'
        ? '📄 Выполнено, сэр! Microsoft Word запущен.'
        : '📄 Bajarildi, ser! Microsoft Word dasturi ishga tushirildi.';

      return {
        success: true,
        message: msg,
        details: 'Executable: WINWORD.EXE\nOffice Suite: Active',
        windowsCommand: 'start winword.exe',
        isRealWindows: true,
      };
    }

    case 'app_excel': {
      await LocalAgentBridge.launchApp('excel');

      const msg = lang === 'en'
        ? '📊 Done, sir! Microsoft Excel has been launched.'
        : lang === 'ru'
        ? '📊 Выполнено, сэр! Microsoft Excel запущен.'
        : '📊 Bajarildi, ser! Microsoft Excel dasturi ishga tushirildi.';

      return {
        success: true,
        message: msg,
        details: 'Executable: EXCEL.EXE\nSpreadsheets: Active',
        windowsCommand: 'start excel.exe',
        isRealWindows: true,
      };
    }

    default: {
      if (commandId.startsWith('app_close_')) {
        const appId = commandId.replace('app_close_', '') as WindowsAppId;
        return await executeCloseApplication(appId, lang);
      }

      return {
        success: false,
        message: lang === 'en' 
          ? '❌ Unknown application command.' 
          : lang === 'ru'
          ? '❌ Неизвестная команда приложения.'
          : '❌ Noma\'lum dastur buyrug‘i.',
      };
    }
  }
}

export async function executeCloseApplication(
  appId: WindowsAppId,
  lang: SupportedLanguage
): Promise<CommandExecutionResult> {
  const procMap: Record<WindowsAppId, { proc: string; nameUz: string; nameEn: string; nameRu: string }> = {
    calculator: { proc: 'calc.exe', nameUz: 'Kalkulyator', nameEn: 'Calculator', nameRu: 'Калькулятор' },
    clock: { proc: 'Time.exe', nameUz: 'Soat va Taymer', nameEn: 'Clock & Timer', nameRu: 'Часы' },
    cmd: { proc: 'cmd.exe', nameUz: 'CMD Terminal', nameEn: 'Command Prompt (CMD)', nameRu: 'Командная строка' },
    notepad: { proc: 'notepad.exe', nameUz: 'Notepad (Bloknot)', nameEn: 'Notepad', nameRu: 'Блокнот' },
    paint: { proc: 'mspaint.exe', nameUz: 'MS Paint', nameEn: 'MS Paint', nameRu: 'Paint' },
    explorer: { proc: 'explorer.exe', nameUz: 'File Explorer', nameEn: 'File Explorer', nameRu: 'Проводник' },
    taskmgr: { proc: 'taskmgr.exe', nameUz: 'Task Manager', nameEn: 'Task Manager', nameRu: 'Диспетчер задач' },
    settings: { proc: 'SystemSettings.exe', nameUz: 'Windows Sozlamalari', nameEn: 'Windows Settings', nameRu: 'Параметры' },
    browser: { proc: 'chrome.exe', nameUz: 'Brauzer', nameEn: 'Browser', nameRu: 'Браузер' },
    control: { proc: 'control.exe', nameUz: 'Boshqaruv Paneli', nameEn: 'Control Panel', nameRu: 'Панель управления' },
    calendar: { proc: 'HxCalendarAppImm.exe', nameUz: 'Kalendar', nameEn: 'Calendar', nameRu: 'Календарь' },
  };

  const item = procMap[appId] || { proc: `${appId}.exe`, nameUz: appId, nameEn: appId, nameRu: appId };
  const cmd = `taskkill /f /im ${item.proc}`;
  await LocalAgentBridge.executeCommand(cmd);

  const msg = lang === 'en'
    ? `🛑 Done, sir! ${item.nameEn} has been closed.`
    : lang === 'ru'
    ? `🛑 Выполнено, сэр! Приложение «${item.nameRu}» закрыто.`
    : `🛑 Bajarildi, ser! ${item.nameUz} ilovasi yopildi.`;

  return {
    success: true,
    message: msg,
    details: `Process terminated: ${item.proc}\nStatus: Window closed`,
    windowsCommand: cmd,
    closedApp: appId,
  };
}
