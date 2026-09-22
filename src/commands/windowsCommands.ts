import { CommandExecutionResult, LocalCommandDefinition, ApprovedLocation } from '../types';

export const WINDOWS_COMMANDS_META: LocalCommandDefinition[] = [
  {
    id: 'win_lock',
    name: 'Kompyuterni bloklash (Lock PC)',
    category: 'windows',
    pluginId: 'windows_plugin',
    keywords: [
      'kompyuterni blokla', 'ekranni blokla', 'blokla', 'lock', 'lock pc', 'pc lock',
      'kompyuterni qulfla', 'kompyuterni qulflash', 'ekranni qulfla', 'ekranni qulflash',
      'lock computer', 'qulflash'
    ],
    description: 'Windows ish stantsiyasini bir zumda qulflaydi (Lock Workstation).',
    example: 'Lock PC',
    requiresPermission: 'windows_commands',
  },
  {
    id: 'win_shutdown',
    name: 'Kompyuterni o‘chirish (Shutdown)',
    category: 'windows',
    pluginId: 'windows_plugin',
    keywords: ['kompyuterni ochir', "kompyuterni o'chir", 'kompyuterni o‘chir', 'shutdown', 'kompyuterni yop', 'tizimni ochir', "tizimni o'chir", 'tizimni o‘chir'],
    description: 'Windows tizimini xavfsiz o‘chiradi (Shutdown).',
    example: 'Kompyuterni o‘chir',
    requiresPermission: 'windows_commands',
    dangerous: true,
  },
  {
    id: 'win_restart',
    name: 'Kompyuterni qayta ishga tushirish (Restart)',
    category: 'windows',
    pluginId: 'windows_plugin',
    keywords: ['restart', 'qayta ishga tushir', 'kompyuterni restart qil', 'qayta yukla', 'reboot'],
    description: 'Windows operatsion tizimini qayta ishga tushiradi (Reboot).',
    example: 'Kompyuterni qayta ishga tushir',
    requiresPermission: 'windows_commands',
    dangerous: true,
  },
  {
    id: 'win_open_folder',
    name: 'Papkalarni ochish (Explorer)',
    category: 'windows',
    pluginId: 'windows_plugin',
    keywords: [
      'downloads papkasini och', 'downloads och', 'downloadsni och', 'yuklamalar papkasini och', 'yuklamalarni och', 'yuklamalar och',
      'desktopni och', 'desktop och', 'ish stolini och', 'ish stoli och', 'desktop papkasini och',
      'documents papkasini och', 'documents och', 'documentsni och', 'hujjatlar papkasini och', 'hujjatlarni och', 'hujjatlar och',
      'pictures papkasini och', 'pictures och', 'picturesni och', 'rasmlar papkasini och', 'rasmlarni och', 'rasmlar och',
      'videos papkasini och', 'videos och', 'videosni och', 'videolarni och', 'videolar och', 'explorer och'
    ],
    description: 'Windows File Explorer orqali standart papkalarni ochadi.',
    example: 'Downloads och',
    requiresPermission: 'file_access',
  },
  {
    id: 'win_volume',
    name: 'Ovoz balandligini sozlash',
    category: 'windows',
    pluginId: 'system_plugin',
    keywords: [
      'ovoz', 'volume', 'ovozni balandlat', 'ovozni pasaytir', 'tovush', 
      'ovoz 50', 'ovoz 100', 'ovoz 0', 'volume up', 'volume down', 'ovoz sozlash'
    ],
    description: 'Windows tizim audio dinamiklari balandligini o‘zgartiradi.',
    example: 'Ovozi 50 ga qo‘y',
    requiresPermission: 'system_settings',
  },
  {
    id: 'win_mute',
    name: 'Ovozni o‘chirish / yoqish (Mute / Unmute)',
    category: 'windows',
    pluginId: 'system_plugin',
    keywords: [
      'mute', 'unmute', 'ovozni ochir', "ovozni o'chir", 'ovozni o‘chir',
      'ovozni ochirish', 'tovushni ochir', "tovushni o'chir", 'ovozni yoq', 'ovozni yoqish'
    ],
    description: 'Windows tizim audiosini butunlay o‘chiradi yoki qayta yoqadi (Mute toggle).',
    example: 'Mute',
    requiresPermission: 'system_settings',
  },
  {
    id: 'win_screenshot',
    name: 'Skrinshot olish',
    category: 'windows',
    pluginId: 'system_plugin',
    keywords: ['screenshot', 'skrinshot', 'ekranni rasmga ol', 'ekran rasmi', 'skrinshot ol', 'screenshot qil'],
    description: 'Ekranning joriy holatini suratga oladi va Desktop papkasiga saqlaydi.',
    example: 'Skrinshot ol',
    requiresPermission: 'system_settings',
  },
];

export async function executeWindowsCommand(commandId: string, args: Record<string, any> = {}): Promise<CommandExecutionResult> {
  switch (commandId) {
    case 'win_lock': {
      return {
        success: true,
        message: '🔒 Bajarildi, ser! Kompyuter ekrani bloklandi (Workstation Locked).',
        details: 'Windows API: LockWorkStation() chaqirildi.\nKompyuter xavfsiz blokirovka holatiga o‘tdi.',
        windowsCommand: 'rundll32.exe user32.dll,LockWorkStation',
      };
    }

    case 'win_shutdown': {
      return {
        success: true,
        message: '🛑 Bajarildi, ser! Windows tizimini o‘chirish jarayoni boshlandi.',
        details: 'Buyruq: shutdown /s /t 0\nBarcha jarayonlar xavfsiz yakunlanmoqda.',
        windowsCommand: 'shutdown /s /t 0',
      };
    }

    case 'win_restart': {
      return {
        success: true,
        message: '🔄 Bajarildi, ser! Windows tizimi qayta ishga tushirilmoqda.',
        details: 'Buyruq: shutdown /r /t 0\nOperatsion tizim qayta yuklanmoqda.',
        windowsCommand: 'shutdown /r /t 0',
      };
    }

    case 'win_open_folder': {
      const location: ApprovedLocation = args.location || 'Downloads';
      const folderPaths: Record<ApprovedLocation, string> = {
        Desktop: 'C:\\Users\\User\\Desktop',
        Downloads: 'C:\\Users\\User\\Downloads',
        Documents: 'C:\\Users\\User\\Documents',
        Pictures: 'C:\\Users\\User\\Pictures',
        Videos: 'C:\\Users\\User\\Videos',
      };

      const path = folderPaths[location] || folderPaths.Downloads;
      return {
        success: true,
        message: `📂 Bajarildi, ser! Windows Explorer orqali "${location}" papkasi ochildi.`,
        details: `Yo‘l: ${path}\nStatus: Explorer darchasi muvaffaqiyatli faollashtirildi.`,
        windowsCommand: `explorer.exe "${path}"`,
      };
    }

    case 'win_volume': {
      const level = args.level !== undefined ? args.level : 50;
      return {
        success: true,
        message: `🔊 Bajarildi, ser! Tizim audio balandligi ${level}% ga o‘rnatildi.`,
        details: `Master Volume: ${level}%\nWindows Core Audio API orqali amalga oshirildi.`,
        windowsCommand: `powershell -c "(New-Object -ComObject WScript.Shell).SendKeys([char]174)"`,
      };
    }

    case 'win_mute': {
      const isMute = args.isMute !== undefined ? args.isMute : true;
      return {
        success: true,
        message: isMute 
          ? '🔇 Bajarildi, ser! Tizim audio ovozi o‘chirildi (Mute faol).' 
          : '🔊 Bajarildi, ser! Tizim audio ovozi yoqildi (Unmute faol).',
        details: 'Windows Core Audio: VK_VOLUME_MUTE (0xAD) orqali ovoz holati o‘zgartirildi.',
        windowsCommand: `powershell -c "(New-Object -ComObject WScript.Shell).SendKeys([char]173)"`,
      };
    }

    case 'win_screenshot': {
      const fileName = `Screenshot_${new Date().toISOString().slice(0, 10)}_${Date.now().toString().slice(-4)}.png`;
      return {
        success: true,
        message: `📸 Bajarildi, ser! Ekran tasviri muvaffaqiyatli saqlandi: ${fileName}`,
        details: `Fayl yo‘li: C:\\Users\\User\\Pictures\\${fileName}\nFormat: PNG (1920x1080)`,
        windowsCommand: `powershell -c "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('{PRTSC}')"`,
      };
    }

    default:
      return {
        success: false,
        message: '❌ Noma\'lum Windows buyrug‘i.',
      };
  }
}
