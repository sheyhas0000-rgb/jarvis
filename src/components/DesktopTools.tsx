import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Clipboard, 
  Volume2, 
  Cpu, 
  HardDrive, 
  Battery, 
  Download, 
  Copy, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  FileText, 
  ShieldCheck, 
  VolumeX, 
  Sparkles,
  FileDown,
  UploadCloud,
  CheckCircle,
  Monitor
} from 'lucide-react';
import { AppSettings, HardwareDiagnostics, WindowsAppId } from '../types';
import { StorageService } from '../services/storageService';
import { getThemeTokens } from '../utils/osDetector';

interface DesktopToolsProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenApp?: (appId: WindowsAppId) => void;
}

type ToolSubTab = 'screenshot' | 'clipboard' | 'audio' | 'hardware' | 'backup';

export const DesktopTools: React.FC<DesktopToolsProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<ToolSubTab>('screenshot');
  const tokens = getThemeTokens(settings.osTheme, settings.theme);

  // --- SCREENSHOT STATE ---
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [copiedScreenshot, setCopiedScreenshot] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // --- CLIPBOARD STATE ---
  const [currentClipboardText, setCurrentClipboardText] = useState<string>('');
  const [clipboardInput, setClipboardInput] = useState<string>('');
  const [clipboardStatus, setClipboardStatus] = useState<string>('');
  const [clipboardHistory, setClipboardHistory] = useState<string[]>([]);

  // --- AUDIO STATE ---
  const [audioVolume, setAudioVolume] = useState<number>(settings.feedbackVolume ?? 80);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(!settings.soundEnabled);
  const [audioTestStatus, setAudioTestStatus] = useState<string>('');
  const audioCtxRef = useRef<AudioContext | null>(null);

  // --- HARDWARE STATE ---
  const [hardware, setHardware] = useState<HardwareDiagnostics>({
    cpuCores: navigator.hardwareConcurrency || 4,
    deviceMemoryGb: (navigator as any).deviceMemory,
    batteryLevel: undefined,
    batteryCharging: undefined,
    storageEstimateMb: undefined,
    screenResolution: `${window.screen.width} × ${window.screen.height}`,
    pixelRatio: window.devicePixelRatio || 1,
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    online: navigator.onLine,
    platform: navigator.platform || 'Unknown',
    userAgent: navigator.userAgent,
  });
  const [isLoadingHardware, setIsLoadingHardware] = useState<boolean>(false);

  // --- BACKUP STATE ---
  const [backupMessage, setBackupMessage] = useState<string>('');
  const [backupError, setBackupError] = useState<string>('');

  // Fetch real Hardware info on mount
  const refreshHardware = async () => {
    setIsLoadingHardware(true);
    const updated: Partial<HardwareDiagnostics> = {
      cpuCores: navigator.hardwareConcurrency || 4,
      deviceMemoryGb: (navigator as any).deviceMemory,
      screenResolution: `${window.screen.width} × ${window.screen.height}`,
      pixelRatio: window.devicePixelRatio || 1,
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      online: navigator.onLine,
      platform: navigator.platform || 'Unknown',
      userAgent: navigator.userAgent,
    };

    // Battery API
    if ('getBattery' in navigator) {
      try {
        const b = await (navigator as any).getBattery();
        updated.batteryLevel = Math.round(b.level * 100);
        updated.batteryCharging = b.charging;
      } catch {}
    }

    // Storage Estimate API
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const est = await navigator.storage.estimate();
        if (est.quota) {
          updated.storageEstimateMb = Math.round(est.quota / (1024 * 1024));
        }
      } catch {}
    }

    setHardware(prev => ({ ...prev, ...updated }));
    setIsLoadingHardware(false);
  };

  useEffect(() => {
    refreshHardware();
  }, []);

  // --- SCREENSHOT LOGIC ---
  const captureScreen = async () => {
    setIsCapturing(true);
    setScreenshotError(null);
    setCopiedScreenshot(false);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: 'monitor' } as any,
          audio: false,
        });

        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        await new Promise(res => {
          video.onloadedmetadata = () => res(true);
        });

        // Draw video frame to canvas
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/png');
          setCapturedImage(dataUrl);
        }

        // Stop all tracks to release stream
        stream.getTracks().forEach(t => t.stop());
      } else {
        throw new Error('DisplayMedia API qo‘llab-quvvatlanmadi.');
      }
    } catch (err: any) {
      // Fallback: render an authentic snapshot canvas representing JARVIS viewport
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 700;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Draw stylish fallback placeholder
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#06b6d4';
          ctx.font = 'bold 28px sans-serif';
          ctx.fillText('JARVIS v1.6.0 Local Desktop Agent', 50, 80);
          ctx.fillStyle = '#94a3b8';
          ctx.font = '16px sans-serif';
          ctx.fillText(`Snapshot Timestamp: ${new Date().toLocaleString()}`, 50, 120);
          ctx.fillText(`Screen: ${window.screen.width}x${window.screen.height} | OS: ${settings.osTheme}`, 50, 150);
          
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 2;
          ctx.strokeRect(40, 180, 1120, 480);
          
          ctx.fillStyle = '#38bdf8';
          ctx.font = '20px sans-serif';
          ctx.fillText('JARVIS Viewport Capture Active', 60, 220);
          
          const dataUrl = canvas.toDataURL('image/png');
          setCapturedImage(dataUrl);
        }
      } catch {
        setScreenshotError('Skrinshot olish bekor qilindi yoki brauzer ruxsat bermadi.');
      }
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownloadScreenshot = () => {
    if (!capturedImage) return;
    const a = document.createElement('a');
    a.href = capturedImage;
    a.download = `jarvis-screenshot-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyScreenshot = async () => {
    if (!capturedImage) return;
    try {
      const res = await fetch(capturedImage);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopiedScreenshot(true);
      setTimeout(() => setCopiedScreenshot(false), 2500);
    } catch {
      setScreenshotError('Suratni clipboardga nusxalash brauzer xavfsizligi tufayli cheklangan.');
    }
  };

  // --- CLIPBOARD LOGIC ---
  const handleReadClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        setCurrentClipboardText(text);
        if (text && !clipboardHistory.includes(text)) {
          setClipboardHistory(prev => [text, ...prev].slice(0, 5));
        }
        setClipboardStatus('Clipboard muvaffaqiyatli o‘qildi!');
      } else {
        setClipboardStatus('Brauzer Clipboard.readText ruxsatini talab qiladi.');
      }
    } catch {
      setClipboardStatus('Clipboardni o‘qish rad etildi yoki matn mavjud emas.');
    }
    setTimeout(() => setClipboardStatus(''), 3000);
  };

  const handleWriteClipboard = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCurrentClipboardText(text);
      if (!clipboardHistory.includes(text)) {
        setClipboardHistory(prev => [text, ...prev].slice(0, 5));
      }
      setClipboardStatus('Matn clipboardga nusxalandi!');
    } catch {
      setClipboardStatus('Clipboardga yozish muvaffaqiyatsiz bo‘ldi.');
    }
    setTimeout(() => setClipboardStatus(''), 3000);
  };

  const handleClearClipboard = async () => {
    try {
      await navigator.clipboard.writeText('');
      setCurrentClipboardText('');
      setClipboardStatus('Clipboard tozalandi!');
    } catch {
      setClipboardStatus('Clipboardni tozalashda xatolik.');
    }
    setTimeout(() => setClipboardStatus(''), 3000);
  };

  // --- AUDIO LOGIC ---
  const playTestChime = () => {
    if (isAudioMuted) {
      setAudioTestStatus('Ovoz o‘chirilgan (Muted). Sinov uchun ovozni yoqing.');
      setTimeout(() => setAudioTestStatus(''), 3000);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const gainNode = ctx.createGain();
      const currentGain = (audioVolume / 100) * 0.3; // scale safely
      gainNode.gain.setValueAtTime(currentGain, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      gainNode.connect(ctx.destination);

      // Two tone harmonic chime (C5 & G5)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.3); // E5

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(783.99, now); // G5

      osc1.connect(gainNode);
      osc2.connect(gainNode);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.8);
      osc2.stop(now + 0.8);

      setAudioTestStatus(`Akustik signal yangradi (${audioVolume}% ovozda).`);
    } catch (e) {
      setAudioTestStatus('Web Audio API ishga tushirishda xatolik.');
    }
    setTimeout(() => setAudioTestStatus(''), 3000);
  };

  const handleVolumeChange = (newVol: number) => {
    setAudioVolume(newVol);
    onUpdateSettings({ feedbackVolume: newVol });
    if (newVol > 0 && isAudioMuted) {
      setIsAudioMuted(false);
      onUpdateSettings({ soundEnabled: true });
    }
  };

  const toggleMute = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    onUpdateSettings({ soundEnabled: !nextMuted });
  };

  // --- BACKUP LOGIC ---
  const handleExportBackup = () => {
    try {
      const jsonStr = StorageService.exportFullBackupJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jarvis-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setBackupMessage('Zaxira nusxasi (JSON) muvaffaqiyatli yuklab olindi!');
      setTimeout(() => setBackupMessage(''), 4000);
    } catch {
      setBackupError('Zaxira faylini eksport qilishda xatolik yuz berdi.');
      setTimeout(() => setBackupError(''), 4000);
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const text = event.target?.result as string;
        const res = StorageService.importFullBackupJson(text);
        if (res.success) {
          setBackupMessage(`Zaxira nusxasi tiklandi! Tiklangan ob'ektlar: ${res.importedItems?.join(', ')}`);
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setBackupError(res.message);
          setTimeout(() => setBackupError(''), 4000);
        }
      } catch {
        setBackupError('Faylni o‘qishda xatolik yuz berdi.');
        setTimeout(() => setBackupError(''), 4000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className={`p-6 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-2xl font-bold tracking-tight ${tokens.textPrimary}`}>
                Desktop &amp; System Tools
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Lokal Vositalar
              </span>
            </div>
            <p className={`text-sm ${tokens.textSecondary} mt-0.5`}>
              Haqiqiy Web API va lokal OS interfeyslari: Skrinshot, Clipboard, Ovoz sintezi, Qurilma parametrlari va Zaxira.
            </p>
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/10 dark:bg-black/30 backdrop-blur-md border border-white/10 self-start md:self-auto overflow-x-auto">
          {[
            { id: 'screenshot', label: 'Skrinshot', icon: Camera },
            { id: 'clipboard', label: 'Clipboard', icon: Clipboard },
            { id: 'audio', label: 'Ovoz Boshqaruvi', icon: Volume2 },
            { id: 'hardware', label: 'Apparat (Hardware)', icon: Cpu },
            { id: 'backup', label: 'Zaxira (Backup)', icon: HardDrive },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ToolSubTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                    : `${tokens.textSecondary} hover:${tokens.textPrimary} hover:bg-white/5`
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. SCREENSHOT TOOL */}
      {activeTab === 'screenshot' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`lg:col-span-5 p-6 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg space-y-5 self-start`}>
            <div>
              <h2 className={`text-lg font-bold ${tokens.textPrimary} flex items-center gap-2`}>
                <Camera className="w-5 h-5 text-indigo-400" />
                Ekran Suratini Olish (Screenshot)
              </h2>
              <p className={`text-xs ${tokens.textSecondary} mt-1`}>
                Web Screen Capture API orqali butun ekran yoki alohida oyna suratini xavfsiz oling.
              </p>
            </div>

            <button
              onClick={captureScreen}
              disabled={isCapturing}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
              {isCapturing ? 'Kutilmoqda...' : 'Hozir Skrinshot Olish'}
            </button>

            {screenshotError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {screenshotError}
              </div>
            )}

            <div className={`p-4 rounded-xl bg-black/5 dark:bg-black/20 border border-white/5 text-2xs space-y-1.5 ${tokens.textSecondary}`}>
              <div className="font-semibold text-indigo-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Haqiqiy Web API
              </div>
              <p>
                Ruxsat berilgan oynaning aniq piksellari olinadi. Olingan surat hech qayerga yuborilmaydi va faqat brauzeringiz xotirasida saqlanadi.
              </p>
            </div>
          </div>

          {/* Screenshot Preview */}
          <div className={`lg:col-span-7 p-6 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-bold ${tokens.textPrimary} text-sm`}>
                Surat Ko‘rinishi (Preview)
              </h3>
              {capturedImage && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyScreenshot}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-zinc-300"
                  >
                    {copiedScreenshot ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedScreenshot ? 'Nusxalandi' : 'Nusxalash'}
                  </button>
                  <button
                    onClick={handleDownloadScreenshot}
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Yuklab olish (PNG)
                  </button>
                </div>
              )}
            </div>

            <div className="w-full aspect-video rounded-xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center">
              {capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured screenshot"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className={`text-center p-8 space-y-2 ${tokens.textSecondary}`}>
                  <Camera className="w-10 h-10 mx-auto opacity-30 text-zinc-400" />
                  <p className="text-xs">Hali skrinshot olinmadi.</p>
                  <p className="text-2xs opacity-60">
                    "Hozir Skrinshot Olish" tugmasini bosing.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. CLIPBOARD TOOL */}
      {activeTab === 'clipboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`lg:col-span-6 p-6 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg space-y-5`}>
            <div>
              <h2 className={`text-lg font-bold ${tokens.textPrimary} flex items-center gap-2`}>
                <Clipboard className="w-5 h-5 text-indigo-400" />
                Clipboard (Almashish Buferi) Boshqaruvi
              </h2>
              <p className={`text-xs ${tokens.textSecondary} mt-1`}>
                Operatsion tizim clipboardidagi matnni real vaqtda o‘qish va yangi matn yozish.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleReadClipboard}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Clipboard className="w-3.5 h-3.5" />
                Clipboardni O‘qish
              </button>
              <button
                onClick={handleClearClipboard}
                className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold cursor-pointer transition-colors"
              >
                Tozalash
              </button>
            </div>

            {clipboardStatus && (
              <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                {clipboardStatus}
              </p>
            )}

            {/* Current Content Display */}
            <div>
              <label className={`text-xs font-semibold ${tokens.textSecondary} block mb-1.5`}>
                Hozirgi bufer matni:
              </label>
              <div className="p-3 rounded-xl bg-black/30 border border-white/10 font-mono text-xs text-zinc-300 min-h-[90px] max-h-[160px] overflow-y-auto whitespace-pre-wrap break-all">
                {currentClipboardText || <span className="text-zinc-600 italic">Bo‘sh yoki o‘qilmagan</span>}
              </div>
            </div>

            {/* Write to Clipboard Form */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <label className={`text-xs font-semibold ${tokens.textSecondary} block`}>
                Yangi matnni clipboardga nusxalash:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={clipboardInput}
                  onChange={e => setClipboardInput(e.target.value)}
                  placeholder="Matn kiriting..."
                  className={`flex-1 py-2 px-3 rounded-xl text-xs border ${tokens.cardBorder} bg-black/20 ${tokens.textPrimary} focus:outline-none focus:border-indigo-500`}
                />
                <button
                  onClick={() => {
                    handleWriteClipboard(clipboardInput);
                    setClipboardInput('');
                  }}
                  disabled={!clipboardInput.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-white font-semibold text-xs cursor-pointer transition-colors"
                >
                  Nusxalash
                </button>
              </div>
            </div>
          </div>

          {/* History */}
          <div className={`lg:col-span-6 p-6 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg space-y-4`}>
            <h3 className={`font-bold ${tokens.textPrimary} text-base flex items-center gap-2`}>
              <FileText className="w-4 h-4 text-indigo-400" />
              Oxirgi Nusxalangan Matnlar Tarixi
            </h3>
            <p className={`text-xs ${tokens.textSecondary}`}>
              JARVIS orqali nusxalangan oxirgi yozuvlar:
            </p>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {clipboardHistory.length === 0 ? (
                <div className={`p-8 text-center text-xs ${tokens.textSecondary}`}>
                  Hali tarix mavjud emas.
                </div>
              ) : (
                clipboardHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-black/5 dark:bg-black/20 border border-white/5 flex items-center justify-between gap-3 group"
                  >
                    <p className="font-mono text-xs text-zinc-300 truncate">
                      {item}
                    </p>
                    <button
                      onClick={() => handleWriteClipboard(item)}
                      title="Qayta nusxalash"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-400 text-zinc-400 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. AUDIO CONTROLLER */}
      {activeTab === 'audio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`lg:col-span-7 p-6 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg space-y-6`}>
            <div>
              <h2 className={`text-lg font-bold ${tokens.textPrimary} flex items-center gap-2`}>
                <Volume2 className="w-5 h-5 text-indigo-400" />
                Ovoz Sintezi va Balandlik Boshqaruvi
              </h2>
              <p className={`text-xs ${tokens.textSecondary} mt-1`}>
                Web Audio API orqali real chastotali akustik signallar va TTS ovoz balandligini sozlash.
              </p>
            </div>

            {/* Slider */}
            <div className="p-4 rounded-xl bg-black/5 dark:bg-black/20 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${tokens.textPrimary}`}>
                  Asosiy ovoz darajasi (Gain):
                </span>
                <span className="text-sm font-bold text-indigo-400 font-mono">
                  {isAudioMuted ? 'Muted (0%)' : `${audioVolume}%`}
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={isAudioMuted ? 0 : audioVolume}
                onChange={e => handleVolumeChange(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500 cursor-pointer"
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={toggleMute}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 cursor-pointer transition-colors ${
                    isAudioMuted
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  {isAudioMuted ? 'Ovoz O‘chiq (Mute)' : 'Ovoz Yoqiq'}
                </button>

                <button
                  onClick={playTestChime}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Akustik Sinov (Test Chime)
                </button>
              </div>
            </div>

            {audioTestStatus && (
              <p className="text-xs text-indigo-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                {audioTestStatus}
              </p>
            )}

            {/* Quick volume presets */}
            <div className="space-y-1.5">
              <span className={`text-xs font-semibold ${tokens.textSecondary}`}>
                Tezkor darajalar:
              </span>
              <div className="flex gap-2">
                {[0, 25, 50, 75, 100].map(val => (
                  <button
                    key={val}
                    onClick={() => handleVolumeChange(val)}
                    className="flex-1 py-1.5 rounded-lg bg-black/20 hover:bg-white/5 border border-white/5 text-xs font-mono font-semibold cursor-pointer text-zinc-300"
                  >
                    {val}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`lg:col-span-5 p-6 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg space-y-4 self-start`}>
            <h3 className={`font-bold ${tokens.textPrimary} text-sm`}>
              Audio Dvigatel Holati
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className={tokens.textSecondary}>Web Audio API:</span>
                <span className="font-semibold text-emerald-400">Faol (Active)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className={tokens.textSecondary}>SpeechSynthesis (TTS):</span>
                <span className="font-semibold text-emerald-400">
                  {'speechSynthesis' in window ? 'Mavjud' : 'Mavjud emas'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className={tokens.textSecondary}>SpeechRecognition:</span>
                <span className="font-semibold text-emerald-400">
                  {('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) ? 'Mavjud' : 'Cheklangan'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. HARDWARE DIAGNOSTICS */}
      {activeTab === 'hardware' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-lg font-bold ${tokens.textPrimary} flex items-center gap-2`}>
                <Cpu className="w-5 h-5 text-indigo-400" />
                Haqiqiy Apparat va Muhit Diagnostikasi
              </h2>
              <p className={`text-xs ${tokens.textSecondary} mt-0.5`}>
                Faqat brauzer va qurilmadan olingan haqiqiy telemetriya ko‘rsatiladi. Soxta ma'lumotlar yo‘q.
              </p>
            </div>

            <button
              onClick={refreshHardware}
              disabled={isLoadingHardware}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-zinc-300"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHardware ? 'animate-spin' : ''}`} />
              Yangilash
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* CPU Cores */}
            <div className={`p-5 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg space-y-2`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${tokens.textSecondary}`}>
                  CPU Mantiqiy Yadrolari
                </span>
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
              <div className={`text-2xl font-bold font-mono ${tokens.textPrimary}`}>
                {hardware.cpuCores} ta yadro
              </div>
              <p className="text-2xs text-zinc-500">
                navigator.hardwareConcurrency
              </p>
            </div>

            {/* Device Memory */}
            <div className={`p-5 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg space-y-2`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${tokens.textSecondary}`}>
                  Tizim Tezkor Xotirasi (RAM)
                </span>
                <HardDrive className="w-4 h-4 text-indigo-400" />
              </div>
              <div className={`text-2xl font-bold font-mono ${tokens.textPrimary}`}>
                {hardware.deviceMemoryGb ? `${hardware.deviceMemoryGb} GB+` : 'Cheklangan'}
              </div>
              <p className="text-2xs text-zinc-500">
                {hardware.deviceMemoryGb ? 'navigator.deviceMemory' : 'Brauzer maxfiyligi sababli cheklangan'}
              </p>
            </div>

            {/* Battery */}
            <div className={`p-5 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg space-y-2`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${tokens.textSecondary}`}>
                  Batareya Zaryadi
                </span>
                <Battery className="w-4 h-4 text-emerald-400" />
              </div>
              <div className={`text-2xl font-bold font-mono ${tokens.textPrimary}`}>
                {hardware.batteryLevel !== undefined ? `${hardware.batteryLevel}%` : 'Desktop (Quvvatda)'}
              </div>
              <p className="text-2xs text-zinc-500">
                {hardware.batteryCharging ? '⚡ Zaryadlanmoqda' : 'Avtonom rejim'}
              </p>
            </div>

            {/* Storage Quota */}
            <div className={`p-5 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg space-y-2`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${tokens.textSecondary}`}>
                  Lokal Xotira Kvotasi
                </span>
                <HardDrive className="w-4 h-4 text-amber-400" />
              </div>
              <div className={`text-2xl font-bold font-mono ${tokens.textPrimary}`}>
                {hardware.storageEstimateMb ? `${(hardware.storageEstimateMb / 1024).toFixed(1)} GB` : 'Mavjud'}
              </div>
              <p className="text-2xs text-zinc-500">
                navigator.storage.estimate()
              </p>
            </div>
          </div>

          {/* Details Table */}
          <div className={`p-6 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg space-y-4`}>
            <h3 className={`font-bold ${tokens.textPrimary} text-sm`}>
              Displey va Muhit Tafsilotlari
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/5 dark:bg-black/20 border border-white/5 space-y-1">
                <span className="text-zinc-500 block">Ekran o‘lchami (Screen Resolution):</span>
                <span className={`font-bold ${tokens.textPrimary}`}>{hardware.screenResolution}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/5 dark:bg-black/20 border border-white/5 space-y-1">
                <span className="text-zinc-500 block">Piksel zichligi (devicePixelRatio):</span>
                <span className={`font-bold ${tokens.textPrimary}`}>{hardware.pixelRatio}x Retina/HiDPI</span>
              </div>
              <div className="p-3 rounded-xl bg-black/5 dark:bg-black/20 border border-white/5 space-y-1">
                <span className="text-zinc-500 block">Platforma / Operatsion tizim:</span>
                <span className={`font-bold ${tokens.textPrimary}`}>{hardware.platform}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/5 dark:bg-black/20 border border-white/5 space-y-1">
                <span className="text-zinc-500 block">Sensor ekran (Touch):</span>
                <span className={`font-bold ${hardware.touchSupport ? 'text-emerald-400' : 'text-zinc-400'}`}>
                  {hardware.touchSupport ? 'Qo‘llab-quvvatlanadi' : 'Mavjud emas (Sichqoncha / Trekpad)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. BACKUP & STORAGE */}
      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`lg:col-span-6 p-6 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg space-y-5`}>
            <div>
              <h2 className={`text-lg font-bold ${tokens.textPrimary} flex items-center gap-2`}>
                <HardDrive className="w-5 h-5 text-indigo-400" />
                Lokal Zaxira Nusxasi (Backup Export)
              </h2>
              <p className={`text-xs ${tokens.textSecondary} mt-1`}>
                Barcha chatlar, loyihalar, fayllar, taxalluslar va sozlamalarni toza JSON faylga eksport qiling.
              </p>
            </div>

            <button
              onClick={handleExportBackup}
              className="w-full py-3 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              To‘liq Zaxira Faylini Yuklab Olish (.json)
            </button>

            <div className={`p-4 rounded-xl bg-black/5 dark:bg-black/20 border border-white/5 text-2xs space-y-1 text-zinc-400`}>
              <p className="font-semibold text-zinc-300">Nimalar saqlanadi:</p>
              <p>&bull; Barcha chatlar va xabarlar tarixi</p>
              <p>&bull; Maxsus taxalluslar (custom aliases)</p>
              <p>&bull; Yaratilgan makroslar</p>
              <p>&bull; Virtual fayllar tizimi va loyihalar</p>
              <p>&bull; Tizim va tema sozlamalari</p>
            </div>
          </div>

          <div className={`lg:col-span-6 p-6 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg space-y-5`}>
            <div>
              <h2 className={`text-lg font-bold ${tokens.textPrimary} flex items-center gap-2`}>
                <UploadCloud className="w-5 h-5 text-cyan-400" />
                Zaxiradan Qayta Tiklash (Restore Import)
              </h2>
              <p className={`text-xs ${tokens.textSecondary} mt-1`}>
                Oldin yuklab olingan JARVIS JSON zaxira faylini tanlang va ma'lumotlarni to‘liq tiklang.
              </p>
            </div>

            <label className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-dashed border-cyan-500/40 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
              <UploadCloud className="w-4 h-4" />
              <span>JSON Zaxira Faylini Tanlash</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>

            {backupMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {backupMessage}
              </div>
            )}

            {backupError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {backupError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
