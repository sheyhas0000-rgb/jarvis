#!/usr/bin/env bash
# JARVIS Agent for macOS & Linux
cd "$(dirname "$0")"

echo "========================================================"
echo "          🤖 JARVIS AGENT (macOS / Linux)"
echo "========================================================"
echo ""

if ! command -v node &> /dev/null; then
    echo "❌ Node.js topilmadi. O'rnatish uchun: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node -v) aniqlandi"
echo "🚀 JARVIS Agent ishga tushmoqda (http://127.0.0.1:8765)..."

if [ -f "agent/jarvis-agent.js" ]; then
    node agent/jarvis-agent.js
elif [ -f "jarvis-agent.js" ]; then
    node jarvis-agent.js
else
    echo "❌ jarvis-agent.js fayli topilmadi!"
    exit 1
fi
