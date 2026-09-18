import React, { useState } from 'react';
import { Download, Smartphone, Monitor, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenFullModal?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onOpenFullModal }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Windows Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
        title="Ilovani kompyuter yoki telefoningizga o'rnatish"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{isAndroid ? "Androidga o'rnatish" : "Ilovani o'rnatish"}</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40 text-xs font-semibold transition-all cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>iOS-ga o'rnatish</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-cyan-500/40 p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-100 font-['Chakra_Petch']">
                  iPhone / iPad-ga o'rnatish
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed space-y-2">
                1. Safari pastki panelidagi <strong className="text-cyan-300">Ulashish (Share)</strong> tugmasini bosing.<br />
                2. Ro'yxatdan pastga tushib, <strong className="text-cyan-300">"Bosh ekranga qo'shish" (Add to Home Screen)</strong> ni tanlang.<br />
                3. JARVIS o'z belgisi bilan telefoningiz ekraniga o'rnatiladi!
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-cyan-500 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors"
              >
                Tushundim
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
