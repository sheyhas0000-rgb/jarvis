import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  Smartphone,
  Monitor,
  Apple,
  CheckCircle2,
  ExternalLink,
  QrCode,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Copy,
  Check,
  AlertTriangle,
  FileCode
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { downloadWindowsDesktopLauncher, downloadMacDesktopLauncher, downloadMacWebloc, downloadOfflineAppHtml } from '../utils/appDownloaders';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'windows' | 'mac' | 'android'>('windows');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const { isInstallable, isInstalled, install, isWindows, isMac, isAndroid } = usePWAInstall();

  // Auto set active tab based on user device if not set yet
  React.useEffect(() => {
    if (isAndroid) setActiveTab('android');
    else if (isMac) setActiveTab('mac');
    else if (isWindows) setActiveTab('windows');
  }, [isAndroid, isMac, isWindows]);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}&bgcolor=020617&color=22d3ee`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-2xl bg-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col my-auto"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border-b border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-['Chakra_Petch'] tracking-wide">
                  JARVIS Ilovasini Yuklab Olish & O'rnatish
                </h3>
                <p className="text-xs text-cyan-300/80">
                  Windows (.exe), macOS va Android uchun to'liq moslashgan
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Platform Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/50 p-2 gap-2">
            <button
              onClick={() => setActiveTab('windows')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'windows'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Windows (.exe)</span>
            </button>

            <button
              onClick={() => setActiveTab('android')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'android'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Android (Telefon)</span>
            </button>

            <button
              onClick={() => setActiveTab('mac')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'mac'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Apple className="w-4 h-4" />
              <span>macOS (Apple)</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[70vh]">
            {/* Google 403 Forbidden Helper Notice */}
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200/90 leading-relaxed space-y-1">
                <p className="font-bold text-amber-300">
                  Google 403 (Forbidden) xatosi chiqdimi?
                </p>
                <p>
                  Google AI Studio test havolasi faqat siz Google akkauntingiz bilan kirgan brauzerda ishlaydi. Begona brauzer (masalan, Edge) yoki yangi profil ochilganda Google 403 xatosini beradi.
                </p>
                <p className="text-amber-300 font-semibold">
                  Eng oson yechim: Quyidagi <span className="underline">"100% Oflayn Dastur (.html)"</span> tugmasini bosing yoki hozir o'tirgan Google Chrome brauzeringizda o'rnating!
                </p>
              </div>
            </div>

            {/* WINDOWS TAB */}
            {activeTab === 'windows' && (
              <div className="space-y-5">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                  <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <span className="font-bold text-cyan-300">Windows 10 va 11:</span> JARVIS mustaqil kompyuter dasturi sifatida ishlaydi. Brauzer panellarisiz, to'liq alohida oynada (.exe kabi) ish stoli ilovasi ko'rinishida ochiladi.
                  </div>
                </div>

                {/* Option 1: 100% OFFLINE ZERO-DEPENDENCY APP (No 403 error guaranteed!) */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-cyan-400" />
                        <span>1-Usul: 100% Oflayn Mustaqil Dasturni Yuklab Olish</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">403 XATOSISIZ</span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Hech qanday Google login yoki internet talab qilinmaydi. Faylni yuklab olib, 2 marta bossangiz — to'liq JARVIS ochiladi!
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => downloadOfflineAppHtml()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
                  >
                    <Download className="w-4.5 h-4.5" />
                    <span>JARVIS-Oflayn-Ilova.html ni yuklab olish (Tavsiya etiladi)</span>
                  </button>
                </div>

                {/* Option 2: 1-Click Native Desktop App Install via current browser */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-cyan-400" />
                        <span>2-Usul: Hozirgi brauzerda Ish stoli ilovasi qilib o'rnatish</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Start menyusi va Ish stolida JARVIS belgisi paydo bo'ladi
                      </p>
                    </div>
                  </div>

                  <div className="pt-1 flex flex-wrap gap-2">
                    {isInstallable ? (
                      <button
                        onClick={() => install()}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>BRAUZERDA O'RNATISH (1 TUGMA BILAN)</span>
                      </button>
                    ) : (
                      <div className="text-xs text-slate-300 bg-slate-800/80 p-3 rounded-lg w-full">
                        <p className="font-semibold text-cyan-300 mb-1">
                          💡 Google Chrome brauzeringizda:
                        </p>
                        <p>
                          Manzil qatori (URL) ning o'ng tomonidagi <strong className="text-white">"O'rnatish" (Kompyutercha belgisi)</strong> tugmasini bosing yoki brauzer menyusidan <strong className="text-white">"Uch nuqta (⋮)" ➔ "Ilovalar" / "Saqlash va ulashish" ➔ "JARVIS ni o'rnatish"</strong> ni tanlang.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Option 3: Direct .bat launcher */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-slate-400" />
                    <span>3-Usul: Windows Ish stoli yorlig'i skripti (.bat)</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ish stolingizda JARVIS yorlig'ini hosil qiladi va Google Chrome orqali to'g'ri ochadi:
                  </p>

                  <button
                    onClick={() => downloadWindowsDesktopLauncher(currentUrl)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>JARVIS-Desktop-Ishga-Tushirish.bat ni yuklab olish</span>
                  </button>
                </div>
              </div>
            )}

            {/* ANDROID TAB */}
            {activeTab === 'android' && (
              <div className="space-y-5">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                  <Smartphone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <span className="font-bold text-emerald-300">Android Telefon va Planshetlar:</span> JARVIS to'liq Android APK/PWA mobil dasturi sifatida o'rnatiladi, telefoningiz asosiy ekraniga o'z logotipi bilan chiqadi va oflayn rejimda ham ochiladi.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* QR Code */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center flex flex-col items-center">
                    <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-cyan-400" />
                      Telefon kamerasini qarating:
                    </p>
                    <div className="p-2 rounded-xl bg-slate-950 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] mb-3">
                      <img
                        src={qrApiUrl}
                        alt="JARVIS Android QR Code"
                        className="w-36 h-36 rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <button
                      onClick={handleCopyUrl}
                      className="flex items-center gap-1 text-[11px] text-cyan-300 hover:text-cyan-200"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUrl ? 'Havola nusxalandi!' : 'Havoladan nusxa olish'}</span>
                    </button>
                  </div>

                  {/* Android Install Guide */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-100">
                      Telefonga o'rnatish qadamlari:
                    </h4>
                    <ol className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold shrink-0 mt-0.5">1</span>
                        <span>Telefonda Google Chrome brauzerida ushbu sahifani oching.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold shrink-0 mt-0.5">2</span>
                        <span>Brauzerning yuqori o'ng burchagidagi <strong className="text-white">uch nuqta (⋮)</strong> menyusini bosing.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold shrink-0 mt-0.5">3</span>
                        <span><strong className="text-cyan-300">"Ilovani o'rnatish"</strong> (yoki <strong>"Bosh ekranga qo'shish"</strong>) tugmasini tanlang.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold shrink-0 mt-0.5">4</span>
                        <span>Ilova telefoningiz ilovalar ro'yxatida to'liq mobil dastur sifatida saqlanadi!</span>
                      </li>
                    </ol>

                    {isInstallable ? (
                      <button
                        onClick={() => install()}
                        className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>ANDROIDGA O'RNATISH</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => downloadOfflineAppHtml()}
                        className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 font-bold text-xs transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>JARVIS-Oflayn-Ilova.html ni telefonga yuklab olish</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MACOS TAB */}
            {activeTab === 'mac' && (
              <div className="space-y-5">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40">
                  <Apple className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <span className="font-bold text-purple-300">Apple macOS Qo'llab-quvvatlash:</span> MacBook va iMac kompyuterlarida JARVIS to'liq ovozli rejimda, mahalliy fayllar yaratish va veb xizmatlarni (YouTube, Telegram va h.k.) ochish imkoniyatiga ega.
                  </div>
                </div>

                {/* 1. Offline Single-file App for Mac (Guaranteed 0 errors) */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-purple-400" />
                        <span>1-Usul: Mac uchun 100% Oflayn Ilova (.html)</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">403 XATOSISIZ</span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Mac-da Safari yoki Google Chrome orqali to'g'ridan-to'g'ri 2 marta bosish bilan ishlaydi. Hech qanday terminal yoki ruxsat talab qilinmaydi!
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => downloadOfflineAppHtml()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all cursor-pointer"
                  >
                    <Download className="w-4.5 h-4.5" />
                    <span>JARVIS-Oflayn-Ilova.html ni Mac-ga yuklab olish (Tavsiya etiladi)</span>
                  </button>
                </div>

                {/* 2. Native macOS .webloc shortcut */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-purple-400" />
                      <span>2-Usul: macOS Desktop & Dock Yorlig'i (.webloc)</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">Native Mac</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Mac-ning rasmiy yorliq formati. Yuklab olgach, Ish stolingizda yoki Dock-da saqlab, bir bosishda ochishingiz mumkin.
                    </p>
                  </div>

                  <button
                    onClick={() => downloadMacWebloc(currentUrl)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/40 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>JARVIS-Mac.webloc ni yuklab olish</span>
                  </button>
                </div>

                {/* 3. Safari Add to Dock */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-purple-400" />
                    <span>3-Usul: Safari orqali Dock-ga qo'shish (macOS Sonoma / Ventura)</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Safari menyusida: <strong className="text-white">Fayl (File) ➔ "Dock-ga qo'shish..." (Add to Dock...)</strong> ni tanlang. JARVIS to'g'ridan-to'g'ri Launchpad va Dock-ga alohida Mac dasturi kabi o'rnatiladi.
                  </p>
                </div>

                {/* 4. Terminal Launcher Script */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-slate-400" />
                    <span>4-Usul: Mac Terminal Launcher skripti (.command)</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Mac kompyuterida avtomatik ishga tushiruvchi skript. Karantin cheklovlarini avtomatik tozalaydi.
                  </p>
                  <button
                    onClick={() => downloadMacDesktopLauncher(currentUrl)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>JARVIS-Mac.command ni yuklab olish</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              100% bepul va viruslardan xoli
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
            >
              Yopish
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
