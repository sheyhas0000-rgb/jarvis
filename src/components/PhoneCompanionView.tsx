import React, { useState, useEffect } from 'react';
import { Smartphone, Download, QrCode, Check, Copy, Sparkles, Wifi, Mic, Zap, Shield, Share2, CheckCircle2 } from 'lucide-react';

interface PhoneCompanionViewProps {
  onOpenDownloadModal?: () => void;
  onRunSampleCommand?: (cmd: string) => void;
}

export const PhoneCompanionView: React.FC<PhoneCompanionViewProps> = ({
  onOpenDownloadModal,
  onRunSampleCommand,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as installed standalone app on phone
    const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isRunningStandalone);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
    } else if (onOpenDownloadModal) {
      onOpenDownloadModal();
    }
  };

  const appUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(appUrl)}&bgcolor=02-06-17&color=06-b6-d4`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="phone-companion-view" className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-3 space-y-4">
      {/* Hero Badge Banner */}
      <div className="relative p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-950 border border-cyan-500/30 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0">
              <Smartphone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-['Chakra_Petch']">
                  JARVIS Telefon Versiyasi
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                  {isStandalone ? '📱 O\'rnatilgan' : '⚡ 100% Moslashuvchan'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Har qanday smartfonga qolipdek tushadi • Ovozli boshqaruv • 100% Oflayn PWA
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Telefonga o'rnatish (1-klik)</span>
          </button>
        </div>
      </div>

      {/* Grid: Install Steps & QR Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step-by-step phone install card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-['Chakra_Petch']">
              Telefonda qanday o'rnatiladi?
            </h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300">
            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs shrink-0">
                1
              </span>
              <div>
                <p className="font-semibold text-slate-100">Android (Google Chrome):</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Brauzerning yuqori o'ng burchagidagi <strong className="text-cyan-300">⋮ (uch nuqta)</strong> menyusini bosing va <strong className="text-cyan-300">"Ilovani o'rnatish"</strong> (yoki "Bosh ekranga qo'shish") ni tanlang.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs shrink-0">
                2
              </span>
              <div>
                <p className="font-semibold text-slate-100">iPhone / iOS (Safari):</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pastdagi <Share2 className="w-3.5 h-3.5 inline text-indigo-300 mx-0.5" /> <strong className="text-indigo-300">Ulashish (Share)</strong> tugmasini bosing va <strong className="text-indigo-300">"Bosh ekranga qo'shish (Add to Home Screen)"</strong> ni bosing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-300">Natija:</p>
                <p className="text-xs text-slate-300 mt-0.5">
                  JARVIS telefoningiz ilovalari orasida mustaqil mobil dastur bo'lib paydo bo'ladi, brauzer qatori yo'qoladi va to'liq ekranda ochiladi!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code & Share Link Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <QrCode className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-['Chakra_Petch']">
              Telefon kamerasini qarating
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-3 max-w-xs">
            Telefonda ochish uchun kamera bilan ushbu QR kodni skanerlang:
          </p>

          <div className="p-2 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)] mb-3">
            <img
              src={qrApiUrl}
              alt="JARVIS Telefon QR Kodi"
              className="w-36 h-36 rounded-xl object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-medium text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Havola nusxalandi!' : 'Havoladan nusxa olish'}</span>
          </button>
        </div>
      </div>

      {/* Phone Features Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
            <Mic className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-200">Ovozli Buyruq</span>
          <span className="text-[11px] text-slate-400 mt-0.5">Telefonda mikrofondan gapiring</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
            <Wifi className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-200">100% Oflayn</span>
          <span className="text-[11px] text-slate-400 mt-0.5">Internetsiz ham ochiladi</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-200">Bir Zumda Yuklanadi</span>
          <span className="text-[11px] text-slate-400 mt-0.5">Qolipdek moslashuvchan</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-2">
            <Shield className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-200">Xavfsiz & Maxfiy</span>
          <span className="text-[11px] text-slate-400 mt-0.5">Fayllar o'z qurilmangizda</span>
        </div>
      </div>

      {/* Quick Test Commands on Mobile */}
      {onRunSampleCommand && (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-['Chakra_Petch'] mb-2.5">
            Telefonda tezkor sinab ko'rish:
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              "salom",
              "test.txt yarat",
              "fayllarni ko'rsat",
              "youtubega kir",
              "telegramga kir",
              "vaqt necha bo'ldi",
            ].map((cmd) => (
              <button
                key={cmd}
                onClick={() => onRunSampleCommand(cmd)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-cyan-950/80 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-slate-300 hover:text-cyan-300 transition-all cursor-pointer active:scale-95"
              >
                "{cmd}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
