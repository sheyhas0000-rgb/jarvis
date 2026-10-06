import { ParseResult, ApprovedLocation } from '../types';
import { ALL_COMMANDS_META } from '../commands/commandRegistry';

export function normalizeInput(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’ʻʼ`]/g, "'")
    .replace(/o\s*[']/g, "o'")
    .replace(/g\s*[']/g, "g'")
    .replace(/[?!.,;:]+$/g, '') // remove trailing punctuation
    .replace(/^[?!.,;:]+/g, '') // remove leading punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractLocation(rawText: string): ApprovedLocation {
  const norm = normalizeInput(rawText);
  if (/(yuklama|downloads|download|zagruzki|загрузк)/i.test(norm)) return 'Downloads';
  if (/(hujjat|documents|document|dokument|документ)/i.test(norm)) return 'Documents';
  if (/(rasm|pictures|picture|foto|фото|изображен)/i.test(norm)) return 'Pictures';
  if (/(video|videos|rolik|видео)/i.test(norm)) return 'Videos';
  if (/(desktop|ish stoli|rabochiy|рабоч)/i.test(norm)) return 'Desktop';
  return 'Desktop';
}

export function parseLocalCommand(rawInput: string): ParseResult {
  const input = normalizeInput(rawInput);
  if (!input) {
    return { recognized: false, unrecognizedReason: 'Buyruq kiritilmadi / No command entered' };
  }

  // 1. Direct keyword match against registered ALL_COMMANDS_META
  for (const cmd of ALL_COMMANDS_META) {
    for (const kw of cmd.keywords) {
      const kwNorm = normalizeInput(kw);
      if (input === kwNorm || input.startsWith(kwNorm + ' ') || input.endsWith(' ' + kwNorm)) {
        const args: Record<string, any> = { raw: input };

        if (cmd.category === 'files' || cmd.id === 'win_open_folder') {
          args.location = extractLocation(input);
        }

        return {
          recognized: true,
          commandId: cmd.id,
          category: cmd.category,
          pluginId: cmd.pluginId,
          title: cmd.name,
          requiresConfirmation: cmd.dangerous,
          permissionType: cmd.requiresPermission,
          args,
        };
      }
    }
  }

  // 2. Multi-language Application Launch Pattern:
  // "open <app>", "launch <app>", "start <app>", "run <app>"
  // "<app> och", "<app>ni och", "och <app>", "<app> ishga tushir"
  // "открыть <app>", "запустить <app>", "включить <app>"
  const isAppOpenIntent = /^(?:open|launch|start|run|och|ishga\s*tushir|открыть|запустить|включить)\s+(.+)$/i.test(input) ||
                          /(?:och|ni\s*och|ishga\s*tushir)$/i.test(input);

  if (isAppOpenIntent) {
    // A. Calculator
    if (/(?:calc|calculator|kalkulyator|калькулятор)/i.test(input)) {
      return {
        recognized: true,
        commandId: 'app_calculator',
        category: 'applications',
        pluginId: 'system_plugin',
        title: 'Calculator (Kalkulyator)',
        permissionType: 'application_launch',
        args: {},
      };
    }

    // B. Clock / Alarms / Timer
    if (/(?:clock|soat|budilnik|часы|будильник|таймер|alarms|timer)/i.test(input)) {
      return {
        recognized: true,
        commandId: 'app_clock',
        category: 'applications',
        pluginId: 'system_plugin',
        title: 'Clock (Soat va Taymer)',
        permissionType: 'application_launch',
        args: {},
      };
    }

    // C. CMD / Terminal / Powershell
    if (/(?:cmd|terminal|command prompt|powershell|командн|терминал)/i.test(input)) {
      return {
        recognized: true,
        commandId: 'app_cmd',
        category: 'applications',
        pluginId: 'windows_plugin',
        title: 'CMD (Command Prompt)',
        permissionType: 'application_launch',
        args: {},
      };
    }

    // D. Notepad
    if (/(?:notepad|bloknot|блокнот|daftar|matn muharriri)/i.test(input)) {
      return {
        recognized: true,
        commandId: 'app_notepad',
        category: 'applications',
        pluginId: 'file_plugin',
        title: 'Notepad (Bloknot)',
        permissionType: 'application_launch',
        args: {},
      };
    }

    // E. Paint
    if (/(?:paint|mspaint|паинт|рисовани)/i.test(input)) {
      return {
        recognized: true,
        commandId: 'app_paint',
        category: 'applications',
        pluginId: 'system_plugin',
        title: 'MS Paint',
        permissionType: 'application_launch',
        args: {},
      };
    }

    // F. File Explorer
    if (/(?:file explorer|explorer|fayl menejeri|проводник)/i.test(input) && !/(?:downloads|desktop|documents|pictures|videos)/i.test(input)) {
      return {
        recognized: true,
        commandId: 'app_explorer',
        category: 'applications',
        pluginId: 'windows_plugin',
        title: 'File Explorer (Fayl Menejeri)',
        permissionType: 'application_launch',
        args: {},
      };
    }

    // G. Task Manager
    if (/(?:task manager|taskmgr|диспетчер задач|vazifalar menejeri|dispetcher)/i.test(input)) {
      return {
        recognized: true,
        commandId: 'app_taskmgr',
        category: 'applications',
        pluginId: 'windows_plugin',
        title: 'Task Manager (Vazifalar Menejeri)',
        permissionType: 'application_launch',
        args: {},
      };
    }

    // H. Settings
    if (/(?:settings|sozlamalar|настройки|параметры|windows settings)/i.test(input)) {
      return {
        recognized: true,
        commandId: 'app_settings',
        category: 'applications',
        pluginId: 'windows_plugin',
        title: 'Windows Settings',
        permissionType: 'application_launch',
        args: {},
      };
    }

    // I. Browser / Chrome
    if (/(?:browser|brauzer|chrome|google chrome|браузер|хром)/i.test(input)) {
      return {
        recognized: true,
        commandId: 'app_browser',
        category: 'applications',
        pluginId: 'browser_plugin',
        title: 'Browser',
        permissionType: 'application_launch',
        args: {},
      };
    }

    // J. Control Panel
    if (/(?:control panel|boshqaruv paneli|панель управления|control)/i.test(input)) {
      return {
        recognized: true,
        commandId: 'app_control',
        category: 'applications',
        pluginId: 'windows_plugin',
        title: 'Control Panel',
        permissionType: 'application_launch',
        args: {},
      };
    }

    // K. Calendar
    if (/(?:calendar|kalendar|календарь|taqvim)/i.test(input)) {
      return {
        recognized: true,
        commandId: 'app_calendar',
        category: 'applications',
        pluginId: 'system_plugin',
        title: 'Calendar (Kalendar)',
        permissionType: 'application_launch',
        args: {},
      };
    }
  }

  // 2.5 Multi-language Application Close Pattern:
  // "close <app>", "exit <app>", "stop <app>", "<app> yop", "<app>ni yop", "yop <app>", "закрыть <app>"
  const isAppCloseIntent = /^(?:close|exit|stop|kill|yop|o['']?chir|ochir|закрыть|закрой|выйти|выключить)\s+(.+)$/i.test(input) ||
                          /(?:yop|ni\s*yop)$/i.test(input);

  if (isAppCloseIntent) {
    let targetApp = '';
    if (/(?:calc|calculator|kalkulyator|калькулятор)/i.test(input)) targetApp = 'calculator';
    else if (/(?:clock|soat|budilnik|часы|будильник|таймер|alarms|timer)/i.test(input)) targetApp = 'clock';
    else if (/(?:cmd|terminal|command prompt|powershell|командн|терминал)/i.test(input)) targetApp = 'cmd';
    else if (/(?:notepad|bloknot|блокнот|daftar|matn muharriri)/i.test(input)) targetApp = 'notepad';
    else if (/(?:paint|mspaint|паинт|рисовани)/i.test(input)) targetApp = 'paint';
    else if (/(?:file explorer|explorer|fayl menejeri|проводник)/i.test(input)) targetApp = 'explorer';
    else if (/(?:task manager|taskmgr|диспетчер задач|vazifalar menejeri|dispetcher)/i.test(input)) targetApp = 'taskmgr';
    else if (/(?:settings|sozlamalar|настройки|параметры)/i.test(input)) targetApp = 'settings';
    else if (/(?:browser|brauzer|chrome|хром)/i.test(input)) targetApp = 'browser';
    else if (/(?:control panel|boshqaruv paneli|панель управления|control)/i.test(input)) targetApp = 'control';
    else if (/(?:calendar|kalendar|календарь|taqvim)/i.test(input)) targetApp = 'calendar';

    if (targetApp) {
      return {
        recognized: true,
        commandId: `app_close_${targetApp}`,
        category: 'applications',
        pluginId: 'system_plugin',
        title: `Close ${targetApp}`,
        permissionType: 'application_launch',
        args: { app: targetApp },
      };
    }
  }

  // 3. Multi-language Open Folders:
  // "open downloads", "downloads och", "открыть загрузки", etc.
  if (
    /(?:downloads|desktop|documents|pictures|videos|ish stoli|hujjatlar|yuklamalar|rasmlar|videolar|загрузк|рабоч|документ|фото|видео)\s*(?:ni\s*|papkasini\s*|папку\s*)?(?:och|ishga tushir|ko'rsat|korsat)?$/i.test(input) ||
    /^(?:och|open|открыть)\s+(?:downloads|desktop|documents|pictures|videos|ish stoli|hujjatlar|yuklamalar|rasmlar|videolar|папку|загрузки|документы|рабочий стол|фото|видео)/i.test(input)
  ) {
    const loc = extractLocation(input);
    return {
      recognized: true,
      commandId: 'win_open_folder',
      category: 'windows',
      pluginId: 'windows_plugin',
      title: `${loc} Folder`,
      permissionType: 'file_access',
      args: { location: loc },
    };
  }

  // 4. Temporary files cleanup:
  // "temporary files clean", "clean temp", "kesh tozalash", "очистить кэш", "очистить временные файлы"
  if (/(?:temporary files clean|clean temp|temp tozalash|kesh tozalash|keshni tozalash|vaqtinchalik fayl|temp fayl|очистить кэш|очистить временные файлы|очистка кэша)/i.test(input)) {
    return {
      recognized: true,
      commandId: 'sys_optimize',
      category: 'automation',
      pluginId: 'automation_plugin',
      title: 'Temporary Files Cleanup (Kesh tozalash)',
      permissionType: 'automation',
      args: { raw: input },
    };
  }

  // 5. Audio Mute / Unmute:
  if (/^(?:mute|unmute|без звука|включить звук|выключить звук|ovozni\s*(?:o['']?chir|ochir|yoq)|tovushni\s*(?:o['']?chir|ochir|yoq))$/i.test(input)) {
    const isMute = !/(?:unmute|yoq|включить)/i.test(input);
    return {
      recognized: true,
      commandId: 'win_mute',
      category: 'windows',
      pluginId: 'system_plugin',
      title: isMute ? 'Mute Audio' : 'Unmute Audio',
      permissionType: 'system_settings',
      args: { isMute },
    };
  }

  // 6. Volume change:
  const volMatch = input.match(/(?:ovoz|volume|громкость)\s*(?:darajasi)?\s*(\d{1,3})/i);
  if (volMatch) {
    const level = Math.min(100, Math.max(0, parseInt(volMatch[1], 10)));
    return {
      recognized: true,
      commandId: 'win_volume',
      category: 'windows',
      pluginId: 'system_plugin',
      title: `Set Volume (${level}%)`,
      permissionType: 'system_settings',
      args: { level },
    };
  }
  if (/(?:volume\s*up|ovozni\s*balandlat|ovozni\s*oshir|прибавить громкость)/i.test(input)) {
    return {
      recognized: true,
      commandId: 'win_volume',
      category: 'windows',
      pluginId: 'system_plugin',
      title: 'Volume Up',
      permissionType: 'system_settings',
      args: { level: 80 },
    };
  }
  if (/(?:volume\s*down|ovozni\s*pasaytir|убавить громкость)/i.test(input)) {
    return {
      recognized: true,
      commandId: 'win_volume',
      category: 'windows',
      pluginId: 'system_plugin',
      title: 'Volume Down',
      permissionType: 'system_settings',
      args: { level: 30 },
    };
  }

  // 7. PC Lock:
  if (/(?:lock pc|pc lock|lock computer|kompyuterni\s*(?:qulfla|blokla|qulflash)|ekranni\s*(?:qulfla|blokla)|заблокировать пк|заблокировать компьютер)/i.test(input)) {
    return {
      recognized: true,
      commandId: 'win_lock',
      category: 'windows',
      pluginId: 'windows_plugin',
      title: 'Lock PC (Kompyuterni bloklash)',
      permissionType: 'windows_commands',
      args: {},
    };
  }

  // 8. PC Shutdown & Restart:
  if (/(?:shutdown|turn off pc|kompyuterni\s*(?:o['']?chir|ochir|yop)|tizimni\s*(?:o['']?chir|ochir)|выключить пк|выключить компьютер)/i.test(input)) {
    return {
      recognized: true,
      commandId: 'win_shutdown',
      category: 'windows',
      pluginId: 'windows_plugin',
      title: 'Shutdown PC (Kompyuterni o‘chirish)',
      permissionType: 'windows_commands',
      requiresConfirmation: true,
      confirmationMessage: '⚠️ Kompyuterni o‘chirishga ruxsat berasizmi? / Confirm system shutdown?',
      args: {},
    };
  }
  if (/(?:restart|qayta\s*ishga\s*tushir|reboot|qayta\s*yukla|перезагрузка|перезагрузить пк)/i.test(input)) {
    return {
      recognized: true,
      commandId: 'win_restart',
      category: 'windows',
      pluginId: 'windows_plugin',
      title: 'Restart PC (Qayta yuklash)',
      permissionType: 'windows_commands',
      requiresConfirmation: true,
      confirmationMessage: '⚠️ Operatsion tizimni qayta ishga tushirishga (Restart) ruxsat berasizmi?',
      args: {},
    };
  }

  // 9. Battery Status:
  if (/(?:batareya|battery|quvvat|zaryad|zaryadka|akkumulyator|батарея|заряд)/i.test(input)) {
    return {
      recognized: true,
      commandId: 'sys_battery',
      category: 'system',
      pluginId: 'system_plugin',
      title: 'Battery Status (Batareya)',
      permissionType: 'system_settings',
      args: {},
    };
  }

  // 10. Clipboard Control:
  if (/(?:clipboard|bufer|буфер)/i.test(input)) {
    const isClear = /(?:tozala|ochir|o['']?chir|bo['']?shat|очистить)/i.test(input);
    return {
      recognized: true,
      commandId: 'sys_clipboard',
      category: 'system',
      pluginId: 'system_plugin',
      title: isClear ? 'Clear Clipboard' : 'View Clipboard',
      permissionType: 'system_settings',
      args: { action: isClear ? 'clear' : 'read', raw: input },
    };
  }

  // 11. Help:
  if (/^(?:help|yordam|pomosh|помощь|команды|\?)$/i.test(input) || /(?:barcha buyruqlar|buyruqlar ro['']?yxati|spisok komand)/i.test(input)) {
    return {
      recognized: true,
      commandId: 'sys_help',
      category: 'system',
      pluginId: 'system_plugin',
      title: 'Help Catalog',
      permissionType: 'system_settings',
      args: {},
    };
  }

  // 11.5 Time & Date (Distinguished):
  if (/^(?:date|sana|дата|bugungi sana|bugun qanday kun|bugun nima kun|today date)$/i.test(input)) {
    return {
      recognized: true,
      commandId: 'sys_date',
      category: 'system',
      pluginId: 'system_plugin',
      title: 'Date (Sana)',
      permissionType: 'system_settings',
      args: {},
    };
  }

  if (/^(?:time|vaqt|soat|hozirgi vaqt|soat necha|vaqt necha|время|сколько времени|который час)$/i.test(input)) {
    return {
      recognized: true,
      commandId: 'sys_time',
      category: 'system',
      pluginId: 'system_plugin',
      title: 'Time (Vaqt)',
      permissionType: 'system_settings',
      args: {},
    };
  }

  // 12. System Status / Diagnostics:
  if (/(?:status|tizim holati|monitoring|diagnostika|cpu|ram|xotira|system status|статус|состояние системы|диагностика)/i.test(input)) {
    return {
      recognized: true,
      commandId: 'sys_status',
      category: 'system',
      pluginId: 'system_plugin',
      title: 'System Diagnostics & Status',
      permissionType: 'system_settings',
      args: {},
    };
  }

  // 13. Browser & Web Shortcuts: YouTube, Telegram, Instagram
  if (/(?:youtube|ютуб|musiqa qo['']?y|video och)/i.test(input)) {
    return {
      recognized: true,
      commandId: 'browser_youtube',
      category: 'browser',
      pluginId: 'browser_plugin',
      title: 'YouTube',
      permissionType: 'browser_control',
      args: {},
    };
  }
  if (/(?:telegram|tg|телеграм)\s*(?:och|ga kir|web|открыть)?/i.test(input)) {
    return {
      recognized: true,
      commandId: 'browser_telegram',
      category: 'browser',
      pluginId: 'browser_plugin',
      title: 'Telegram Web',
      permissionType: 'browser_control',
      args: {},
    };
  }
  if (/(?:instagram|insta|инстаграм)\s*(?:och|ga kir|web|открыть)?/i.test(input)) {
    return {
      recognized: true,
      commandId: 'browser_instagram',
      category: 'browser',
      pluginId: 'browser_plugin',
      title: 'Instagram Web',
      permissionType: 'browser_control',
      args: {},
    };
  }

  // 14. File Creation:
  if (/(?:yarat|yoz|hosil qil|create|make|создать|записать)/i.test(input) && /(?:fayl|\.txt|\.bat|\.json|\.md|hujjat|file|файл)/i.test(input)) {
    const loc = extractLocation(input);
    let fileName = 'new_document.txt';
    const nameMatch = input.match(/([a-zA-Z0-9_\-.]+\.[a-zA-Z0-9]+)/i);
    if (nameMatch) {
      fileName = nameMatch[1];
    }

    let content = 'Created by JARVIS Local Desktop Agent.';
    const contentMatch = input.match(/(?:ichiga|matni|content|текст)\s+["']?([^"']+)["']?\s*(?:deb\s+yoz|yoz)?/i);
    if (contentMatch) {
      content = contentMatch[1].trim();
    }

    return {
      recognized: true,
      commandId: 'file_create',
      category: 'files',
      pluginId: 'file_plugin',
      title: 'Create File (Fayl yaratish)',
      permissionType: 'file_access',
      args: {
        name: fileName,
        content,
        location: loc,
      },
    };
  }

  // 15. Conversational / greetings rule-based:
  if (/(?:salom|assalomu alaykum|qalaysan|ishlar qalay|kimsan|jarvis|hello|hi|hey|привет|здравствуйте)/i.test(input)) {
    return {
      recognized: true,
      commandId: 'sys_greeting',
      category: 'system',
      pluginId: 'system_plugin',
      title: 'JARVIS Local Greeting',
      permissionType: 'system_settings',
      args: { text: input },
    };
  }

  // Fallback: Unrecognized
  return {
    recognized: false,
    unrecognizedReason: 'Noma‘lum buyruq kiritildi. Barcha buyruqlar va qo‘llanmani ko‘rish uchun "help" deb yozing.',
    suggestedCommands: [
      'help',
      'time',
      'date',
      'open calculator',
      'close calculator',
      'open cmd',
      'close cmd',
      'open notepad',
      'close notepad',
      'open paint',
      'open file explorer',
      'open task manager',
      'open settings',
      'Tizim holati / System status',
      'Batareya / Battery',
      'Kesh tozalash / Clean temp',
      'Lock PC',
    ],
  };
}
