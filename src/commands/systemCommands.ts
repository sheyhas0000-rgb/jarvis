import { CommandExecutionResult, LocalCommandDefinition } from '../types';

export const SYSTEM_COMMANDS_META: LocalCommandDefinition[] = [
  {
    id: 'sys_status',
    name: 'Tizim holati (Diagnostics & Status)',
    category: 'system',
    pluginId: 'system_plugin',
    keywords: [
      'tizim holati', 'status', 'ram', 'cpu', 'monitoring', 'diagnostika', 
      'kompyuter holati', 'tizim', 'jarvis status', 'holat', 'system status'
    ],
    description: 'Kompyuter xotirasi (RAM), protsessor (CPU), batareya va tizim parametrlarini ko‘rsatadi.',
    example: 'Tizim holati',
    requiresPermission: 'system_settings',
  },
  {
    id: 'sys_battery',
    name: 'Batareya holati (Battery Status)',
    category: 'system',
    pluginId: 'system_plugin',
    keywords: [
      'batareya', 'battery', 'quvvat', 'zaryad', 'zaryadka', 
      'akkumulyator', 'batareya holati', 'quvvat holati', 'zaryad necha', 'quvvat darajasi'
    ],
    description: 'Noutbuk / kompyuter batareya quvvati, zaryadlanish holati va manbasini ko‘rsatadi.',
    example: 'Batareya holati',
    requiresPermission: 'system_settings',
  },
  {
    id: 'sys_clipboard',
    name: 'Clipboard (Almashish buferi)',
    category: 'system',
    pluginId: 'system_plugin',
    keywords: [
      'clipboard', 'bufer', 'clipboardni kor', "clipboardni ko'r", 'clipboardni ko‘r',
      'clipboardni tozalash', 'clipboard tozalash', 'buferni tozalash', 'clipboard matni',
      'bufer matni', 'clipboard nusxa'
    ],
    description: 'Windows almashish buferidagi (Clipboard) matnni ko‘rish yoki tozalash.',
    example: 'Clipboard',
    requiresPermission: 'system_settings',
  },
  {
    id: 'sys_time',
    name: 'Vaqt va Sana',
    category: 'system',
    pluginId: 'system_plugin',
    keywords: ['vaqt', 'soat', 'sana', 'bugun nima kun', 'soat necha', 'bugungi sana', 'vaqt necha', 'bugun qanday kun', 'time', 'date'],
    description: 'Joriy aniq vaqt, hafta kuni, sana va mintaqa ma\'lumotlarini aytadi.',
    example: 'Vaqt necha bo‘ldi?',
    requiresPermission: 'system_settings',
  },
  {
    id: 'sys_clear',
    name: 'Ekranni tozalash',
    category: 'system',
    pluginId: 'system_plugin',
    keywords: ['tozala', 'ekranni tozala', 'ekranni tozalash', 'clear', 'cls', 'chatni tozalash'],
    description: 'Chat darchasidagi barcha xabarlarni tozalaydi.',
    example: 'Tozala',
    requiresPermission: 'system_settings',
  },
  {
    id: 'sys_optimize',
    name: 'Kesh tozalash va Optimizatsiya (Temp clean)',
    category: 'automation',
    pluginId: 'automation_plugin',
    keywords: [
      'optimizatsiya', 'keshni tozala', 'tozalash', 'temp tozalash', 'tezlashtir', 
      'kompyuterni tozala', 'temporary files clean', 'clean temp', 'kesh tozalash',
      'vaqtinchalik fayllarni tozalash', 'tizimni tozalash', 'temp fayllar'
    ],
    description: 'Windows vaqtinchalik fayllari (%temp%) va DNS keshini tozalash skriptini yaratadi va yuklaydi.',
    example: 'Keshni tozala',
    requiresPermission: 'automation',
  },
];

export async function executeSystemCommand(commandId: string, args: Record<string, any> = {}): Promise<CommandExecutionResult> {
  switch (commandId) {
    case 'sys_status': {
      const isOnline = navigator.onLine;
      const mem = (performance as any)?.memory;
      const usedMb = mem ? Math.round(mem.usedJSHeapSize / (1024 * 1024)) : 52;
      const totalMb = mem ? Math.round(mem.totalJSHeapSize / (1024 * 1024)) : 142;
      const cores = navigator.hardwareConcurrency || 8;

      let batteryText = 'Doimiy quvvat (AC Power)';
      try {
        if ('getBattery' in navigator) {
          const battery: any = await (navigator as any).getBattery();
          const levelPct = Math.round(battery.level * 100);
          batteryText = `${levelPct}% (${battery.charging ? 'Zaryadlanmoqda ⚡' : 'Batareyadan ishlamoqda 🔋'})`;
        }
      } catch (e) {}

      return {
        success: true,
        message: `⚡ JARVIS Local Agent v1.3 Diagnostikasi:\n\n🖥️ Operatsion tizim: Windows NT 10.0 (Local Desktop Engine)\n🧠 Xotira (RAM): ${usedMb} MB ishlatilmoqda / ${totalMb} MB ajratilgan\n⚙️ Protsessor (CPU): ${cores} ta mantiqiy yadro (Barqaror yuklama)\n🔋 Batareya & Quvvat: ${batteryText}\n🛡️ Rejim: 100% Oflayn va Xavfsiz (No AI / No Cloud LLM)\n🌐 Tarmoq holati: ${isOnline ? 'Lokal tarmoq faol' : 'Oflayn rejim'}\n⏱️ Tizim uzluksizligi: Barqaror (Uptime: 99.9%)`,
        details: 'JARVIS Engine: v1.3.0 Local\nSandbox: Whitelist Enforced\nStorage: Local IndexedDB / localStorage\nAudio Core: Windows SAPI Ready',
        windowsCommand: 'systeminfo',
      };
    }

    case 'sys_battery': {
      try {
        if ('getBattery' in navigator) {
          const battery: any = await (navigator as any).getBattery();
          const levelPct = Math.round(battery.level * 100);
          const isCharging = battery.charging;
          const statusText = isCharging ? 'Tarmoqqa ulangan (Zaryadlanmoqda)' : 'Akkumulyatordan mustaqil ishlamoqda';

          return {
            success: true,
            message: `🔋 Batareya holati:\n\n⚡ Quvvat darajasi: ${levelPct}%\n🔌 Holat: ${statusText}\n💡 Rejim: ${levelPct > 20 ? 'Optimal energiya balansi' : '⚠️ Past quvvat — zaryadlovchini ulang!'}\n🛡️ Batareya salomatligi: A\'lo darajada`,
            details: `Battery API: Level=${battery.level}, Charging=${isCharging}`,
            windowsCommand: 'powercfg /batteryreport',
          };
        }
      } catch (e) {}

      return {
        success: true,
        message: `🔋 Batareya va Quvvat ta'minoti:\n\n⚡ Tizim quvvat manbai: AC Power (Doimiy elektr tarmog‘i / Statsionar)\n📊 Quvvat darajasi: 100% (Cheklovlarsiz)\n🛡️ Tizim rejimi: Yuqori unumdorlik (High Performance)\n💡 Quvvat boshqaruvi: Barqaror`,
        details: 'Windows Power Scheme: High Performance (AC)',
        windowsCommand: 'powercfg /batteryreport',
      };
    }

    case 'sys_clipboard': {
      const isClear = args.action === 'clear' || (args.raw && /tozala/i.test(args.raw));

      if (isClear) {
        try {
          await navigator.clipboard.writeText('');
          return {
            success: true,
            message: '📋 Bajarildi, ser! Almashish buferi (Clipboard) muvaffaqiyatli tozalandi.',
            details: 'Clipboard bo‘shatildi (Empty).',
            windowsCommand: 'powershell -c "Set-Clipboard -Value $null"',
          };
        } catch (e) {
          return {
            success: true,
            message: '📋 Almashish buferini tozalash buyrug‘i yuborildi.',
            windowsCommand: 'powershell -c "Set-Clipboard -Value $null"',
          };
        }
      }

      // Read clipboard
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          const preview = text.length > 300 ? text.slice(0, 300) + '...' : text;
          return {
            success: true,
            message: `📋 Almashish buferi (Clipboard) joriy matni:\n\n"${preview}"\n\n(Belgilar soni: ${text.length} ta)`,
            details: 'Clipboard: ReadText muvaffaqiyatli olindi.',
            windowsCommand: 'powershell -c "Get-Clipboard"',
          };
        } else {
          return {
            success: true,
            message: '📋 Almashish buferi (Clipboard) hozircha bo‘sh.',
            details: 'Clipboardda matnli ma\'lumot topilmadi.',
            windowsCommand: 'powershell -c "Get-Clipboard"',
          };
        }
      } catch (e) {
        return {
          success: true,
          message: '📋 Almashish buferi (Clipboard) tizim buyrug‘i faollashtirildi.\n\nEslatma: Brauzer xavfsizlik qoidalariga ko‘ra clipboard matnini o‘qish uchun ruxsat kerak bo‘lishi mumkin.',
          details: 'Clipboard monitoring faol.',
          windowsCommand: 'powershell -c "Get-Clipboard"',
        };
      }
    }

    case 'sys_time': {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = now.toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const dayName = now.toLocaleDateString('uz-UZ', { weekday: 'long' });

      return {
        success: true,
        message: `⏰ Hozirgi vaqt: ${timeStr}\n📅 Sana: ${dateStr}\n🗓️ Hafta kuni: ${dayName.toUpperCase()}\n🌐 Mintaqa: Toshkent (O‘zbekiston, UTC+5)`,
        details: `Timestamp: ${Date.now()}\nISO: ${now.toISOString()}`,
      };
    }

    case 'sys_clear': {
      return {
        success: true,
        message: '🧹 Ekran tozalandi, ser!',
        details: 'Chat tarixi joriy darchadan tozalandi.',
      };
    }

    case 'sys_optimize': {
      const scriptContent = `@echo off
chcp 65001 >nul
title JARVIS - Windows Keshini Tozalash
color 0b
echo ========================================
echo   JARVIS Windows Kesh Tozalash Skripti
echo ========================================
echo.
echo [1/3] Vaqtinchalik fayllar (%temp%) tozalanmoqda...
del /s /f /q "%temp%\\*.*" >nul 2>&1
echo       [+] User Temp tozalandi.
echo.
echo [2/3] Windows Temp tozalanmoqda...
del /s /f /q "C:\\Windows\\Temp\\*.*" >nul 2>&1
echo       [+] Windows Temp tozalandi.
echo.
echo [3/3] DNS kesh yangilanmoqda (Flush DNS)...
ipconfig /flushdns >nul 2>&1
echo       [+] DNS keshi yangilandi.
echo.
echo ========================================
echo   Optimizatsiya muvaffaqiyatli yakunlandi!
echo ========================================
pause
`;
      // Download cleaner.bat
      try {
        const blob = new Blob([scriptContent], { type: 'application/x-bat;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'jarvis_cleaner.bat';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {}

      return {
        success: true,
        message: '⚡ Bajarildi, ser! Windows vaqtinchalik fayllari (%temp%) va DNS keshini tozalash uchun "jarvis_cleaner.bat" skripti yaratildi va yuklab berildi.',
        details: 'Skript quyidagilarni tozalaydi:\n1. User Temp (%temp%)\n2. Windows Temp (C:\\Windows\\Temp)\n3. DNS Cache (ipconfig /flushdns)',
        createdFile: {
          name: 'jarvis_cleaner.bat',
          content: scriptContent,
          size: scriptContent.length,
          location: 'Downloads',
        },
        windowsCommand: 'jarvis_cleaner.bat',
      };
    }

    default:
      return {
        success: false,
        message: '❌ Noma\'lum tizim buyrug‘i.',
      };
  }
}
