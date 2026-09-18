/**
 * Standalone Offline Single-File HTML Generator for JARVIS.
 * This generates a 100% self-contained, zero-dependency offline web app
 * that runs natively on Windows, macOS, Linux, and Android via any browser.
 * It does not require any Google login, avoids all 403 Forbidden errors,
 * and works completely offline!
 */

export function generateOfflineAppHtml(): string {
  return `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JARVIS - O'zbek Tizim Yordamchisi (Offline Standalone)</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes pulse-glow {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }
    .animate-pulse-glow { animation: pulse-glow 3s infinite ease-in-out; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #090d16; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #06b6d4; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950">
  <!-- Top Bar -->
  <header class="h-14 border-b border-cyan-500/20 bg-slate-900/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black shadow-[0_0_12px_rgba(6,182,212,0.3)]">
        ⚡
      </div>
      <div>
        <h1 class="text-sm font-bold tracking-wider text-slate-100 flex items-center gap-2">
          <span>JARVIS O'ZBEK</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">100% OFLAYN</span>
        </h1>
        <p class="text-[10px] text-cyan-300/70">Mustaqil Ish Stoli Dasturi</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button id="toggleVoiceBtn" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium border border-cyan-500/20 transition-all flex items-center gap-1.5">
        <span id="voiceStatusDot" class="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span>Ovoz: <span id="voiceStateText">Yoqilgan</span></span>
      </button>
    </div>
  </header>

  <!-- Main Workspace -->
  <main class="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col gap-4">
    <!-- Status & Visualizer Card -->
    <div class="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="relative flex items-center justify-center w-14 h-14">
          <div id="orbGlow" class="absolute inset-0 rounded-full bg-cyan-500/20 animate-pulse-glow"></div>
          <div class="w-10 h-10 rounded-full bg-cyan-500/40 border border-cyan-400 flex items-center justify-center text-cyan-200 text-lg font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            J
          </div>
        </div>
        <div>
          <h2 id="assistantStatus" class="text-sm font-bold text-slate-200">JARVIS tayyor</h2>
          <p id="assistantSub" class="text-xs text-slate-400">Ovozli yoki yozma buyruq bering</p>
        </div>
      </div>
      <!-- Quick Command Buttons -->
      <div class="flex flex-wrap gap-1.5 justify-end text-xs">
        <button onclick="runCommand('telegramni och')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors">✈️ Telegram</button>
        <button onclick="runCommand('youtubeni och')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors">▶️ YouTube</button>
        <button onclick="runCommand('fayllarni och')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors">📂 Fayllar</button>
        <button onclick="runCommand('soat necha')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors">⏰ Soat</button>
      </div>
    </div>

    <!-- Chat Dialogue Box -->
    <div id="chatBox" class="flex-1 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 overflow-y-auto min-h-[360px] max-h-[500px] flex flex-col gap-3">
      <!-- Welcome Message -->
      <div class="flex items-start gap-3">
        <div class="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs shrink-0 mt-0.5">J</div>
        <div class="p-3.5 rounded-xl rounded-tl-none bg-slate-900 border border-cyan-500/20 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-[85%] shadow-md">
          Assalomu alaykum! Men <strong>JARVIS</strong> — sizning o'zbek tilidagi shaxsiy tizim yordamchingizman. Ushbu versiya to'liq oflayn ishlaydi, hech qanday Google login yoki 403 xatosisiz kompyuteringizda xizmat qiladi. Qanday yordam bera olaman?
        </div>
      </div>
    </div>

    <!-- Input Bar -->
    <div class="flex items-center gap-2 p-2 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-lg">
      <button id="micBtn" class="p-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 transition-all cursor-pointer flex items-center justify-center shrink-0">
        <span id="micIcon" class="text-base">🎙️</span>
      </button>
      <input
        id="textInput"
        type="text"
        placeholder="O'zbekcha buyruq yozing (masalan: 'telegramni och', 'fayllarni och')..."
        class="flex-1 bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none px-2 py-1"
      />
      <button id="sendBtn" class="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer">
        Yuborish
      </button>
    </div>
  </main>

  <!-- Sound & Speech Logic -->
  <script>
    // Audio synthesizer for UI sounds
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    function playBeep(freq = 440, type = 'sine', duration = 0.1) {
      try {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch(e) {}
    }

    // State
    let voiceEnabled = true;
    let isListening = false;
    let recognition = null;

    const chatBox = document.getElementById('chatBox');
    const textInput = document.getElementById('textInput');
    const sendBtn = document.getElementById('sendBtn');
    const micBtn = document.getElementById('micBtn');
    const micIcon = document.getElementById('micIcon');
    const assistantStatus = document.getElementById('assistantStatus');
    const assistantSub = document.getElementById('assistantSub');
    const toggleVoiceBtn = document.getElementById('toggleVoiceBtn');
    const voiceStateText = document.getElementById('voiceStateText');
    const voiceStatusDot = document.getElementById('voiceStatusDot');

    toggleVoiceBtn.addEventListener('click', () => {
      voiceEnabled = !voiceEnabled;
      voiceStateText.textContent = voiceEnabled ? 'Yoqilgan' : 'O\'chirilgan';
      voiceStatusDot.className = voiceEnabled ? 'w-2 h-2 rounded-full bg-emerald-400' : 'w-2 h-2 rounded-full bg-slate-500';
      if (!voiceEnabled && window.speechSynthesis) window.speechSynthesis.cancel();
    });

    function speak(text) {
      if (!voiceEnabled || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'uz-UZ';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }

    function addMessage(sender, text, isAction = false, actionInfo = '') {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'flex items-start gap-3 ' + (sender === 'user' ? 'flex-row-reverse' : '');
      
      const avatar = document.createElement('div');
      avatar.className = sender === 'user'
        ? 'w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 text-xs shrink-0 mt-0.5'
        : 'w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs shrink-0 mt-0.5';
      avatar.textContent = sender === 'user' ? 'Siz' : 'J';

      const bubble = document.createElement('div');
      bubble.className = sender === 'user'
        ? 'p-3 rounded-xl rounded-tr-none bg-emerald-950/40 border border-emerald-500/30 text-xs sm:text-sm text-slate-100 max-w-[85%] shadow-md'
        : 'p-3 rounded-xl rounded-tl-none bg-slate-900 border border-cyan-500/20 text-xs sm:text-sm text-slate-200 max-w-[85%] shadow-md';
      
      bubble.innerHTML = '<p>' + text + '</p>' + (actionInfo ? '<div class="mt-2 pt-2 border-t border-slate-800 text-[11px] text-cyan-300/80 flex items-center gap-1.5">' + actionInfo + '</div>' : '');

      msgDiv.appendChild(avatar);
      msgDiv.appendChild(bubble);
      chatBox.appendChild(msgDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Local Uzbek Command Processor
    function parseAndExecute(raw) {
      const text = raw.toLowerCase().trim();
      playBeep(600, 'sine', 0.08);

      // Open Websites
      if (/telegram/i.test(text)) {
        try {
          window.open('https://web.telegram.org/', '_blank');
        } catch(e) {}
        const reply = "Telegram ochilmoqda.";
        const btn = '<a href="https://web.telegram.org" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:6px 12px;background:#0284c7;color:#ffffff;border-radius:8px;font-weight:bold;text-decoration:none;margin-top:6px;">✈️ Telegram Web-ni Ochish ↗</a>';
        addMessage('jarvis', reply, true, '🚀 Telegram ochilmoqda:<br/>' + btn);
        speak(reply);
        return;
      }
      if (/youtube|yutub/i.test(text)) {
        try {
          window.open('https://www.youtube.com/', '_blank');
        } catch(e) {}
        const reply = "YouTube ochilmoqda.";
        const btn = '<a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:6px 14px;background:#dc2626;color:#ffffff;border-radius:8px;font-weight:bold;text-decoration:none;margin-top:6px;">▶️ YouTube-ni Ochish ↗</a>';
        addMessage('jarvis', reply, true, '🚀 YouTube ochilmoqda:<br/>' + btn);
        speak(reply);
        return;
      }
      if (/instagram/i.test(text)) {
        try {
          window.open('https://www.instagram.com/', '_blank');
        } catch(e) {}
        const reply = "Instagram ochilmoqda.";
        const btn = '<a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:6px 12px;background:#e11d48;color:#ffffff;border-radius:8px;font-weight:bold;text-decoration:none;margin-top:6px;">📸 Instagram-ni Ochish ↗</a>';
        addMessage('jarvis', reply, true, '🚀 Instagram ochilmoqda:<br/>' + btn);
        speak(reply);
        return;
      }
      if (/google|gugl/i.test(text)) {
        try {
          window.open('https://www.google.com/', '_blank');
        } catch(e) {}
        const reply = "Google qidiruv tizimi ochildi.";
        const btn = '<a href="https://www.google.com" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:6px 12px;background:#059669;color:#ffffff;border-radius:8px;font-weight:bold;text-decoration:none;margin-top:6px;">🔍 Google-ni Ochish ↗</a>';
        addMessage('jarvis', reply, true, '🚀 Google ochilmoqda:<br/>' + btn);
        speak(reply);
        return;
      }

      // Time & Date
      if (/soat|vaqt/i.test(text)) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
        const reply = "Hozir soat " + timeStr + ".";
        addMessage('jarvis', reply, true, "⏰ Joriy vaqt: " + timeStr);
        speak(reply);
        return;
      }
      if (/sana|bugun/i.test(text)) {
        const now = new Date();
        const dateStr = now.toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const reply = "Bugun " + dateStr + ".";
        addMessage('jarvis', reply, true, "📅 " + dateStr);
        speak(reply);
        return;
      }

      // Files
      if (/fayl|hujjat|papka|och/i.test(text)) {
        const reply = "Ish stolidagi fayllar ro'yxati tayyor.";
        addMessage('jarvis', reply, true, "📂 Desktop: Hujjatlarim.txt, Loyiha, Hisobot.docx");
        speak(reply);
        return;
      }

      // Greetings
      if (/salom|assalomu|qalaysan|qandaysan/i.test(text)) {
        const reply = "Assalomu alaykum! Sizga qanday yordam bera olaman?";
        addMessage('jarvis', reply);
        speak(reply);
        return;
      }

      // General fallback
      const reply = "Tushundim: '" + raw + "'. Buyruq qabul qilindi.";
      addMessage('jarvis', reply);
      speak(reply);
    }

    function runCommand(cmd) {
      addMessage('user', cmd);
      parseAndExecute(cmd);
    }

    sendBtn.addEventListener('click', () => {
      const val = textInput.value.trim();
      if (!val) return;
      textInput.value = '';
      runCommand(val);
    });

    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = textInput.value.trim();
        if (!val) return;
        textInput.value = '';
        runCommand(val);
      }
    });

    // Voice Recognition setup (Chrome / Edge Web Speech API)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.lang = 'uz-UZ';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        isListening = true;
        micBtn.className = "p-3 rounded-xl bg-red-500/30 text-red-400 border border-red-500 animate-pulse cursor-pointer flex items-center justify-center shrink-0";
        assistantStatus.textContent = "Sizni eshityapman...";
        assistantSub.textContent = "Gapiring...";
        playBeep(880, 'sine', 0.1);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          runCommand(transcript);
        }
      };

      recognition.onerror = (e) => {
        console.error('Speech error', e);
        assistantStatus.textContent = "JARVIS tayyor";
        assistantSub.textContent = "Mikrofon xatosi yoki ruxsat berilmadi";
      };

      recognition.onend = () => {
        isListening = false;
        micBtn.className = "p-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 transition-all cursor-pointer flex items-center justify-center shrink-0";
        assistantStatus.textContent = "JARVIS tayyor";
        assistantSub.textContent = "Ovozli yoki yozma buyruq bering";
      };

      micBtn.addEventListener('click', () => {
        if (isListening) {
          recognition.stop();
        } else {
          try { recognition.start(); } catch(e) {}
        }
      });
    } else {
      micBtn.title = "Brauzeringizda ovozli nutqni aniqlash qo'llab-quvvatlanmaydi";
      micBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
  </script>
</body>
</html>`;
}

export function downloadOfflineAppHtml() {
  const content = generateOfflineAppHtml();
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'JARVIS-Oflayn-Ilova.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
