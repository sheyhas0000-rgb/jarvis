@echo off
chcp 65001 > nul
title JARVIS Windows Local Agent

echo ========================================================
echo               🤖 JARVIS WINDOWS AGENT
echo           Shaxsiy Kompyuter Yordamchisi
echo ========================================================
echo.

:: Node.js mavjudligini tekshirish
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [XATO] Node.js kompyuteringizda o'rnatilmagan!
    echo Iltimos, avval Node.js ni rasmiy saytidan yuklab oling:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js aniqlandi.
echo.
echo JARVIS Local Agent port 8765 da ishga tushirilmoqda...
echo.

:: Agent faylini qidirish
if exist "agent\jarvis-agent.js" (
    node agent\jarvis-agent.js
) else if exist "jarvis-agent.js" (
    node jarvis-agent.js
) else (
    echo [XATO] jarvis-agent.js fayli topilmadi!
    echo Iltimos, ushbu bat faylini JARVIS loyihasi jildida saqlang.
    pause
    exit /b 1
)

pause
