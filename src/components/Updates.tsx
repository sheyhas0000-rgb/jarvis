import React from 'react';
import { Bell, ShieldCheck, Sparkles, Terminal, HardDrive, CheckCircle2, Globe, Cpu, Layers } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { normalizeLang } from '../utils/i18n';

export const Updates: React.FC = () => {
  const settings = StorageService.getSettings();
  const lang = normalizeLang(settings.language);

  const versions = [
    {
      version: 'v1.5.0',
      tag: lang === 'en' ? 'JARVIS v1.5 Latest Update' : lang === 'ru' ? 'JARVIS v1.5 Новое обновление' : 'JARVIS v1.5 Yangi yangilanish',
      current: true,
      date: lang === 'en' ? 'October 2026' : lang === 'ru' ? 'Октябрь 2026' : 'Oktabr 2026',
      changes: lang === 'en' ? [
        { title: 'Voice Commands (Speech Recognition)', desc: 'Added microphone button for voice recognition in Uzbek, English, and Russian matching selected language.' },
        { title: 'Text-to-Speech (TTS) Voice Responses', desc: 'JARVIS now speaks out responses aloud with toggle control in Settings and quick speaker toggle in header.' },
        { title: 'Command History Navigation', desc: 'Saved last 20 commands with seamless Arrow Up (↑) / Arrow Down (↓) keyboard recall in chat input.' },
        { title: 'Local Settings Persistence & Export', desc: 'Auto-saved settings restored upon application reopen, plus direct settings.json export/import support.' },
        { title: 'New Commands ("close <app>", "time", "date", "help")', desc: 'Added commands to close applications, query exact time and calendar date, and full help directory.' },
        { title: 'Smart Unknown Command Guidance', desc: 'Friendly unrecognized command handling that provides helpful suggestions and recommends typing "help".' },
        { title: 'Dark / Light Theme Switching', desc: '1-click switcher between futuristic Cyberpunk Dark and clean Modern Light interfaces.' },
        { title: 'Command Execution Log Panel', desc: 'Real-time sliding log drawer tracking every command with timestamp, execution status (OK/ERR), and category.' },
      ] : lang === 'ru' ? [
        { title: 'Голосовые команды (Speech Recognition)', desc: 'Добавлена кнопка микрофона с распознаванием речи на узбекском, английском и русском языках.' },
        { title: 'Синтез речи (Text-to-Speech)', desc: 'JARVIS озвучивает ответы голосом с возможностью включения/отключения в Настройках и шапке.' },
        { title: 'История команд (20 последних)', desc: 'Сохранение 20 последних команд и удобный вызов стрелками Вверх (↑) и Вниз (↓) в поле ввода.' },
        { title: 'Локальное сохранение (settings.json)', desc: 'Автоматическое сохранение настроек при перезапуске, а также экспорт/импорт файла settings.json.' },
        { title: 'Новые команды ("close <app>", "time", "date", "help")', desc: 'Закрытие приложений, запрос точного времени, даты и подробный каталог всех команд.' },
        { title: 'Понятные сообщения об ошибках', desc: 'При неизвестной команде выводятся полезные подсказки и рекомендация ввести "help".' },
        { title: 'Переключение тем (Dark / Light)', desc: 'Удобное переключение между темной темой и светлым интерфейсом в 1 клик.' },
        { title: 'Панель логов выполнения с временем', desc: 'Встроенная панель журналов с фиксацией времени выполнения каждой команды и статусом.' },
      ] : [
        { title: 'Ovozli buyruqlar (Speech Recognition)', desc: 'Mikrofon tugmasi qo‘shildi. O‘zbekcha, English va Rus tillaridagi ovozli buyruqlarni mukammal taniydi.' },
        { title: 'Matnli javob ovozi (Text-to-Speech)', desc: 'JARVIS javoblarini ovoz bilan aytadi. Sozlamalarda va sarlavhada yoqish/o‘chirish tugmasi mavjud.' },
        { title: 'Buyruqlar Tarixi (Oxirgi 20 ta)', desc: 'Oxirgi 20 ta buyruq saqlanadi. Yuqoriga (↑) va pastga (↓) strelka orqali qayta chaqirish mumkin.' },
        { title: 'Lokal Sozlamalar va settings.json', desc: 'Til, ovoz va boshqa parametrlar lokal saqlanadi va dastur qayta ochilganda tiklanadi. settings.json eksport/import mavjud.' },
        { title: 'Yangi buyruqlar ("close <ilova>", "time", "date", "help")', desc: 'Ilovalarni yopish, aniq vaqt va sana hamda barcha buyruqlar katalogi ("help") qo‘shildi.' },
        { title: 'Tushunarli Noma’lum Buyruq Xabari', desc: 'Noma’lum buyruq kiritilganda tushunarli tavsiyalar chiqadi va "help" ni taklif qiladi.' },
        { title: 'Tema almashtirish (Dark / Light)', desc: 'Header va sozlamalarda Dark HUD hamda Light interfeys o‘rtasida 1-bosish bilan almashish.' },
        { title: 'Buyruqlar Log Paneli (Vaqt bilan)', desc: 'Har bir buyruqning bajarilish vaqti va holatini (OK/ERR) ko‘rsatuvchi interaktiv log paneli.' },
      ],
    },
    {
      version: 'v1.4.0',
      tag: 'v1.4 Barqaror',
      current: false,
      date: 'Sentabr 2026',
      changes: [
        { title: 'Ko‘p tillilik (Uzbek, English, Russian)', desc: 'Tanlangan til butun interfeys, navigatsiya va buyruqlarga to‘liq tatbiq etildi.' },
        { title: '11 ta Lokal Windows Ilovalari', desc: 'Kalkulyator, Clock, CMD, Notepad, Paint, Explorer, Task Manager, Settings, Browser, Control Panel, Calendar.' },
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
          <strong>JARVIS v1.5:</strong> {lang === 'en' ? 'You are running the latest v1.5.0 release with speech recognition, TTS voice response, command history, and execution logs.' : lang === 'ru' ? 'Вы используете версию v1.5.0 с распознаванием речи, озвучкой TTS, историей команд и журналом логов.' : 'Siz eng so‘nggi v1.5.0 versiyasidasiz. Ovozli buyruqlar, TTS javob ovozi, buyruqlar tarixi va log paneli to‘liq faol.'}
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
