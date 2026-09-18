#!/bin/bash
# JARVIS macOS & Linux Agent Launcher
cd "$(dirname "$0")"
clear
echo "========================================================"
echo "              🤖 JARVIS macOS / PC AGENT"
echo "           Shaxsiy Kompyuter Yordamchisi"
echo "========================================================"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ [XATO] Node.js Mac kompyuteringizda topilmadi!"
    echo "Iltimos, avval Node.js ni o'rnating:"
    echo "   1) Rasmiy saytdan: https://nodejs.org"
    echo "   yoki Homebrew orqali: brew install node"
    echo ""
    read -p "Chiqish uchun Enter bosing..."
    exit 1
fi

echo "✅ Node.js aniqlandi: $(node -v)"
echo "🚀 JARVIS Local Agent ishga tushirilmoqda: http://127.0.0.1:8765"
echo "🖥️  Platforma: $(uname -s)"
echo ""

if [ -f "agent/jarvis-agent.js" ]; then
    node agent/jarvis-agent.js
elif [ -f "jarvis-agent.js" ]; then
    node jarvis-agent.js
else
    echo "⬇️ jarvis-agent.js skripti topilmadi, qidirilmoqda..."
    node -e "console.log('Iltimos jarvis-agent.js faylini shu papkaga joylashtiring')"
    read -p "Davom etish uchun Enter bosing..."
fi
