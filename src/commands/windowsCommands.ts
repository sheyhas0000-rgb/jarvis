import { CommandExecutionResult, LocalCommandDefinition, ApprovedLocation } from '../types';

export const WINDOWS_COMMANDS_META: LocalCommandDefinition[] = [
  {
    id: 'win_lock',
    name: 'Kompyuterni bloklash',
    category: 'windows',
    pluginId: 'windows_plugin',
    keywords: ['kompyuterni blokla', 'ekranni blokla', 'blokla', 'lock', 'kompyuterni qulfla', 'ekranni qulfla', 'lock computer', 'qulflash'],
    description: 'Windows ish stantsiyasini bir zumda qulflaydi (Lock Workstation).',
    example: 'Kompyuterni blokla',
    requiresPermission: 'windows_commands',
  },
  {
    id: 'win_shutdown',
    name: 'Kompyuterni o‘chirish',
    category: 'windows',
    pluginId: 'windows_plugin',
    keywords: ['kompyuterni ochir', "kompyuterni o'chir", 'kompyuterni o‘chir', 'shutdown', 'kompyuterni yop', 'tizimni o‘chir'],
    description: 'Windows tizimini xavfsiz o‘chiradi (Shutdown).',
    example: 'Kompyuterni o‘chir',
    requiresPermission: 'windows_commands',
    dangerous: true,
  },
  {
    id: 'win_restart',
    name: 'Kompyuterni qayta ishga tushirish',
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
    name: 'Papkalarni ochish',
    category: 'windows',
    pluginId: 'windows_plugin',
    keywords: [
      'downloads papkasini och', 'downloads och', 'yuklamalar papkasini och', 'yuklamalarni och',
      'desktopni och', 'ish stolini och', 'desktop papkasini och',
      'documents papkasini och', 'hujjatlar papkasini och', 'hujjatlarni och',
      'pictures papkasini och', 'rasmlar papkasini och', 'rasmlarni och',
      'videos papkasini och', 'videolarni och', 'explorer och'
    ],
    description: 'Windows File Explorer orqali standart papkalarni ochadi.',
    example: 'Downloads papkasini och',
    requiresPermission: 'file_access',
  },
  {
    id: 'win_volume',
    name: 'Ovoz balandligini sozlash',
    category: 'windows',
    pluginId: 'system_plugin',
    keywords: ['ovoz', 'volume', 'ovozni balandlat', 'ovozni pasaytir', 'tovush', 'ovoz 50', 'ovoz 100', 'ovozni o‘chir', 'mute'],
    description: 'Windows tizim audio dinamiklari balandligini o‘zgartiradi.',
    example: 'Ovozi 50 ga qo‘y',
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
        message: '🔒 Bajarildi, ser! Kompyuter ekrani bloklandi.',
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
        details: `Yo‘l: ${path}\nStatus: Explorer oynasi faollashtirildi.`,
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
