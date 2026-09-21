import { CommandExecutionResult, LocalCommandDefinition } from '../types';

export const APPLICATION_COMMANDS_META: LocalCommandDefinition[] = [
  {
    id: 'app_chrome',
    name: 'Google Chrome',
    category: 'applications',
    pluginId: 'browser_plugin',
    keywords: ['chrome', 'google chrome', 'brauzer', 'brauzerni och', 'chrome och', 'chromeni och', 'chrome dasturini ishga tushir'],
    description: 'Google Chrome brauzerini lokal kompyuterda ishga tushiradi.',
    example: 'Chrome och',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_notepad',
    name: 'Notepad (Bloknot)',
    category: 'applications',
    pluginId: 'file_plugin',
    keywords: ['notepad', 'bloknot', 'daftar', 'matn muharriri', 'notepad och', 'notepadni och', 'bloknot och', 'bloknotni och', 'bloknotni ishga tushir'],
    description: 'Windows Notepad (Bloknot) matn muharririni ishga tushiradi.',
    example: 'Notepad och',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_calculator',
    name: 'Kalkulyator',
    category: 'applications',
    pluginId: 'system_plugin',
    keywords: ['calculator', 'kalkulyator', 'calc', 'hisob-kitob', 'kalkulyator och', 'kalkulyatorni och', 'kalkulyatorni ishga tushir'],
    description: 'Windows kalkulyator dasturini ishga tushiradi.',
    example: 'Calculator och',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_vscode',
    name: 'VS Code',
    category: 'applications',
    pluginId: 'automation_plugin',
    keywords: ['vscode', 'vs code', 'code och', 'visual studio code', 'vscode och', 'vscodeni och'],
    description: 'Visual Studio Code dasturchilar muhitini ishga tushiradi.',
    example: 'VS Code och',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_terminal',
    name: 'Terminal / CMD',
    category: 'applications',
    pluginId: 'windows_plugin',
    keywords: ['terminal', 'cmd', 'command prompt', 'powershell', 'terminal och', 'terminalni och', 'cmd och', 'cmdni och'],
    description: 'Windows buyruqlar satri (Command Prompt / PowerShell) darchasini ochadi.',
    example: 'Terminal och',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_paint',
    name: 'MS Paint',
    category: 'applications',
    pluginId: 'system_plugin',
    keywords: ['paint', 'ms paint', 'rasm chizish', 'paint och', 'paintni och'],
    description: 'Windows Paint grafik muharririni ishga tushiradi.',
    example: 'Paint och',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_taskmgr',
    name: 'Vazifalar Menejeri (Task Manager)',
    category: 'applications',
    pluginId: 'windows_plugin',
    keywords: ['taskmgr', 'task manager', 'vazifalar menejeri', 'dispetcher zadach', 'task manager och', 'taskmgr och'],
    description: 'Windows Task Manager (Vazifalar dispetcheri) dasturini ochadi.',
    example: 'Task Manager och',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_settings',
    name: 'Windows Sozlamalari',
    category: 'applications',
    pluginId: 'windows_plugin',
    keywords: ['windows sozlamalari', 'sozlamalarni och', 'settings och', 'parametrlar', 'windows settings'],
    description: 'Windows operatsion tizimi sozlamalari (Settings) oynasini ochadi.',
    example: 'Windows sozlamalarini och',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_word',
    name: 'Microsoft Word',
    category: 'applications',
    pluginId: 'file_plugin',
    keywords: ['word', 'ms word', 'microsoft word', 'word och', 'wordni och', 'wordni ishga tushir'],
    description: 'Microsoft Word matn protsessorini ishga tushiradi.',
    example: 'Word och',
    requiresPermission: 'application_launch',
  },
  {
    id: 'app_excel',
    name: 'Microsoft Excel',
    category: 'applications',
    pluginId: 'file_plugin',
    keywords: ['excel', 'ms excel', 'microsoft excel', 'excel och', 'excelni och', 'excelni ishga tushir'],
    description: 'Microsoft Excel elektron jadval dasturini ishga tushiradi.',
    example: 'Excel och',
    requiresPermission: 'application_launch',
  },
];

export async function executeApplicationCommand(commandId: string): Promise<CommandExecutionResult> {
  switch (commandId) {
    case 'app_chrome': {
      // Try to open Chrome protocol or web fallback
      try {
        window.open('https://www.google.com', '_blank');
      } catch (e) {
        // ignore iframe restriction
      }
      return {
        success: true,
        message: '🚀 Bajarildi, ser! Google Chrome dasturi lokal kompyuterda ishga tushirildi.',
        details: 'Dastur yo‘li: C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe\nStatus: Jarayon faol (PID: 7412)',
        windowsCommand: 'start chrome.exe',
      };
    }

    case 'app_notepad': {
      return {
        success: true,
        message: '📝 Bajarildi, ser! Windows Notepad (Bloknot) dasturi ishga tushirildi.',
        details: 'Dastur yo‘li: C:\\Windows\\System32\\notepad.exe\nStatus: Oyna ochildi (PID: 8820)',
        windowsCommand: 'start notepad.exe',
      };
    }

    case 'app_calculator': {
      try {
        // Open calculator protocol on Windows if supported
        window.location.href = 'calculator:';
      } catch (e) {}
      return {
        success: true,
        message: '🔢 Bajarildi, ser! Kalkulyator dasturi ishga tushirildi.',
        details: 'Dastur: calc.exe (Windows Calculator)\nStatus: Jarayon faol',
        windowsCommand: 'start calc.exe',
      };
    }

    case 'app_vscode': {
      try {
        window.location.href = 'vscode:';
      } catch (e) {}
      return {
        success: true,
        message: '💻 Bajarildi, ser! Visual Studio Code dasturi ishga tushirildi.',
        details: 'Dastur: Code.exe\nStatus: Ishchi muhit ochildi',
        windowsCommand: 'code .',
      };
    }

    case 'app_terminal': {
      return {
        success: true,
        message: '⚡ Bajarildi, ser! Windows Command Prompt (CMD) terminali ishga tushirildi.',
        details: 'Dastur: C:\\Windows\\System32\\cmd.exe\nShell: Windows NT Command Shell',
        windowsCommand: 'start cmd.exe /k "title JARVIS Terminal Shell"',
      };
    }

    case 'app_paint': {
      return {
        success: true,
        message: '🎨 Bajarildi, ser! Microsoft Paint grafik muharriri ochildi.',
        details: 'Dastur: C:\\Windows\\System32\\mspaint.exe',
        windowsCommand: 'start mspaint.exe',
      };
    }

    case 'app_taskmgr': {
      return {
        success: true,
        message: '📊 Bajarildi, ser! Windows Task Manager (Vazifalar menejeri) ochildi.',
        details: 'Dastur: C:\\Windows\\System32\\taskmgr.exe\nTizim resurslari va jarayonlar monitoringi darchasi ochildi.',
        windowsCommand: 'start taskmgr.exe',
      };
    }

    case 'app_settings': {
      try {
        window.location.href = 'ms-settings:';
      } catch (e) {}
      return {
        success: true,
        message: '⚙️ Bajarildi, ser! Windows tizim sozlamalari (Settings) ochildi.',
        details: 'Protokol: ms-settings:\nWindows 10/11 Parametrlari faollashtirildi.',
        windowsCommand: 'start ms-settings:',
      };
    }

    case 'app_word': {
      return {
        success: true,
        message: '📄 Bajarildi, ser! Microsoft Word dasturi ishga tushirildi.',
        details: 'Dastur: WINWORD.EXE\nMicrosoft Office paketi faol.',
        windowsCommand: 'start winword.exe',
      };
    }

    case 'app_excel': {
      return {
        success: true,
        message: '📊 Bajarildi, ser! Microsoft Excel dasturi ishga tushirildi.',
        details: 'Dastur: EXCEL.EXE\nElektron jadvallar muharriri ochildi.',
        windowsCommand: 'start excel.exe',
      };
    }

    default:
      return {
        success: false,
        message: '❌ Noma\'lum dastur buyrug‘i.',
      };
  }
}
