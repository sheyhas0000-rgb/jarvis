import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Minus, 
  Square, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  Clock, 
  Calculator as CalcIcon, 
  FileText, 
  Palette, 
  Folder, 
  Activity, 
  Settings as SettingsIcon, 
  Globe, 
  LayoutGrid, 
  Calendar as CalIcon,
  Download,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Plus
} from 'lucide-react';
import { WindowsAppId, SupportedLanguage } from '../types';
import { t } from '../utils/i18n';
import { StorageService } from '../services/storageService';

interface WindowsAppModalProps {
  appId: WindowsAppId;
  onClose: () => void;
  language: SupportedLanguage;
}

export const WindowsAppModal: React.FC<WindowsAppModalProps> = ({
  appId,
  onClose,
  language,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const strings = t(language);

  // App Metadata & Local Windows details
  const getAppMeta = () => {
    switch (appId) {
      case 'calculator':
        return {
          title: strings.apps.calculator.name,
          icon: <CalcIcon className="w-4 h-4 text-cyan-400" />,
          command: 'start calc.exe',
          protocol: 'calculator:',
          path: 'C:\\Windows\\System32\\calc.exe',
        };
      case 'clock':
        return {
          title: strings.apps.clock.name,
          icon: <Clock className="w-4 h-4 text-emerald-400" />,
          command: 'start ms-clock:',
          protocol: 'ms-clock:',
          path: 'ms-clock: (Windows Alarms & Clock)',
        };
      case 'cmd':
        return {
          title: strings.apps.cmd.name,
          icon: <Terminal className="w-4 h-4 text-zinc-300" />,
          command: 'start cmd.exe /k "title Windows Command Prompt"',
          protocol: 'cmd.exe',
          path: 'C:\\Windows\\System32\\cmd.exe',
        };
      case 'notepad':
        return {
          title: strings.apps.notepad.name,
          icon: <FileText className="w-4 h-4 text-blue-400" />,
          command: 'start notepad.exe',
          protocol: 'notepad.exe',
          path: 'C:\\Windows\\System32\\notepad.exe',
        };
      case 'paint':
        return {
          title: strings.apps.paint.name,
          icon: <Palette className="w-4 h-4 text-purple-400" />,
          command: 'start mspaint.exe',
          protocol: 'mspaint.exe',
          path: 'C:\\Windows\\System32\\mspaint.exe',
        };
      case 'explorer':
        return {
          title: strings.apps.explorer.name,
          icon: <Folder className="w-4 h-4 text-amber-400" />,
          command: 'start explorer.exe',
          protocol: 'explorer:',
          path: 'C:\\Windows\\explorer.exe',
        };
      case 'taskmgr':
        return {
          title: strings.apps.taskmgr.name,
          icon: <Activity className="w-4 h-4 text-rose-400" />,
          command: 'start taskmgr.exe',
          protocol: 'taskmgr.exe',
          path: 'C:\\Windows\\System32\\taskmgr.exe',
        };
      case 'settings':
        return {
          title: strings.apps.settings.name,
          icon: <SettingsIcon className="w-4 h-4 text-sky-400" />,
          command: 'start ms-settings:',
          protocol: 'ms-settings:',
          path: 'ms-settings: (Windows Settings)',
        };
      case 'browser':
        return {
          title: strings.apps.browser.name,
          icon: <Globe className="w-4 h-4 text-indigo-400" />,
          command: 'start https://www.google.com',
          protocol: 'https://www.google.com',
          path: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        };
      case 'control':
        return {
          title: strings.apps.control.name,
          icon: <LayoutGrid className="w-4 h-4 text-teal-400" />,
          command: 'start control.exe',
          protocol: 'control.exe',
          path: 'C:\\Windows\\System32\\control.exe',
        };
      case 'calendar':
        return {
          title: strings.apps.calendar.name,
          icon: <CalIcon className="w-4 h-4 text-cyan-400" />,
          command: 'start outlookcal:',
          protocol: 'outlookcal:',
          path: 'outlookcal: (Windows Calendar)',
        };
    }
  };

  const meta = getAppMeta();

  const handleLaunchProtocol = () => {
    try {
      if (meta.protocol.includes(':') && !meta.protocol.startsWith('http')) {
        window.location.href = meta.protocol;
      } else if (meta.protocol.startsWith('http')) {
        window.open(meta.protocol, '_blank');
      }
    } catch (e) {}

    navigator.clipboard?.writeText(meta.command);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  // Keyboard escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn select-none">
      <div 
        className={`
          flex flex-col bg-[#0d1424] border border-cyan-500/30 rounded-2xl shadow-[0_15px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(0,240,255,0.15)]
          overflow-hidden transition-all duration-200
          ${isMaximized ? 'w-full h-full rounded-none' : 'w-full max-w-4xl max-h-[90vh] h-[640px]'}
        `}
      >
        {/* Windows 11 Title Bar */}
        <div className="h-11 px-3 bg-[#080d18] border-b border-cyan-900/40 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1 rounded-lg bg-cyan-950/80 border border-cyan-500/30">
              {meta.icon}
            </div>
            <span className="text-xs font-semibold text-zinc-200 truncate font-sans">
              {meta.title}
            </span>
            <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 font-mono text-zinc-400">
              {meta.command}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleLaunchProtocol}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono transition-all active:scale-95"
              title="Windows tizimida ochish (protokol / buyruq nusxalash)"
            >
              {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ExternalLink className="w-3.5 h-3.5" />}
              <span>{copiedCli ? 'Buyruq nusxalandi!' : 'Windows-da ochish'}</span>
            </button>

            {/* Window Controls */}
            <div className="flex items-center ml-2">
              <button
                onClick={onClose}
                className="w-8 h-7 flex items-center justify-center rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                title="Minimallashtirish"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="w-8 h-7 flex items-center justify-center rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                title={isMaximized ? "Kichiklashtirish" : "Kattalashtirish"}
              >
                <Square className="w-3 h-3" />
              </button>
              <button
                onClick={onClose}
                className="w-8 h-7 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-rose-600 transition-colors"
                title="Yopish"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Application Body */}
        <div className="flex-1 min-h-0 bg-[#070b14] overflow-hidden flex flex-col">
          {appId === 'calculator' && <CalculatorApp />}
          {appId === 'clock' && <ClockApp />}
          {appId === 'cmd' && <CmdApp language={language} />}
          {appId === 'notepad' && <NotepadApp />}
          {appId === 'paint' && <PaintApp />}
          {appId === 'explorer' && <ExplorerApp />}
          {appId === 'taskmgr' && <TaskManagerApp />}
          {appId === 'settings' && <SettingsApp language={language} />}
          {appId === 'browser' && <BrowserApp />}
          {appId === 'control' && <ControlPanelApp />}
          {appId === 'calendar' && <CalendarApp />}
        </div>

        {/* Windows Status Bar */}
        <div className="h-7 px-3 bg-[#080d18] border-t border-cyan-900/30 flex items-center justify-between text-[11px] font-mono text-zinc-500 shrink-0">
          <span className="truncate">Local Desktop: {meta.path}</span>
          <span className="hidden sm:inline text-cyan-400/80">Windows NT 10.0 • JARVIS v1.4</span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   1. CALCULATOR APP
   ========================================================================= */
const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [newNum, setNewNum] = useState(true);

  const handleDigit = (d: string) => {
    if (newNum) {
      setDisplay(d === '.' ? '0.' : d);
      setNewNum(false);
    } else {
      if (d === '.' && display.includes('.')) return;
      setDisplay(display === '0' && d !== '.' ? d : display + d);
    }
  };

  const handleOp = (nextOp: string) => {
    const cur = parseFloat(display);
    if (prevVal !== null && op && !newNum) {
      const res = calculate(prevVal, cur, op);
      setDisplay(String(res));
      setPrevVal(res);
    } else {
      setPrevVal(cur);
    }
    setOp(nextOp);
    setNewNum(true);
  };

  const calculate = (a: number, b: number, operation: string): number => {
    switch (operation) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (prevVal === null || !op) return;
    const cur = parseFloat(display);
    const res = calculate(prevVal, cur, op);
    setDisplay(String(res));
    setPrevVal(null);
    setOp(null);
    setNewNum(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevVal(null);
    setOp(null);
    setNewNum(true);
  };

  const handleBackspace = () => {
    if (display.length <= 1) {
      setDisplay('0');
      setNewNum(true);
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handlePercent = () => {
    const val = parseFloat(display) / 100;
    setDisplay(String(val));
  };

  const handleNegate = () => {
    const val = parseFloat(display) * -1;
    setDisplay(String(val));
  };

  return (
    <div className="h-full max-w-sm mx-auto p-4 flex flex-col justify-center">
      {/* Display Screen */}
      <div className="p-4 mb-3 bg-[#0b101c] border border-cyan-900/40 rounded-2xl flex flex-col items-end shadow-inner">
        <span className="text-xs text-zinc-500 font-mono h-4">
          {prevVal !== null ? `${prevVal} ${op}` : ''}
        </span>
        <span className="text-3xl sm:text-4xl font-mono font-bold text-cyan-300 truncate w-full text-right tracking-tight">
          {display}
        </span>
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-4 gap-2 text-sm font-semibold select-none">
        <button onClick={handleClear} className="p-3.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-rose-400">C</button>
        <button onClick={handleBackspace} className="p-3.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300">⌫</button>
        <button onClick={handlePercent} className="p-3.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300">%</button>
        <button onClick={() => handleOp('÷')} className="p-3.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 text-lg">÷</button>

        <button onClick={() => handleDigit('7')} className="p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100">7</button>
        <button onClick={() => handleDigit('8')} className="p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100">8</button>
        <button onClick={() => handleDigit('9')} className="p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100">9</button>
        <button onClick={() => handleOp('×')} className="p-3.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 text-lg">×</button>

        <button onClick={() => handleDigit('4')} className="p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100">4</button>
        <button onClick={() => handleDigit('5')} className="p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100">5</button>
        <button onClick={() => handleDigit('6')} className="p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100">6</button>
        <button onClick={() => handleOp('-')} className="p-3.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 text-lg">−</button>

        <button onClick={() => handleDigit('1')} className="p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100">1</button>
        <button onClick={() => handleDigit('2')} className="p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100">2</button>
        <button onClick={() => handleDigit('3')} className="p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100">3</button>
        <button onClick={() => handleOp('+')} className="p-3.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 text-lg">+</button>

        <button onClick={handleNegate} className="p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300">±</button>
        <button onClick={() => handleDigit('0')} className="p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100">0</button>
        <button onClick={() => handleDigit('.')} className="p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100">.</button>
        <button onClick={handleEquals} className="p-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg shadow-[0_0_15px_rgba(0,240,255,0.4)]">=</button>
      </div>
    </div>
  );
};

/* =========================================================================
   2. CLOCK APP
   ========================================================================= */
const ClockApp: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'clock' | 'stopwatch' | 'timer'>('clock');

  // Stopwatch state
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 mins
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: any;
    if (swRunning) {
      interval = setInterval(() => setSwTime(prev => prev + 10), 10);
    }
    return () => clearInterval(interval);
  }, [swRunning]);

  useEffect(() => {
    let interval: any;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const formatSw = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col p-6 max-w-xl mx-auto items-center justify-center space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#0b101c] border border-cyan-900/40 rounded-xl">
        <button
          onClick={() => setActiveTab('clock')}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'clock' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-zinc-400'}`}
        >
          World Clock
        </button>
        <button
          onClick={() => setActiveTab('stopwatch')}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'stopwatch' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-zinc-400'}`}
        >
          Stopwatch
        </button>
        <button
          onClick={() => setActiveTab('timer')}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'timer' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-zinc-400'}`}
        >
          Timer
        </button>
      </div>

      {activeTab === 'clock' && (
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="p-8 rounded-3xl bg-[#0b101c] border border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.1)]">
            <span className="text-5xl sm:text-6xl font-bold font-mono text-cyan-300 tracking-wider">
              {time.toLocaleTimeString([], { hour12: false })}
            </span>
            <p className="text-sm font-medium text-zinc-400 mt-2">
              {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
            {[
              { city: 'Toshkent', diff: 'UTC+5', h: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
              { city: 'London', diff: 'UTC+1', h: new Date(Date.now() - 4 * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
              { city: 'New York', diff: 'UTC-4', h: new Date(Date.now() - 9 * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
              { city: 'Tokyo', diff: 'UTC+9', h: new Date(Date.now() + 4 * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
            ].map(w => (
              <div key={w.city} className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 block">{w.city}</span>
                <span className="text-base font-bold font-mono text-zinc-200">{w.h}</span>
                <span className="text-[10px] text-zinc-500 font-mono block">{w.diff}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'stopwatch' && (
        <div className="flex flex-col items-center space-y-6">
          <div className="text-6xl font-mono font-bold text-emerald-400 tracking-wider">
            {formatSw(swTime)}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSwRunning(!swRunning)}
              className="px-6 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-medium text-sm flex items-center gap-2 hover:bg-emerald-500/30"
            >
              {swRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {swRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => { setSwRunning(false); setSwTime(0); }}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>
      )}

      {activeTab === 'timer' && (
        <div className="flex flex-col items-center space-y-6">
          <div className="text-6xl font-mono font-bold text-amber-400 tracking-wider">
            {formatTimer(timerSeconds)}
          </div>
          <div className="flex items-center gap-2">
            {[60, 300, 600, 1500].map(s => (
              <button
                key={s}
                onClick={() => { setTimerSeconds(s); setTimerRunning(false); }}
                className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-mono"
              >
                {s / 60}m
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="px-6 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-medium text-sm flex items-center gap-2 hover:bg-amber-500/30"
            >
              {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {timerRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => { setTimerRunning(false); setTimerSeconds(300); }}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   3. CMD / TERMINAL APP
   ========================================================================= */
const CmdApp: React.FC<{ language: SupportedLanguage }> = () => {
  const [lines, setLines] = useState<string[]>([
    'Microsoft Windows [Version 10.0.19045.3803]',
    '(c) Microsoft Corporation. Barcha huquqlar himoyalangan.',
    '',
    'C:\\Users\\JARVIS> JARVIS Local Shell initialized. Type "help" or "dir".',
    '',
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [lines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const newLines = [...lines, `C:\\Users\\JARVIS> ${cmd}`];

    switch (cmd.toLowerCase()) {
      case 'help':
        newLines.push(
          'Mavjud Windows CMD buyruqlari:',
          '  dir          - Joriy katalogdagi fayllar ro‘yxati',
          '  cls          - Ekranni tozalash',
          '  ver          - Windows operatsion tizim versiyasi',
          '  date         - Joriy sana',
          '  time         - Joriy tizim vaqti',
          '  ipconfig     - Lokal tarmoq adapteri ma\'lumotlari',
          '  systeminfo   - Tizim konfiguratsiyasi',
          '  calc         - Kalkulyator dasturi',
          '  notepad      - Notepad matn muharriri',
          '  exit         - Oynani yopish'
        );
        break;

      case 'dir':
        newLines.push(
          ' Volume in drive C has no label.',
          ' Volume Serial Number is 4A8B-9E12',
          '',
          ' Directory of C:\\Users\\JARVIS',
          '',
          '28/09/2026  10:00 AM    <DIR>          .',
          '28/09/2026  10:00 AM    <DIR>          ..',
          '28/09/2026  10:15 AM    <DIR>          Desktop',
          '28/09/2026  10:15 AM    <DIR>          Documents',
          '28/09/2026  10:15 AM    <DIR>          Downloads',
          '28/09/2026  10:15 AM    <DIR>          Pictures',
          '28/09/2026  10:15 AM    <DIR>          Videos',
          '28/09/2026  11:30 AM               142 hujjat.txt',
          '28/09/2026  11:45 AM             1,024 jarvis_cleaner.bat',
          '               2 File(s)          1,166 bytes',
          '               5 Dir(s)  124,582,912,000 bytes free'
        );
        break;

      case 'cls':
        setLines([]);
        setInput('');
        return;

      case 'ver':
        newLines.push('Microsoft Windows [Version 10.0.19045.3803]');
        break;

      case 'date':
        newLines.push(`The current date is: ${new Date().toLocaleDateString()}`);
        break;

      case 'time':
        newLines.push(`The current time is: ${new Date().toLocaleTimeString()}`);
        break;

      case 'ipconfig':
        newLines.push(
          'Windows IP Configuration',
          '',
          'Ethernet adapter Local Area Connection:',
          '   Connection-specific DNS Suffix  . : localdomain',
          '   IPv4 Address. . . . . . . . . . . : 192.168.1.105',
          '   Subnet Mask . . . . . . . . . . . : 255.255.255.0',
          '   Default Gateway . . . . . . . . . : 192.168.1.1'
        );
        break;

      case 'systeminfo':
        newLines.push(
          'Host Name:                 JARVIS-WORKSTATION',
          'OS Name:                   Microsoft Windows 10 Pro',
          'OS Version:                10.0.19045 N/A Build 19045',
          'System Type:               x64-based PC',
          'Processor(s):              8 Logical Processors Installed',
          'Total Physical Memory:     16,384 MB',
          'Local Agent Mode:          100% Offline (No Cloud LLM)'
        );
        break;

      default:
        newLines.push(`'${cmd}' is not recognized as an internal or external command, operable program or batch file.`);
    }

    setLines(newLines);
    setInput('');
  };

  return (
    <div className="h-full bg-black p-4 font-mono text-xs sm:text-sm text-zinc-200 overflow-y-auto flex flex-col justify-between">
      <div className="space-y-1">
        {lines.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap">{line}</div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-1 mt-2 shrink-0">
        <span className="text-zinc-400">C:\Users\JARVIS&gt;</span>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
          className="flex-1 bg-transparent text-white outline-none border-none font-mono text-sm"
        />
      </form>
    </div>
  );
};

/* =========================================================================
   4. NOTEPAD APP
   ========================================================================= */
const NotepadApp: React.FC = () => {
  const [content, setContent] = useState('JARVIS v1.4 Offline Matn Muharriri.\n\nBu yerda matnlarni yozish, tahrirlash va ".txt" fayl sifatida kompyuterga saqlash mumkin.');
  const [fileName, setFileName] = useState('Untitled.txt');

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
    link.click();
  };

  return (
    <div className="h-full flex flex-col bg-[#0c101c]">
      {/* Menu Bar */}
      <div className="h-8 px-3 bg-[#080d17] border-b border-cyan-900/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-zinc-300">
          <button onClick={handleDownload} className="hover:text-cyan-400 flex items-center gap-1 font-medium">
            <Download className="w-3.5 h-3.5" /> Saqlash (Download)
          </button>
          <button onClick={() => setContent('')} className="hover:text-rose-400 flex items-center gap-1 font-medium">
            <Trash2 className="w-3.5 h-3.5" /> Tozalash
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={fileName}
            onChange={e => setFileName(e.target.value)}
            className="px-2 py-0.5 rounded bg-black/50 border border-zinc-800 text-[11px] font-mono text-cyan-300 w-32 focus:outline-none"
          />
        </div>
      </div>

      {/* Editor Textarea */}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        className="flex-1 p-4 bg-transparent text-zinc-100 font-mono text-xs sm:text-sm resize-none focus:outline-none leading-relaxed"
        placeholder="Bu yerga yozing..."
      />

      {/* Status Bar */}
      <div className="h-6 px-4 bg-[#080d17] border-t border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
        <span>Belgilar: {content.length} | So‘zlar: {content.trim() ? content.trim().split(/\s+/).length : 0}</span>
        <span>UTF-8 • Windows (CRLF)</span>
      </div>
    </div>
  );
};

/* =========================================================================
   5. PAINT APP
   ========================================================================= */
const PaintApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#00f0ff');
  const [brushSize, setBrushSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#070b14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `paint_${Date.now()}.png`;
    a.click();
  };

  const colors = ['#00f0ff', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#a855f7', '#ffffff', '#070b14'];

  return (
    <div className="h-full flex flex-col bg-[#080d18]">
      {/* Paint Tools Bar */}
      <div className="p-2.5 bg-[#0a0f1c] border-b border-cyan-900/30 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-mono text-[11px]">Rang:</span>
          {colors.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className={`w-6 h-6 rounded-full border-2 transition-all ${color === c ? 'border-white scale-110' : 'border-black/50'}`}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            className="w-6 h-6 rounded bg-transparent cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-mono text-[11px]">O‘lcham:</span>
          {[2, 4, 8, 16].map(s => (
            <button
              key={s}
              onClick={() => setBrushSize(s)}
              className={`px-2 py-0.5 rounded text-xs font-mono ${brushSize === s ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-zinc-800 text-zinc-400'}`}
            >
              {s}px
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Tozalash
          </button>
          <button
            onClick={saveCanvas}
            className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" /> Saqlash (PNG)
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-3 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          className="border border-cyan-900/40 rounded-xl shadow-lg cursor-crosshair max-w-full max-h-full"
        />
      </div>
    </div>
  );
};

/* =========================================================================
   6. FILE EXPLORER APP
   ========================================================================= */
const ExplorerApp: React.FC = () => {
  const [currentFolder, setCurrentFolder] = useState<'Desktop' | 'Documents' | 'Downloads' | 'Pictures' | 'Videos'>('Desktop');
  const filesMap = StorageService.getFiles();
  const list = filesMap[currentFolder] || [];

  return (
    <div className="h-full flex flex-col md:flex-row bg-[#080d18] text-xs">
      {/* Left Navigation Tree */}
      <div className="w-full md:w-48 bg-[#0a0f1c] border-b md:border-b-0 md:border-r border-cyan-900/30 p-3 space-y-1 shrink-0">
        <span className="text-[10px] uppercase font-bold text-zinc-500 px-2 block mb-2 font-mono">Tezkor Papkalar</span>
        {(['Desktop', 'Documents', 'Downloads', 'Pictures', 'Videos'] as const).map(folder => (
          <button
            key={folder}
            onClick={() => setCurrentFolder(folder)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${currentFolder === folder ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'}`}
          >
            <Folder className="w-4 h-4 text-amber-400" />
            <span className="font-medium">{folder}</span>
          </button>
        ))}
      </div>

      {/* Main Files View */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Breadcrumb Path Bar */}
        <div className="h-10 px-4 bg-[#090e1a] border-b border-cyan-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-zinc-400 text-xs">
            <span>This PC</span>
            <span>&gt;</span>
            <span className="text-cyan-300 font-bold">{currentFolder}</span>
          </div>
          <span className="text-zinc-500 font-mono text-[11px]">{list.length} ta element</span>
        </div>

        {/* Files Grid */}
        <div className="flex-1 p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 content-start">
          {list.length === 0 ? (
            <div className="col-span-full py-12 text-center text-zinc-500 font-mono">
              Bu papka bo‘sh
            </div>
          ) : (
            list.map((f, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-500/40 hover:bg-cyan-950/20 transition-all flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="font-medium text-zinc-200 text-xs truncate w-full">{f.name}</span>
                <span className="text-[10px] text-zinc-500 font-mono mt-0.5">{f.sizeFormatted || '1 KB'}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   7. TASK MANAGER APP
   ========================================================================= */
const TaskManagerApp: React.FC = () => {
  const [processes, setProcesses] = useState([
    { id: 1, name: 'JARVIS Local Desktop Agent', cpu: 1.2, mem: 48, status: 'Active' },
    { id: 2, name: 'Windows Explorer (explorer.exe)', cpu: 0.8, mem: 62, status: 'Active' },
    { id: 3, name: 'System Core & Kernel', cpu: 0.4, mem: 120, status: 'Running' },
    { id: 4, name: 'Desktop Window Manager (dwm.exe)', cpu: 1.5, mem: 38, status: 'Active' },
    { id: 5, name: 'Google Chrome Sandbox', cpu: 2.1, mem: 180, status: 'Active' },
    { id: 6, name: 'Audio Service (audiodg.exe)', cpu: 0.1, mem: 16, status: 'Running' },
  ]);

  const endProcess = (id: number) => {
    setProcesses(processes.filter(p => p.id !== id));
  };

  return (
    <div className="h-full flex flex-col bg-[#070b14] text-xs">
      {/* Top Resource Meters */}
      <div className="p-4 bg-[#0a0f1c] border-b border-cyan-900/30 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'CPU Usage', val: '4.8%', sub: '8 Cores • 3.2 GHz', color: 'text-cyan-400' },
          { label: 'Memory (RAM)', val: '4.2 / 16 GB', sub: '26% ishlatilmoqda', color: 'text-emerald-400' },
          { label: 'Disk (NVMe SSD)', val: '1.2 MB/s', sub: '100% sog‘lom', color: 'text-amber-400' },
          { label: 'Network', val: '0.0 Mbps', sub: '100% Oflayn Sandbox', color: 'text-blue-400' },
        ].map((m, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-black/40 border border-zinc-800">
            <span className="text-[10px] text-zinc-400 block font-mono">{m.label}</span>
            <span className={`text-base font-bold font-mono ${m.color}`}>{m.val}</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">{m.sub}</span>
          </div>
        ))}
      </div>

      {/* Process Table */}
      <div className="flex-1 overflow-y-auto p-4">
        <table className="w-full text-left font-mono">
          <thead>
            <tr className="border-b border-zinc-800 text-[11px] text-zinc-400">
              <th className="pb-2 font-medium">Jarayon Nomi</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">CPU %</th>
              <th className="pb-2 font-medium">Xotira (MB)</th>
              <th className="pb-2 font-medium text-right">Amal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {processes.map(p => (
              <tr key={p.id} className="hover:bg-cyan-950/15 transition-colors">
                <td className="py-2.5 text-zinc-200 font-sans font-medium">{p.name}</td>
                <td className="py-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {p.status}
                  </span>
                </td>
                <td className="py-2.5 text-zinc-300">{p.cpu}%</td>
                <td className="py-2.5 text-zinc-300">{p.mem} MB</td>
                <td className="py-2.5 text-right">
                  <button
                    onClick={() => endProcess(p.id)}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px] transition-colors border border-rose-500/20"
                  >
                    End Task
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================================================
   8. SETTINGS APP
   ========================================================================= */
const SettingsApp: React.FC<{ language: SupportedLanguage }> = ({ language }) => {
  const settings = StorageService.getSettings();

  return (
    <div className="h-full p-6 overflow-y-auto max-w-3xl mx-auto space-y-6 text-xs">
      <div>
        <h2 className="text-base font-bold text-zinc-100">Windows Parametrlari (Settings)</h2>
        <p className="text-zinc-400 text-xs">Tizim va interfeys sozlamalari</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <span className="font-bold text-zinc-200 block text-sm">🖥️ Tizim Ma’lumotlari</span>
          <p className="text-zinc-400">Windows 10/11 Pro 64-bit</p>
          <p className="text-zinc-400">Agent: {settings.agentName} (v1.4 LOCAL)</p>
          <p className="text-zinc-400">Rejim: 100% Oflayn va Xavfsiz</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <span className="font-bold text-zinc-200 block text-sm">🌐 Tanlangan Til</span>
          <p className="text-cyan-300 font-mono text-sm capitalize">{language === 'uz' ? 'O‘zbekcha' : language === 'ru' ? 'Русский' : 'English'}</p>
          <p className="text-zinc-500 text-[11px]">Interfeys va buyruqlar uchun to‘liq faol</p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   9. BROWSER APP
   ========================================================================= */
const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState('https://www.google.com');

  const bookmarks = [
    { title: 'Google', url: 'https://www.google.com' },
    { title: 'YouTube', url: 'https://www.youtube.com' },
    { title: 'Telegram Web', url: 'https://web.telegram.org' },
    { title: 'Wikipedia', url: 'https://www.wikipedia.org' },
    { title: 'GitHub', url: 'https://github.com' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#080d18]">
      {/* Browser Bar */}
      <div className="p-3 bg-[#0a0f1c] border-b border-cyan-900/30 flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/50 border border-cyan-900/40 text-xs">
          <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="flex-1 bg-transparent text-zinc-200 font-mono outline-none"
          />
        </div>
        <button
          onClick={() => window.open(url, '_blank')}
          className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-1 font-medium"
        >
          <span>Ochish</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bookmarks */}
      <div className="px-4 py-2 bg-[#090e1a] border-b border-zinc-800 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] text-zinc-500 font-mono">Xatcho‘plar:</span>
        {bookmarks.map(b => (
          <button
            key={b.title}
            onClick={() => setUrl(b.url)}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[11px] whitespace-nowrap"
          >
            {b.title}
          </button>
        ))}
      </div>

      {/* Simulated Browser Web View */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
        <Globe className="w-16 h-16 text-cyan-400/40 animate-pulse" />
        <div>
          <h3 className="text-base font-bold text-zinc-200">Lokal Windows Brauzeri</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm">
            Tashqi veb-sahifalar xavfsiz tarzda yangi tabda yoki standart Windows brauzerida ochiladi.
          </p>
        </div>
        <button
          onClick={() => window.open(url, '_blank')}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:bg-cyan-400"
        >
          <ExternalLink className="w-4 h-4" />
          Saytni Yangi Tabda Ochish
        </button>
      </div>
    </div>
  );
};

/* =========================================================================
   10. CONTROL PANEL APP
   ========================================================================= */
const ControlPanelApp: React.FC = () => {
  const items = [
    { title: 'Tizim va Xavfsizlik (System & Security)', desc: 'Windows xavfsizlik devori, zaxira nusxalash va yangilanishlar', icon: '🛡️' },
    { title: 'Tarmoq va Internet (Network)', desc: 'Lokal tarmoq holati, adapterlar va Wi-Fi parametrlari', icon: '🌐' },
    { title: 'Uskunalar va Ovoz (Hardware & Sound)', desc: 'Dinamiklar, mikrofon, printerlar va sichqoncha', icon: '🔊' },
    { title: 'Dasturlar va Komponentlar (Programs)', desc: 'O‘rnatilgan ilovalarni o‘chirish yoki o‘zgartirish', icon: '📦' },
    { title: 'Foydalanuvchi Hisoblari (User Accounts)', desc: 'Parol, hisob turi va xavfsizlik qoidalari', icon: '👤' },
    { title: 'Sana va Vaqt (Date & Time)', desc: 'Vaqt mintaqasi (Toshkent UTC+5) va mintaqaviy format', icon: '🕒' },
  ];

  return (
    <div className="h-full p-6 overflow-y-auto max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-base font-bold text-zinc-100">Boshqaruv Paneli (Control Panel)</h2>
        <p className="text-xs text-zinc-400">Windows kompyuteringizning barcha tizim vositalari</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-500/40 transition-all flex items-start gap-3.5 cursor-pointer">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <span className="font-semibold text-zinc-200 text-xs block">{item.title}</span>
              <span className="text-[11px] text-zinc-400 mt-0.5 block leading-relaxed">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   11. CALENDAR APP
   ========================================================================= */
const CalendarApp: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <div className="h-full p-6 max-w-md mx-auto flex flex-col justify-center space-y-4 text-xs select-none">
      {/* Month Navigator */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-cyan-300 font-mono">
          {monthNames[month]} {year}
        </h2>
        <div className="flex items-center gap-1.5">
          <button onClick={prevMonth} className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-sm">&lt;</button>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs">Bugun</button>
          <button onClick={nextMonth} className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-sm">&gt;</button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] text-zinc-500 font-semibold">
        <span>Yak</span><span>Dush</span><span>Sesh</span><span>Chor</span><span>Pay</span><span>Jum</span><span>Shan</span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center font-mono">
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = isCurrentMonth && today.getDate() === day;
          return (
            <div
              key={day}
              className={`
                p-2 rounded-xl transition-all font-medium
                ${isToday
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'text-zinc-200 hover:bg-zinc-800/80'}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};
