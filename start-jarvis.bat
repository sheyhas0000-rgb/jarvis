@echo off
chcp 65001 > nul
title JARVIS Windows Local Agent v1.4

echo ========================================================
echo               🤖 JARVIS WINDOWS LOCAL AGENT
echo      Shaxsiy Kompyuter Yordamchisi (Real Windows)
echo ========================================================
echo.

:: 1. Tekshirish: Node.js mavjudmi?
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Node.js aniqlandi.
    echo JARVIS Agent (Node.js) port 8765 da ishga tushirilmoqda...
    echo.
    if exist "agent\jarvis-agent.js" (
        node agent\jarvis-agent.js
        goto end
    ) else if exist "jarvis-agent.js" (
        node jarvis-agent.js
        goto end
    )
)

:: 2. Agar Node.js bo'lmasa, Windows PowerShell orqali ishga tushirish (Zero-install!)
echo [MA'LUMOT] Node.js topilmadi, o'rnatilgan Windows PowerShell orqali ishga tushirilmoqda...
echo JARVIS PowerShell Agent port 8765 da ishga tushirilmoqda...
echo.

if exist "agent\jarvis-agent.ps1" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "agent\jarvis-agent.ps1"
    goto end
) else if exist "jarvis-agent.ps1" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "jarvis-agent.ps1"
    goto end
)

:: Inline PowerShell fallback
powershell -NoProfile -ExecutionPolicy Bypass -Command "$port=8765; $listener=New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://127.0.0.1:8765/'); $listener.Start(); Write-Host 'JARVIS PowerShell Agent http://127.0.0.1:8765 da faol! Ushbu oynani yopmang.'; while($listener.IsListening){ $ctx=$listener.GetContext(); $req=$ctx.Request; $res=$ctx.Response; $res.AddHeader('Access-Control-Allow-Origin','*'); $res.AddHeader('Access-Control-Allow-Headers','Content-Type,Access-Control-Request-Private-Network'); $res.AddHeader('Access-Control-Allow-Private-Network','true'); if($req.HttpMethod -eq 'OPTIONS'){$res.StatusCode=204;$res.Close();continue} if($req.Url.AbsolutePath -eq '/status'){$b=[System.Text.Encoding]::UTF8.GetBytes('{\"status\":\"ok\"}');$res.OutputStream.Write($b,0,$b.Length);$res.Close();continue} if($req.HttpMethod -eq 'POST'){$r=New-Object System.IO.StreamReader($req.InputStream);$d=ConvertFrom-Json $r.ReadToEnd();$a=$d.app; if($d.action -eq 'launch_app'){ switch($a){'cmd'{Start-Process 'cmd.exe'}'notepad'{Start-Process 'notepad.exe'}'calculator'{Start-Process 'calc.exe'}'paint'{Start-Process 'mspaint.exe'}'explorer'{Start-Process 'explorer.exe'}'taskmgr'{Start-Process 'taskmgr.exe'}'settings'{Start-Process 'ms-settings:'}'browser'{Start-Process 'https://www.google.com'}'control'{Start-Process 'control.exe'}'clock'{Start-Process 'ms-clock:'}'calendar'{Start-Process 'outlookcal:'} default{Start-Process $a} } } $b=[System.Text.Encoding]::UTF8.GetBytes('{\"success\":true}');$res.OutputStream.Write($b,0,$b.Length);$res.Close()} }"

:end
pause
