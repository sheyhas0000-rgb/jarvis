/**
 * Utilities to generate and trigger native desktop launchers for Windows and macOS.
 */
import { generateOfflineAppHtml } from './offlineAppGenerator';

export function downloadWindowsDesktopLauncher(appUrl: string = window.location.href) {
  const batContent = `@echo off
chcp 65001 >nul
title JARVIS O'zbek Yordamchisi - Ishga tushirish
color 0b

echo ========================================================
echo        🤖 JARVIS O'ZBEK TIZIM YORDAMCHISI
echo ========================================================
echo.
echo [1/2] Ish stoli uchun JARVIS yorlig'i yaratilmoqda...

set "TARGET_URL=${appUrl}"
set "SHORTCUT_PATH=%USERPROFILE%\\Desktop\\JARVIS Yordamchisi.url"

(
echo [InternetShortcut]
echo URL=%TARGET_URL%
echo IconIndex=0
echo IconFile=%SystemRoot%\\System32\\shell32.dll
) > "%SHORTCUT_PATH%"

echo [MUVAFFAQ] Ish stolingizda "JARVIS Yordamchisi" yorlig'i yaratildi!
echo.
echo [2/2] JARVIS brauzeringizda ochilmoqda...
echo.
echo ESLATMA: Google 403 Forbidden chiqsa, Google AI Studio akkauntingiz
echo ochiq bo'lgan Google Chrome brauzerida ushbu havolani oching.
echo.

:: 1. Try Google Chrome first (preserving user profile & session auth to prevent 403)
if exist "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" (
    start "" "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" "%TARGET_URL%"
    goto done
)

if exist "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe" (
    start "" "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe" "%TARGET_URL%"
    goto done
)

if exist "%LocalAppData%\\Google\\Chrome\\Application\\chrome.exe" (
    start "" "%LocalAppData%\\Google\\Chrome\\Application\\chrome.exe" "%TARGET_URL%"
    goto done
)

:: 2. Fallback to default system browser
start "" "%TARGET_URL%"

:done
echo ========================================================
echo   JARVIS muvaffaqiyatli ishga tushdi!
echo ========================================================
timeout /t 3 >nul
exit
`;

  const blob = new Blob([batContent], { type: 'application/x-bat;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'JARVIS-Desktop-Ishga-Tushirish.bat';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadMacWebloc(appUrl: string = window.location.href) {
  const weblocContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>URL</key>
	<string>${appUrl}</string>
</dict>
</plist>
`;
  const blob = new Blob([weblocContent], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'JARVIS-Mac.webloc';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadMacDesktopLauncher(appUrl: string = window.location.href) {
  const shContent = `#!/bin/bash
# ========================================================
#       🤖 JARVIS O'ZBEK TIZIM YORDAMCHISI (macOS)
# ========================================================
clear
echo "========================================================"
echo "    JARVIS O'zbek Yordamchisi Mac-da ishga tushmoqda..."
echo "========================================================"
echo ""

# Remove quarantine restriction if macOS flagged the file
xattr -d com.apple.quarantine "$0" 2>/dev/null || true

TARGET_URL="${appUrl}"

echo "🚀 JARVIS ochilmoqda..."

# 1. Try Google Chrome first (avoids Google 403 by using active session)
if [ -d "/Applications/Google Chrome.app" ]; then
    open -a "Google Chrome" "$TARGET_URL"
elif [ -d "/Applications/Safari.app" ]; then
    open -a "Safari" "$TARGET_URL"
else
    open "$TARGET_URL"
fi

echo "✅ JARVIS ochildi!"
sleep 2
exit 0
`;

  const blob = new Blob([shContent], { type: 'text/x-shellscript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'JARVIS-Mac.command';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export { generateOfflineAppHtml } from './offlineAppGenerator';
export { downloadOfflineAppHtml } from './offlineAppGenerator';

