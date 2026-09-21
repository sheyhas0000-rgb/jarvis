import React from 'react';
import { 
  Plug, 
  Globe, 
  Folder, 
  Terminal, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  ShieldCheck
} from 'lucide-react';
import { LocalPlugin } from '../types';

interface PluginsProps {
  plugins: LocalPlugin[];
  onTogglePlugin: (id: string) => void;
}

export const Plugins: React.FC<PluginsProps> = ({
  plugins,
  onTogglePlugin,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-6 h-6" />;
      case 'Folder': return <Folder className="w-6 h-6" />;
      case 'Terminal': return <Terminal className="w-6 h-6" />;
      case 'Cpu': return <Cpu className="w-6 h-6" />;
      case 'Zap': return <Zap className="w-6 h-6" />;
      default: return <Plug className="w-6 h-6" />;
    }
  };

  return (
    <div className="h-full flex flex-col p-6 max-w-4xl mx-auto overflow-y-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-cyan-200 flex items-center gap-2">
          <Plug className="w-6 h-6 text-cyan-400" />
          Lokal Pluginlar Boshqaruvi
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Barcha pluginlar 100% oflayn lokal tizim bilan ishlaydi. Hech qanday AI API yoki tashqi serverlarga murojaat qilinmaydi.
        </p>
      </div>

      {/* Plugins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plugins.map(plugin => {
          const isEnabled = plugin.enabled;

          return (
            <div
              key={plugin.id}
              className={`
                p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between
                ${isEnabled
                  ? 'bg-[#0c121e] border-cyan-900/40 hover:border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.05)]'
                  : 'bg-zinc-950/60 border-zinc-800/80 opacity-70'}
              `}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-11 h-11 rounded-xl flex items-center justify-center
                      ${isEnabled 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
                        : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}
                    `}>
                      {getIcon(plugin.icon)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                        {plugin.name}
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/40 text-cyan-400">
                          v{plugin.version}
                        </span>
                      </h3>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {plugin.category} • {plugin.commandsCount} ta buyruq
                      </span>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={() => onTogglePlugin(plugin.id)}
                    className="text-cyan-400 hover:text-cyan-300 transition-transform active:scale-95"
                    title={isEnabled ? "Pluginni o'chirish" : "Pluginni yoqish"}
                  >
                    {isEnabled ? (
                      <ToggleRight className="w-8 h-8 text-cyan-400" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-zinc-600" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {plugin.description}
                </p>
              </div>

              <div className="pt-3 border-t border-cyan-950/40 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  {isEnabled ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Faol</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-zinc-500">O‘chirilgan</span>
                    </>
                  )}
                </span>
                <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Local Whitelist
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guide / Help Section */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-blue-950/20 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.08)]">
        <h2 className="text-base font-bold text-cyan-200 flex items-center gap-2 mb-3">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          Pluginlardan qanday foydalaniladi?
        </h2>
        
        <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
          JARVIS tizimida har bir plugin ma’lum bir lokal soha uchun javobgardir. Agar biror pluginni o‘chirib qo‘ysangiz, unga tegishli buyruqlar xavfsizlik nuqtai nazaridan bajarilmaydi:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-black/40 border border-cyan-900/30">
            <span className="font-semibold text-cyan-300 block mb-1">🌐 Browser Plugin</span>
            <span className="text-zinc-400">
              Google Chrome, Microsoft Edge dasturlarini ochish, YouTube, Telegram Web va Google qidiruvlarini bir zumda brauzerda ochish uchun ishlatiladi.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-cyan-900/30">
            <span className="font-semibold text-cyan-300 block mb-1">📁 File Plugin</span>
            <span className="text-zinc-400">
              Kompyuterning Desktop, Downloads, Documents papkalarida matnli fayllar (.txt, .bat) yaratish, mavjud fayllarni ochib o‘qish yoki xavfsiz o‘chirish uchun xizmat qiladi.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-cyan-900/30">
            <span className="font-semibold text-cyan-300 block mb-1">💻 Windows Plugin</span>
            <span className="text-zinc-400">
              Windows operatsion tizimi buyruqlari (kompyuterni qulflash, qayta yuklash, o‘chirish va Explorer papkalarini ochish)ni to‘g‘ridan-to‘g‘ri boshqaradi.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-cyan-900/30">
            <span className="font-semibold text-cyan-300 block mb-1">⚙️ System Plugin</span>
            <span className="text-zinc-400">
              Kompyuter xotirasi (RAM), protsessor (CPU) holatini tekshirish, dinamik ovozini o‘zgartirish va ekranni skrinshot qilish amallarini bajaradi.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-cyan-900/30 md:col-span-2">
            <span className="font-semibold text-cyan-300 block mb-1">⚡ Automation Plugin</span>
            <span className="text-zinc-400">
              Vaqtinchalik kesh fayllarini tozalash (%temp%, Prefetch, DNS flush) va optimizatsiya skriptlarini bir tugma bilan bajaradi.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
