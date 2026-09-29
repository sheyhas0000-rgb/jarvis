import React from 'react';
import { Bell, ShieldCheck, Sparkles, Terminal, HardDrive, CheckCircle2, Globe, Cpu, Layers } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { normalizeLang } from '../utils/i18n';

export const Updates: React.FC = () => {
  const settings = StorageService.getSettings();
  const lang = normalizeLang(settings.language);

  const versions = [
    {
      version: 'v1.4.0',
      tag: lang === 'en' ? 'JARVIS v1.4 Latest Update' : lang === 'ru' ? 'JARVIS v1.4 Новое обновление' : 'JARVIS v1.4 Yangi yangilanish',
      current: true,
      date: lang === 'en' ? 'September 2026' : lang === 'ru' ? 'Сентябрь 2026' : 'Sentabr 2026',
      changes: lang === 'en' ? [
        { title: 'Multi-Language Support (UZ, EN, RU)', desc: 'Complete localization for Uzbek, English, and Russian applied across the entire interface, navigation, commands, and speech recognition.' },
        { title: 'Expanded 11 Windows Applications', desc: 'Added Calculator, Clock & Timer, CMD / Terminal, Notepad, MS Paint, File Explorer, Task Manager, Settings, Browser, Control Panel, and Calendar.' },
        { title: 'Natural Command Invocations', desc: 'Direct commands supported in all 3 languages (e.g., "open calculator", "open cmd", "open clock", "open notepad", "open paint", "open file explorer", "open task manager", "open settings", "open browser", "open control panel", "open calendar").' },
        { title: 'Interactive Windows Desktop Modals', desc: 'Built-in authentic Windows acrylic modals with interactive Calculator, Clock/Stopwatch, CMD terminal shell, Notepad editor, Paint canvas, Task Manager monitoring, and Calendar.' },
        { title: 'Full v1.3 Compatibility Preserved', desc: 'All existing functions kept intact: standard folder browsing, temp file cleaner, audio volume/mute, PC lock, shutdown/restart, diagnostics, and virtual filesystem.' },
        { title: 'Cyberpunk HUD UI & v1.4 Badges', desc: 'Polished top bar with quick 1-click language switcher (UZ, EN, RU), quick app launch dock, and v1.4 LOCAL AGENT indicator.' },
        { title: 'Strictly Offline Architecture', desc: 'Zero AI, zero external APIs, zero cloud backends. 100% deterministic local desktop rule execution.' },
      ] : lang === 'ru' ? [
        { title: 'Мультиязычность (UZ, EN, RU)', desc: 'Полная поддержка узбекского, английского и русского языков для всего интерфейса, меню, команд и голосового распознавания речи.' },
        { title: 'Расширенный запуск 11 приложений', desc: 'Добавлены: Калькулятор, Часы и Таймер, Командная строка (CMD), Блокнот (Notepad), MS Paint, Проводник (Explorer), Диспетчер задач, Параметры Windows, Браузер, Панель управления и Календарь.' },
        { title: 'Естественные команды запуска', desc: 'Поддержка прямых команд на 3 языках (например: "open calculator", "open cmd", "open clock", "open notepad", "открыть проводник", "открыть диспетчер задач", "открыть настройки").' },
        { title: 'Интерактивные окна приложений Windows', desc: 'Встроенные интерактивные окна: рабочий калькулятор, секундомер/часы, интерактивный терминал CMD, редактор Notepad, полотно Paint, мониторинг ресурсов и календарь.' },
        { title: 'Сохранены все функции v1.3', desc: 'Все возможности v1.3 сохранены: очистка кэша, папки Downloads/Desktop, звук/mute, блокировка ПК, выключение, статус системы и буфер обмена.' },
        { title: 'Обновленный дизайн и значок v1.4', desc: 'Быстрый переключатель языка (UZ, EN, RU) в шапке, панель быстрого доступа к приложениям и значок v1.4 LOCAL AGENT.' },
        { title: '100% Локальный режим', desc: 'Никаких сторонних ИИ, API ключей или облачных серверов. Полная работа через локальный Windows движок.' },
      ] : [
        { title: 'Ko‘p tillilik (Uzbek, English, Russian)', desc: 'Tanlangan til (O‘zbekcha, English, Русский) butun interfeys, navigatsiya, xabarlar va ovozli/yozma buyruqlarga to‘liq tatbiq etildi.' },
        { title: '11 ta Lokal Windows Ilovalari', desc: 'Kalkulyatordan tashqari Clock (Soat), CMD (Terminal), Notepad (Bloknot), Paint, File Explorer, Task Manager, Settings, Browser, Control Panel va Calendar qo‘shildi.' },
        { title: 'Tabiiy Buyruqlar bilan Ochish', desc: '"open calculator", "open cmd", "open clock", "open notepad", "open paint", "open file explorer", "open task manager", "open settings", "open browser", "open control panel", "open calendar" buyruqlari har 3 tilda to‘liq ishlaydi.' },
        { title: 'Interaktiv Windows Darchalari', desc: 'Har bir ilova uchun interfeys ichida ishlovchi interaktiv Windows 11 darchasi: ishlovchi kalkulyator, soat/sekundomer, CMD buyruqlar satri, bloknot, rasm chizish, vazifalar dispetcheri va kalendar.' },
        { title: 'v1.3 ning Barcha Funksiyalari Saqlandi', desc: 'Fayllar tizimi, Downloads/Desktop papkalari, kesh tozalash, ovoz/mute, Lock PC, restart/shutdown, diagnostika va veb havolalar to‘liq saqlangan holda takomillashtirildi.' },
        { title: 'UI Yaxshilanishi va v1.4 Badge', desc: 'Tepada tezkor til tanlagich (UZ, EN, RU), tezkor ilovalar paneli va yangi v1.4 LOCAL AGENT yorlig‘i qo‘shildi.' },
        { title: '100% Oflayn va No-AI Arxitektura', desc: 'Hech qanday AI API, server yoki tashqi kalitlarsiz faqat kompyuterning lokal qoidalari orqali ishlaydi.' },
      ],
    },
    {
      version: 'v1.3.0',
      tag: 'v1.3 Barqaror yangilanish',
      current: false,
      date: 'Mart 2026',
      changes: [
        { title: 'Vaqt va Aniq Sana', desc: 'Joriy vaqt, hafta kuni, sana va Toshkent mintaqasi bo‘yicha to‘liq hisobot.' },
        { title: 'CPU, RAM va Batareya Statusi', desc: 'Haqiqiy xotira taqsimoti, protsessor yadrolari, batareya quvvat darajasi (%) va zaryadlash holati diagnostikasi.' },
        { title: 'Standart Windows Papkalari', desc: 'Downloads, Desktop, Documents, Pictures va Videos papkalarini bitta buyruq bilan Explorer orqali ochish.' },
        { title: 'Temporary Files Clean', desc: 'Windows vaqtinchalik fayllari (%temp%) va DNS keshini tozalovchi avtonom mexanizm.' },
        { title: 'Ovoz va Mute Boshqaruvi', desc: 'Ovoz balandligini aniq foizga sozlash (Volume 0-100%) hamda ovozni butunlay o‘chirish / yoqish (Mute toggle).' },
        { title: 'Lock PC, Restart va Shutdown', desc: 'Kompyuter ekranini bloklash (Lock Workstation) va xavfsiz tasdiq talab qiluvchi qayta yuklash / o‘chirish buyruqlari.' },
      ],
    },
    {
      version: 'v1.2.0',
      date: 'Mart 2026',
      changes: [
        { title: '100% Oflayn Local Desktop Agent', desc: 'Barcha tashqi AI/LLM integratsiyalari butunlay chiqarib tashlandi.' },
        { title: 'Xavfsiz Whitelist va Permission Tizimi', desc: 'Xavfli amallarda foydalanuvchidan oldindan tasdiq so‘rash joriy qilindi.' },
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col p-4 md:p-6 max-w-4xl mx-auto overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-cyan-200 flex items-center gap-2">
            <Bell className="w-6 h-6 text-cyan-400" />
            {lang === 'en' ? 'Updates & Version History' : lang === 'ru' ? 'Обновления и Версии' : 'Yangilanishlar va Versiyalar'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {lang === 'en' ? 'JARVIS Local Desktop Agent offline releases log' : lang === 'ru' ? 'Журнал офлайн версий JARVIS Local Desktop Agent' : 'JARVIS Local Desktop Agentining oflayn versiyalar jurnali'}
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          {lang === 'en' ? 'Offline Mode Active' : lang === 'ru' ? 'Офлайн Режим' : 'Oflayn Rejim Faol'}
        </div>
      </div>

      {/* Banner */}
      <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
        <div className="text-xs text-cyan-200">
          <strong>JARVIS v1.4:</strong> {lang === 'en' ? 'You are running the latest v1.4.0 release with 11 Windows applications and multi-language support (UZ, EN, RU).' : lang === 'ru' ? 'Вы используете версию v1.4.0 с поддержкой 11 приложений Windows и 3 языков (UZ, EN, RU).' : 'Siz eng so‘nggi v1.4.0 versiyasidasiz. 11 ta Windows ilovasi va 3 ta til (Uzbek, English, Russian) to‘liq faol.'}
        </div>
      </div>

      {/* Versions List */}
      <div className="space-y-6">
        {versions.map(ver => (
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
                {ver.current && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-medium">
                    {lang === 'en' ? 'CURRENT' : lang === 'ru' ? 'ТЕКУЩАЯ' : 'JORIY'}
                  </span>
                )}
              </div>
              <span className="text-xs text-zinc-400 font-mono">{ver.date}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ver.changes.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-black/30 border border-zinc-800/60 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 block">{item.title}</span>
                    <span className="text-[11px] text-zinc-400 leading-relaxed block mt-0.5">{item.desc}</span>
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
