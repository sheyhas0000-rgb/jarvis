import { ParseResult, ApprovedLocation } from '../types';
import { ALL_COMMANDS_META } from '../commands/commandRegistry';

export function normalizeInput(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’ʻʼ`]/g, "'")
    .replace(/o\s*[']/g, "o'")
    .replace(/g\s*[']/g, "g'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractLocation(rawText: string): ApprovedLocation {
  const norm = normalizeInput(rawText);
  if (/(yuklama|downloads|download|zagruzki)/i.test(norm)) return 'Downloads';
  if (/(hujjat|documents|document|dokument)/i.test(norm)) return 'Documents';
  if (/(rasm|pictures|picture|foto)/i.test(norm)) return 'Pictures';
  if (/(video|videos|rolik)/i.test(norm)) return 'Videos';
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
        const args: Record<string, any> = {};

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

  // 2. Specific Rule-based Parsers for parameterized commands:

  // A. File Creation: "Desktopda test.txt yarat ichiga salom deb yoz", "test.txt yarat"
  if (/(?:yarat|yoz|hosil qil)/i.test(input) && /(?:fayl|\.txt|\.bat|\.json|\.md|hujjat)/i.test(input)) {
    const loc = extractLocation(input);
    
    // Extract file name
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

    // Extract content: "ichiga ... deb yoz"
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

  // B. Folder Creation: "Desktopda yangi papka yarat", "loyiha papkasini yarat"
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

  // C. File Delete: "test.txt ni o'chir", "faylni ochir"
  if (/(?:ochir|o'chir|o‘chir|delete|yoqot)/i.test(input) && /(?:fayl|\.txt|\.bat|\.json|\.md|hujjat)/i.test(input)) {
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

  // D. File Open: "test.txt ni och", "test.txt faylini och"
  if (/(?:och|o'qi|o‘qi|kor)/i.test(input) && /(?:fayl|\.txt|\.bat|\.json|\.md|hujjat)/i.test(input)) {
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

  // E. Google Search: "google da qidir: ...", "internetdan qidir: ..."
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

  // F. Volume change: "ovoz 50", "ovozni 80 ga qo'y"
  const volMatch = input.match(/(?:ovoz|volume)\s*(?:darajasi)?\s*(\d{1,3})/i);
  if (volMatch) {
    const level = Math.min(100, Math.max(0, parseInt(volMatch[1], 10)));
    return {
      recognized: true,
      commandId: 'win_volume',
      category: 'windows',
      pluginId: 'system_plugin',
      title: 'Ovoz balandligini sozlash',
      permissionType: 'system_settings',
      args: { level },
    };
  }

  // G. Conversational / greetings rule-based detection
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
      'Chrome och',
      'Notepad och',
      'Calculator och',
      'Downloads papkasini och',
      'Desktopda test.txt yarat',
      'Kompyuterni blokla',
      'Tizim holati',
      'Keshni tozala',
    ],
  };
}
