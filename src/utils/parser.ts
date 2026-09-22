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
  if (/(yuklama|downloads|download|zagruzki)/i.test(norm)) return 'Downloads';
  if (/(hujjat|documents|document|dokument)/i.test(norm)) return 'Documents';
  if (/(rasm|pictures|picture|foto)/i.test(norm)) return 'Pictures';
  if (/(video|videos|rolik)/i.test(norm)) return 'Videos';
  if (/(desktop|ish stoli|rabochiy)/i.test(norm)) return 'Desktop';
  return 'Desktop';
}

export function parseLocalCommand(rawInput: string): ParseResult {
  const input = normalizeInput(rawInput);
  if (!input) {
    return { recognized: false, unrecognizedReason: 'Buyruq kiritilmadi' };
  }

  // 1. Check direct keyword match against ALL_COMMANDS_META
  for (const cmd of ALL_COMMANDS_META) {
    for (const kw of cmd.keywords) {
      const kwNorm = normalizeInput(kw);
      if (input === kwNorm || input.startsWith(kwNorm + ' ') || input.endsWith(' ' + kwNorm)) {
        // Matched command
        const args: Record<string, any> = { raw: input };

        // If file or folder command, extract location and name
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

  // 2. Specific Rule-based Parsers for v1.3 commands:

  // A. Open Folders: "downloads och", "desktop och", "documents och", "hujjatlar och", etc.
  if (
    /(?:downloads|desktop|documents|pictures|videos|ish stoli|hujjatlar|yuklamalar|rasmlar|videolar)\s*(?:ni\s*|papkasini\s*)?(?:och|ishga tushir|ko'rsat|korsat)?$/i.test(input) ||
    /^(?:och|open)\s+(?:downloads|desktop|documents|pictures|videos|ish stoli|hujjatlar|yuklamalar|rasmlar|videolar)/i.test(input)
  ) {
    const loc = extractLocation(input);
    return {
      recognized: true,
      commandId: 'win_open_folder',
      category: 'windows',
      pluginId: 'windows_plugin',
      title: `${loc} papkasini ochish`,
      permissionType: 'file_access',
      args: { location: loc },
    };
  }

  // B. Temporary files cleanup: "temporary files clean", "clean temp", "kesh tozalash", "temp tozalash"
  if (/(?:temporary files clean|clean temp|temp tozalash|kesh tozalash|keshni tozalash|vaqtinchalik fayl|temp fayl)/i.test(input)) {
    return {
      recognized: true,
      commandId: 'sys_optimize',
      category: 'automation',
      pluginId: 'automation_plugin',
      title: 'Kesh tozalash va Optimizatsiya',
      permissionType: 'automation',
      args: { raw: input },
    };
  }

  // C. Audio Mute / Unmute
  if (/^(?:mute|unmute|ovozni\s*(?:o['']?chir|ochir|yoq)|tovushni\s*(?:o['']?chir|ochir|yoq))$/i.test(input)) {
    const isMute = !/unmute|yoq/i.test(input);
    return {
      recognized: true,
      commandId: 'win_mute',
      category: 'windows',
      pluginId: 'system_plugin',
      title: isMute ? 'Ovozni o‘chirish (Mute)' : 'Ovozni yoqish (Unmute)',
      permissionType: 'system_settings',
      args: { isMute },
    };
  }

  // D. Volume change: "ovoz 50", "volume 70", "ovozni 80 ga qo'y", "volume up", "volume down"
  const volMatch = input.match(/(?:ovoz|volume)\s*(?:darajasi)?\s*(\d{1,3})/i);
  if (volMatch) {
    const level = Math.min(100, Math.max(0, parseInt(volMatch[1], 10)));
    return {
      recognized: true,
      commandId: 'win_volume',
      category: 'windows',
      pluginId: 'system_plugin',
      title: `Ovoz balandligini sozlash (${level}%)`,
      permissionType: 'system_settings',
      args: { level },
    };
  }
  if (/(?:volume\s*up|ovozni\s*balandlat|ovozni\s*oshir)/i.test(input)) {
    return {
      recognized: true,
      commandId: 'win_volume',
      category: 'windows',
      pluginId: 'system_plugin',
      title: 'Ovoz balandligini oshirish',
      permissionType: 'system_settings',
      args: { level: 80 },
    };
  }
  if (/(?:volume\s*down|ovozni\s*pasaytir)/i.test(input)) {
    return {
      recognized: true,
      commandId: 'win_volume',
      category: 'windows',
      pluginId: 'system_plugin',
      title: 'Ovoz balandligini pasaytirish',
      permissionType: 'system_settings',
      args: { level: 30 },
    };
  }

  // E. PC Lock: "lock pc", "pc lock", "kompyuterni qulflash", "ekranni qulfla"
  if (/(?:lock pc|pc lock|kompyuterni\s*(?:qulfla|blokla|qulflash)|ekranni\s*(?:qulfla|blokla))/i.test(input)) {
    return {
      recognized: true,
      commandId: 'win_lock',
      category: 'windows',
      pluginId: 'windows_plugin',
      title: 'Kompyuterni bloklash (Lock PC)',
      permissionType: 'windows_commands',
      args: {},
    };
  }

  // F. PC Shutdown & Restart
  if (/(?:shutdown|kompyuterni\s*(?:o['']?chir|ochir|yop)|tizimni\s*(?:o['']?chir|ochir))/i.test(input)) {
    return {
      recognized: true,
      commandId: 'win_shutdown',
      category: 'windows',
      pluginId: 'windows_plugin',
      title: 'Kompyuterni o‘chirish (Shutdown)',
      permissionType: 'windows_commands',
      requiresConfirmation: true,
      confirmationMessage: '⚠️ Kompyuterni o‘chirishga ruxsat berasizmi? Ochiq dasturlar va saqlanmagan ma\'lumotlar yopilishi mumkin.',
      args: {},
    };
  }
  if (/(?:restart|qayta\s*ishga\s*tushir|reboot|qayta\s*yukla)/i.test(input)) {
    return {
      recognized: true,
      commandId: 'win_restart',
      category: 'windows',
      pluginId: 'windows_plugin',
      title: 'Kompyuterni qayta ishga tushirish (Restart)',
      permissionType: 'windows_commands',
      requiresConfirmation: true,
      confirmationMessage: '⚠️ Operatsion tizimni qayta ishga tushirishga (Restart) ruxsat berasizmi?',
      args: {},
    };
  }

  // G. Battery Status: "batareya", "battery", "quvvat", "zaryad"
  if (/(?:batareya|battery|quvvat|zaryad|zaryadka|akkumulyator)/i.test(input)) {
    return {
      recognized: true,
      commandId: 'sys_battery',
      category: 'system',
      pluginId: 'system_plugin',
      title: 'Batareya holati',
      permissionType: 'system_settings',
      args: {},
    };
  }

  // H. Clipboard Control: "clipboard", "bufer", "clipboardni tozalash"
  if (/(?:clipboard|bufer)/i.test(input)) {
    const isClear = /(?:tozala|ochir|o['']?chir|bo['']?shat)/i.test(input);
    return {
      recognized: true,
      commandId: 'sys_clipboard',
      category: 'system',
      pluginId: 'system_plugin',
      title: isClear ? 'Clipboardni tozalash' : 'Clipboard matnini ko‘rish',
      permissionType: 'system_settings',
      args: { action: isClear ? 'clear' : 'read', raw: input },
    };
  }

  // I. Time & Date: "vaqt", "soat", "sana"
  if (/(?:vaqt|soat|sana|bugun qanday kun|bugungi sana|time|date)/i.test(input)) {
    return {
      recognized: true,
      commandId: 'sys_time',
      category: 'system',
      pluginId: 'system_plugin',
      title: 'Vaqt va Sana',
      permissionType: 'system_settings',
      args: {},
    };
  }

  // J. System Status / Diagnostics: "status", "tizim holati", "cpu", "ram"
  if (/(?:status|tizim holati|monitoring|diagnostika|cpu|ram|xotira|system status)/i.test(input)) {
    return {
      recognized: true,
      commandId: 'sys_status',
      category: 'system',
      pluginId: 'system_plugin',
      title: 'Tizim holati (Diagnostics)',
      permissionType: 'system_settings',
      args: {},
    };
  }

  // K. Browser & Web Shortcuts: YouTube, Telegram, Google, Instagram
  if (/(?:youtube|musiqa qo['']?y|video och)/i.test(input)) {
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
  if (/(?:telegram|tg)\s*(?:och|ga kir|web)?/i.test(input)) {
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
  if (/(?:instagram|insta)\s*(?:och|ga kir|web)?/i.test(input)) {
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

  // L. File Creation: "Desktopda test.txt yarat ichiga salom deb yoz", "test.txt yarat"
  if (/(?:yarat|yoz|hosil qil)/i.test(input) && /(?:fayl|\.txt|\.bat|\.json|\.md|hujjat)/i.test(input)) {
    const loc = extractLocation(input);
    
    let fileName = 'yangi_hujjat.txt';
    const nameMatch = input.match(/([a-zA-Z0-9_\-.]+\.[a-zA-Z0-9]+)/i);
    if (nameMatch) {
      fileName = nameMatch[1];
    } else {
      const altMatch = input.match(/(?:nomli|nomi)\s+([a-zA-Z0-9_\-]+)/i);
      if (altMatch) {
        fileName = `${altMatch[1]}.txt`;
      }
    }

    let content = 'JARVIS tomonidan yaratilgan matnli hujjat.';
    const contentMatch = input.match(/(?:ichiga|matni)\s+["']?([^"']+)["']?\s*(?:deb\s+yoz|yoz)?/i);
    if (contentMatch) {
      content = contentMatch[1].trim();
    }

    return {
      recognized: true,
      commandId: 'file_create',
      category: 'files',
      pluginId: 'file_plugin',
      title: 'Fayl yaratish',
      permissionType: 'file_access',
      args: {
        name: fileName,
        content,
        location: loc,
      },
    };
  }

  // M. Folder Creation: "Desktopda yangi papka yarat", "loyiha papkasini yarat"
  if (/(?:papka|folder)\s*(?:yarat|och)/i.test(input) && !/(?:ochish|ko'rsat|royxat)/i.test(input)) {
    const loc = extractLocation(input);
    let folderName = 'Yangi_Papka';
    const folderMatch = input.match(/([a-zA-Z0-9_\-]+)\s*(?:papka|folder)/i);
    if (folderMatch && !['yangi', 'desktopda', 'downloadsda'].includes(folderMatch[1])) {
      folderName = folderMatch[1];
    }

    return {
      recognized: true,
      commandId: 'file_create_folder',
      category: 'files',
      pluginId: 'file_plugin',
      title: 'Papka yaratish',
      permissionType: 'file_access',
      args: {
        name: folderName,
        location: loc,
      },
    };
  }

  // N. File Delete: "test.txt ni o'chir", "faylni ochir"
  if (/(?:ochir|o['']?chir|delete|yoqot)/i.test(input) && /(?:fayl|\.txt|\.bat|\.json|\.md|hujjat)/i.test(input)) {
    const loc = extractLocation(input);
    let fileName = '';
    const nameMatch = input.match(/([a-zA-Z0-9_\-.]+\.[a-zA-Z0-9]+)/i);
    if (nameMatch) {
      fileName = nameMatch[1];
    }

    return {
      recognized: true,
      commandId: 'file_delete',
      category: 'files',
      pluginId: 'file_plugin',
      title: 'Faylni o‘chirish',
      requiresConfirmation: true,
      confirmationMessage: `⚠️ "${fileName || 'tanlangan fayl'}" faylini o‘chirishga ruxsat berasizmi? Bu amalni orqaga qaytarib bo‘lmaydi.`,
      permissionType: 'file_delete',
      args: {
        name: fileName,
        location: loc,
      },
    };
  }

  // O. File Open: "test.txt ni och", "test.txt faylini och"
  if (/(?:och|o['']?qi|kor|ko'r)/i.test(input) && /(?:fayl|\.txt|\.bat|\.json|\.md|hujjat)/i.test(input)) {
    const loc = extractLocation(input);
    let fileName = '';
    const nameMatch = input.match(/([a-zA-Z0-9_\-.]+\.[a-zA-Z0-9]+)/i);
    if (nameMatch) {
      fileName = nameMatch[1];
    }

    return {
      recognized: true,
      commandId: 'file_open',
      category: 'files',
      pluginId: 'file_plugin',
      title: 'Faylni ochish',
      permissionType: 'file_access',
      args: {
        name: fileName,
        location: loc,
      },
    };
  }

  // P. Google Search: "google da qidir: ...", "internetdan qidir: ..."
  if (/(?:google\s*da\s*qidir|qidiruv|qidir)\s*:?\s*(.*)/i.test(input)) {
    const qMatch = input.match(/(?:google\s*da\s*qidir|qidiruv|qidir)\s*:?\s*(.*)/i);
    const query = qMatch ? qMatch[1].trim() : '';
    return {
      recognized: true,
      commandId: 'browser_google',
      category: 'browser',
      pluginId: 'browser_plugin',
      title: 'Google Qidiruv',
      permissionType: 'browser_control',
      args: { query },
    };
  }

  // Q. Conversational / greetings rule-based detection
  if (/(?:salom|assalomu alaykum|qalaysan|ishlar qalay|kimsan|jarvis)/i.test(input)) {
    return {
      recognized: true,
      commandId: 'sys_greeting',
      category: 'system',
      pluginId: 'system_plugin',
      title: 'Lokal salomlashish',
      permissionType: 'system_settings',
      args: { text: input },
    };
  }

  // If no rule matched, return unrecognized with suggestions
  return {
    recognized: false,
    unrecognizedReason: 'Bu command JARVIS tomonidan qo‘llab-quvvatlanmaydi.',
    suggestedCommands: [
      'Vaqt va sana',
      'Tizim holati',
      'Batareya holati',
      'Downloads och',
      'Desktop och',
      'Documents och',
      'Kesh tozalash',
      'Ovoz 50%',
      'Mute',
      'YouTube och',
      'Google och',
      'Telegram och',
      'Lock PC',
      'Clipboard',
    ],
  };
}
