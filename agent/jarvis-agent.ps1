# JARVIS Pure Windows PowerShell Local Agent
# Port: 8765 (http://127.0.0.1:8765)
# Zero installation required! Runs on built-in Windows 10/11 PowerShell.

$port = 8765
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
} catch {
    Write-Host "[XATO] Port 8765 band yoki ruxsat yo'q: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "      🤖 JARVIS WINDOWS LOCAL AGENT (POWERSHELL)        " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Manzil: http://127.0.0.1:$port" -ForegroundColor Green
Write-Host "Holat: Tayyor! JARVIS veb-interfeysi bilan bog'landi." -ForegroundColor Green
Write-Host "Ushbu oynani yopmang!" -ForegroundColor Yellow
Write-Host "--------------------------------------------------------"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # CORS
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Request-Private-Network")
        $response.AddHeader("Access-Control-Allow-Private-Network", "true")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 204
            $response.Close()
            continue
        }

        if ($request.Url.AbsolutePath -eq "/status" -or $request.Url.AbsolutePath -eq "/health") {
            $json = '{"status":"ok","agent":"JARVIS PowerShell Agent","version":"1.4.0","platform":"Windows"}'
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.Close()
            continue
        }

        if ($request.HttpMethod -eq "POST" -and $request.Url.AbsolutePath -eq "/execute") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $body = $reader.ReadToEnd()
            $reader.Close()

            $data = ConvertFrom-Json $body
            $action = $data.action
            $app = $data.app

            Write-Host "[JARVIS] Buyruq qabul qilindi: $action ($app)" -ForegroundColor Cyan

            $winCmd = ""
            if ($action -eq "launch_app") {
                switch ($app.ToLower()) {
                    "calculator" { $winCmd = "calc.exe" }
                    "clock"      { $winCmd = "start ms-clock:" }
                    "cmd"        { $winCmd = 'cmd.exe /k "title Windows Command Prompt (CMD)"' }
                    "notepad"    { $winCmd = "notepad.exe" }
                    "paint"      { $winCmd = "mspaint.exe" }
                    "explorer"   { $winCmd = "explorer.exe" }
                    "taskmgr"    { $winCmd = "taskmgr.exe" }
                    "settings"   { $winCmd = "start ms-settings:" }
                    "browser"    { $winCmd = "start https://www.google.com" }
                    "control"    { $winCmd = "control.exe" }
                    "calendar"   { $winCmd = "start outlookcal:" }
                    default      { $winCmd = "start $app" }
                }

                Start-Process "cmd.exe" -ArgumentList "/c start $winCmd" -WindowStyle Hidden
            } elseif ($action -eq "run_windows_command") {
                $cmd = $data.command
                Start-Process "cmd.exe" -ArgumentList "/c $cmd" -WindowStyle Hidden
            }

            $json = '{"success":true,"isRealWindows":true,"message":"Haqiqiy Windows dasturi ishga tushirildi"}'
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.Close()
            continue
        }

        $response.StatusCode = 404
        $response.Close()
    } catch {
        Write-Host "Xato: $($_.Exception.Message)" -ForegroundColor Red
    }
}
