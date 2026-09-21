import React from 'react';
import { Bell, CheckCircle2, ShieldCheck, Sparkles, Terminal, HardDrive } from 'lucide-react';

export const Updates: React.FC = () => {
  const versions = [
    {
      version: 'v1.2.0',
      tag: 'Hozirgi barqaror versiya',
      current: true,
      date: 'Mart 2026',
      changes: [
        { title: '100% Oflayn Local Desktop Agent', desc: 'Barcha tashqi AI/LLM integratsiyalari butunlay chiqarib tashlandi. Tizim internetga ulanmasdan, faqat lokal rule-based command parser orqali ishlaydi.' },
        { title: 'Xavfsiz Whitelist va Permission Tizimi', desc: 'Kompyuterni o‘chirish, qayta ishga tushirish yoki fayllarni o‘chirish kabi xavfli amallarda foydalanuvchidan oldindan tasdiq so‘rash joriy qilindi.' },
        { title: 'Yangi Lokal Sidebar', desc: 'Yangi chat, Sozlamalar, Chatlar, So‘nggi chatlar, Pluginlar, Loyihalar, Yangilanishlar, Profil menyulari bilan to‘liq modernizatsiya qilindi.' },
        { title: 'Modulli Pluginlar', desc: 'Browser Plugin, File Plugin, Windows Plugin, System Plugin va Automation Plugin lokal ravishda ulandi.' },
        { title: 'Chat Seanslari Xotirasi', desc: 'Har bir seans avtomatik nomlanadi, lokal saqlanadi, qidiriladi va guruhlanadi.' },
      ],
    },
    {
      version: 'v1.1.0',
      date: 'Fevral 2026',
      changes: [
        { title: 'Windows Explorer integratsiyasi', desc: 'Downloads, Desktop, Documents papkalari bilan ishlash qo‘shildi.' },
        { title: 'Batch optimizatsiya skripti', desc: 'Windows keshini tozalash (%temp%, DNS flush) skript generatori ishga tushirildi.' },
      ],
    },
    {
      version: 'v1.0.0',
      date: 'Yanvar 2026',
      changes: [
        { title: 'Dastlabki prototip', desc: 'O‘zbek tilidagi ovozli va yozma yordamchi arxitekturasi.' },
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col p-6 max-w-3xl mx-auto overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-cyan-200 flex items-center gap-2">
            <Bell className="w-6 h-6 text-cyan-400" />
            Yangilanishlar va Versiyalar
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            JARVIS Local Desktop Agentining oflayn versiyalar jurnali
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          Oflayn Rejim Faol
        </div>
      </div>

      {/* Banner */}
      <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
        <div className="text-xs text-cyan-200">
          <strong>Lokal Tizim:</strong> Siz eng so‘nggi <span className="font-mono text-cyan-300">v1.2.0</span> versiyasidasiz. Yangilanishlar avtonom tarzda lokal fayl tizimida saqlanadi.
        </div>
      </div>

      {/* Versions List */}
      <div className="space-y-6">
        {versions.map((ver, idx) => (
          <div 
            key={ver.version}
            className={`
              p-5 rounded-2xl border transition-all
              ${ver.current 
                ? 'bg-[#0c121e] border-cyan-500/40 shadow-[0_0_25px_rgba(0,240,255,0.08)]' 
                : 'bg-[#090e17] border-zinc-800/80 opacity-80'}
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-base font-bold text-zinc-100 font-mono">
                  {ver.version}
                </span>
                {ver.tag && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-medium">
                    {ver.tag}
                  </span>
                )}
              </div>
              <span className="text-xs text-zinc-500 font-mono">{ver.date}</span>
            </div>

            <div className="space-y-3">
              {ver.changes.map((ch, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-200">{ch.title}: </span>
                    <span className="text-zinc-400">{ch.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
