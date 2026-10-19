import React, { useState, useRef } from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Terminal, 
  Trash2, 
  Search,
  Sliders,
  ShieldCheck,
  Globe,
  Moon,
  Sun,
  Volume2,
  Download,
  Upload,
  Check,
  Laptop,
  Monitor,
  Smartphone,
  Sparkles,
  Cpu
} from 'lucide-react';
import { AppSettings, PermissionType, SupportedLanguage } from '../types';
import { ALL_COMMANDS_META } from '../commands/commandRegistry';
import { StorageService } from '../services/storageService';
import { TTSService } from '../services/ttsService';
import { t, normalizeLang } from '../utils/i18n';
import { detectOSInfo, getEffectiveOSType } from '../utils/osDetector';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onClearAllData: () => void;
  theme?: 'dark' | 'light';
  osTheme?: import('../types').ActiveOSType;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onUpdateSettings,
  onClearAllData,
  theme = 'dark',
  osTheme = 'windows',
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'permissions' | 'commands' | 'storage'>('general');
  const [commandSearch, setCommandSearch] = useState('');
  const [jsonExportSuccess, setJsonExportSuccess] = useState(false);
  const [jsonImportSuccess, setJsonImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lang = normalizeLang(settings.language);
  const strings = t(lang);
  const isLight = theme === 'light';

  const handlePermissionToggle = (type: PermissionType, field: 'enabled' | 'requireConfirmation') => {
    const updated = {
      ...settings,
      permissions: {
        ...settings.permissions,
        [type]: {
          ...settings.permissions[type],
          [field]: !settings.permissions[type][field],
        },
      },
    };
    onUpdateSettings(updated);
  };

  const filteredCommands = ALL_COMMANDS_META.filter(cmd => 
    cmd.name.toLowerCase().includes(commandSearch.toLowerCase()) ||
    cmd.example.toLowerCase().includes(commandSearch.toLowerCase()) ||
    cmd.keywords.some(k => k.toLowerCase().includes(commandSearch.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col p-4 md:p-6 max-w-4xl mx-auto overflow-y-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-cyan-200 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-cyan-400" />
          {strings.settings.title}
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          {strings.settings.subtitle}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-cyan-900/30 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${activeTab === 'general' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <Sliders className="w-4 h-4" />
          {strings.settings.tabGeneral}
        </button>

        <button
          onClick={() => setActiveTab('permissions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${activeTab === 'permissions' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <Shield className="w-4 h-4" />
          {strings.settings.tabPermissions}
        </button>

        <button
          onClick={() => setActiveTab('commands')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${activeTab === 'commands' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <Terminal className="w-4 h-4" />
          {strings.settings.tabCommands}
        </button>

        <button
          onClick={() => setActiveTab('storage')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${activeTab === 'storage' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <Trash2 className="w-4 h-4" />
          {strings.settings.tabStorage}
        </button>
      </div>

      {/* Tab: General */}
      {activeTab === 'general' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#0c121e] border border-cyan-900/30 space-y-4">
            <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              {strings.settings.tabGeneral}
            </h3>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{strings.settings.agentName}</label>
              <input
                type="text"
                value={settings.agentName}
                onChange={e => onUpdateSettings({ ...settings, agentName: e.target.value })}
                className="w-full max-w-sm px-3.5 py-2 rounded-xl bg-black/40 border border-cyan-900/40 text-sm text-cyan-300 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{strings.settings.language}</label>
              <div className="flex flex-wrap gap-2.5 max-w-md">
                {[
                  { id: 'uz', label: '🇺🇿 O‘zbekcha', sub: 'Uzbek' },
                  { id: 'en', label: '🇬🇧 English', sub: 'English' },
                  { id: 'ru', label: '🇷🇺 Русский', sub: 'Russian' },
                ].map(item => {
                  const isSelected = normalizeLang(settings.language) === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onUpdateSettings({ ...settings, language: item.id as any })}
                      className={`
                        flex-1 min-w-[120px] p-3 rounded-xl border text-left transition-all
                        ${isSelected 
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
                          : 'bg-black/40 border-zinc-800 text-zinc-300 hover:border-zinc-700'}
                      `}
                    >
                      <span className="font-semibold text-xs block">{item.label}</span>
                      <span className="text-[10px] text-zinc-500 block mt-0.5">{item.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* OS Concept Theme Selector (Auto / macOS / Windows / Android) */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-200">{strings.settings.osTheme}</label>
                  <span className="text-[11px] text-zinc-400 block">{strings.settings.osThemeDesc}</span>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono flex items-center gap-1.5 self-start sm:self-auto shadow-sm">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{strings.settings.osDetectedLabel} <strong>{detectOSInfo().detectedOSName}</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {/* Auto Button */}
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, osTheme: 'auto' })}
                  className={`
                    p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group
                    ${settings.osTheme === 'auto'
                      ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                      : 'bg-black/40 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-black/60'}
                  `}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    {settings.osTheme === 'auto' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/30 text-cyan-300 font-mono font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-xs block">{strings.settings.osThemeAuto}</span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">
                    {detectOSInfo().detectedOSName}
                  </span>
                </button>

                {/* macOS 27 Button */}
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, osTheme: 'macos' })}
                  className={`
                    p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group
                    ${settings.osTheme === 'macos'
                      ? 'bg-blue-500/15 border-blue-400 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.25)]'
                      : 'bg-black/40 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-black/60'}
                  `}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="p-1.5 rounded-lg bg-blue-950 border border-blue-500/30 text-blue-400">
                      <Laptop className="w-4 h-4" />
                    </span>
                    {settings.osTheme === 'macos' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/30 text-blue-300 font-mono font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-xs block">{strings.settings.osThemeMac}</span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">
                    Liquid Glass & Traffic Lights
                  </span>
                </button>

                {/* Windows 12 Button */}
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, osTheme: 'windows' })}
                  className={`
                    p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group
                    ${settings.osTheme === 'windows'
                      ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                      : 'bg-black/40 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-black/60'}
                  `}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                      <Monitor className="w-4 h-4" />
                    </span>
                    {settings.osTheme === 'windows' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/30 text-cyan-300 font-mono font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-xs block">{strings.settings.osThemeWindows}</span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">
                    Mica & Fluent Acrylic
                  </span>
                </button>

                {/* Android 16 Button */}
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, osTheme: 'android' })}
                  className={`
                    p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group
                    ${settings.osTheme === 'android'
                      ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                      : 'bg-black/40 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-black/60'}
                  `}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-500/30 text-emerald-400">
                      <Smartphone className="w-4 h-4" />
                    </span>
                    {settings.osTheme === 'android' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-mono font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-xs block">{strings.settings.osThemeAndroid}</span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">
                    Material You Expressive
                  </span>
                </button>
              </div>
            </div>

            {/* Theme Selector (Dark / Light) */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{strings.settings.theme}</label>
              <div className="flex gap-2.5 max-w-xs">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, theme: 'dark' })}
                  className={`flex-1 p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    settings.theme === 'dark'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                      : 'bg-black/40 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Moon className="w-4 h-4 text-cyan-400" />
                  <span>{strings.settings.themeDark}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, theme: 'light' })}
                  className={`flex-1 p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    settings.theme === 'light'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                      : 'bg-black/40 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>{strings.settings.themeLight}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c121e] border border-cyan-900/30 space-y-4">
            <h3 className="text-sm font-bold text-zinc-200">
              {lang === 'en' ? 'UI & Audio Feedback' : lang === 'ru' ? 'Интерфейс и Звук' : 'Interfeys va Ovoz'}
            </h3>

            {/* TTS Text-to-Speech Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
              <div>
                <span className="text-sm font-medium text-zinc-200 block flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  {strings.settings.tts}
                </span>
                <span className="text-xs text-zinc-500">{strings.settings.ttsDesc}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const phrase = lang === 'en' 
                      ? "Hello! JARVIS text-to-speech voice response is active." 
                      : lang === 'ru' 
                      ? "Здравствуйте! Голосовой ответ JARVIS активен." 
                      : "Salom! JARVIS matnli javob ovozi faol ishlamoqda.";
                    TTSService.speak(phrase, lang, true);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all active:scale-95 ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-cyan-300'
                  }`}
                  title="Ovozni sinab ko‘rish (Test voice)"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Test Voice' : lang === 'ru' ? 'Тест' : 'Sinash'}</span>
                </button>
                <input
                  type="checkbox"
                  checked={settings.ttsEnabled}
                  onChange={() => onUpdateSettings({ ...settings, ttsEnabled: !settings.ttsEnabled })}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
              <div>
                <span className="text-sm font-medium text-zinc-200 block">{strings.settings.animations}</span>
                <span className="text-xs text-zinc-500">{strings.settings.animationsDesc}</span>
              </div>
              <input
                type="checkbox"
                checked={settings.animations}
                onChange={() => onUpdateSettings({ ...settings, animations: !settings.animations })}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
              <div>
                <span className="text-sm font-medium text-zinc-200 block">{strings.settings.sound}</span>
                <span className="text-xs text-zinc-500">{strings.settings.soundDesc}</span>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <span className="text-sm font-medium text-zinc-200 block">{strings.settings.timestamps}</span>
                <span className="text-xs text-zinc-500">{strings.settings.timestampsDesc}</span>
              </div>
              <input
                type="checkbox"
                checked={settings.showTimestamps}
                onChange={() => onUpdateSettings({ ...settings, showTimestamps: !settings.showTimestamps })}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Permissions */}
      {activeTab === 'permissions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>
              <strong>{strings.settings.permissionsNotice}</strong>
            </span>
          </div>

          <div className="space-y-3">
            {(Object.keys(settings.permissions) as PermissionType[]).map(key => {
              const rule = settings.permissions[key];
              return (
                <div
                  key={key}
                  className="p-4 rounded-2xl bg-[#0c121e] border border-cyan-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-200">{rule.label}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400">
                        {key}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">{rule.description}</p>
                  </div>

                  <div className="flex items-center gap-6 self-end sm:self-auto shrink-0">
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={() => handlePermissionToggle(key, 'enabled')}
                        className="w-4 h-4 accent-cyan-400"
                      />
                      <span>{lang === 'en' ? 'Enabled' : lang === 'ru' ? 'Разрешено' : 'Ruxsat etilgan'}</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-amber-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rule.requireConfirmation}
                        onChange={() => handlePermissionToggle(key, 'requireConfirmation')}
                        className="w-4 h-4 accent-amber-400"
                      />
                      <span>{lang === 'en' ? 'Confirm Prompt' : lang === 'ru' ? 'Требовать подтверждение' : 'Tasdiq talab qilinsin'}</span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Commands Catalog */}
      {activeTab === 'commands' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={commandSearch}
              onChange={e => setCommandSearch(e.target.value)}
              placeholder={lang === 'en' ? 'Search commands, examples, or keywords...' : lang === 'ru' ? 'Поиск команд, примеров или ключевых слов...' : 'Buyruqlar, misollar yoki kalit so‘zlarni qidirish...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0c121e] border border-cyan-900/30 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60"
            />
          </div>

          <div className="space-y-3">
            {filteredCommands.map(cmd => (
              <div
                key={cmd.id}
                className="p-4 rounded-2xl bg-[#0c121e] border border-cyan-900/20 hover:border-cyan-700/40 space-y-2 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                      {cmd.name}
                      {cmd.dangerous && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-400">
                          {lang === 'en' ? 'Sensitive (Confirm Required)' : lang === 'ru' ? 'Опасная команда' : 'Xavfli (Tasdiq talab etiladi)'}
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{cmd.description}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-cyan-950 border border-cyan-800/40 text-cyan-400 shrink-0">
                    {cmd.category}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-black/40 border border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-300">Misol: "{cmd.example}"</span>
                  <span className="text-zinc-500 text-[11px]">{cmd.keywords.length} keywords</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Storage & Cleanup */}
      {activeTab === 'storage' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#0c121e] border border-cyan-900/30 space-y-4">
            <h3 className="text-sm font-bold text-zinc-200">{strings.settings.storageTitle}</h3>
            <p className="text-xs text-zinc-400">
              {strings.settings.storageDesc}
            </p>

            {/* settings.json Export & Import */}
            <div className="p-4 rounded-xl bg-black/40 border border-cyan-900/40 space-y-3">
              <h4 className="text-xs font-bold text-cyan-300 font-mono flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                {lang === 'en' ? 'LOCAL CONFIGURATION FILE (settings.json)' : lang === 'ru' ? 'ЛОКАЛЬНЫЙ ФАЙЛ НАСТРОЕК (settings.json)' : 'LOKAL SOZLAMALAR FAYLI (settings.json)'}
              </h4>
              <p className="text-xs text-zinc-400">
                {lang === 'en' 
                  ? 'All settings (selected language, speech voice on/off, agent name, theme, permissions) are preserved locally and restored automatically whenever you open JARVIS. You can also export or import your settings.json file directly.'
                  : lang === 'ru'
                  ? 'Все настройки (выбранный язык, озвучка вкл/выкл, имя ассистента, тема, разрешения) сохраняются локально и восстанавливаются при каждом открытии JARVIS. Вы также можете экспортировать или импортировать файл settings.json.'
                  : 'Barcha sozlamalar (tanlangan til, ovozli javob yoqilgan/o‘chirilganligi, agent nomi, mavzu, ruxsatlar) lokal saqlanadi va dastur qayta ochilganda avtomatik tiklanadi. Shuningdek settings.json faylini eksport yoki import qilishingiz mumkin.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* Export Button */}
                <button
                  type="button"
                  onClick={() => {
                    const jsonStr = StorageService.exportSettingsJson();
                    const blob = new Blob([jsonStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'settings.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    setJsonExportSuccess(true);
                    setTimeout(() => setJsonExportSuccess(false), 3000);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-cyan-500/40 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 text-xs font-medium flex items-center gap-2 transition-all active:scale-95"
                >
                  {jsonExportSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
                  <span>{jsonExportSuccess ? 'settings.json yuklandi!' : strings.settings.exportSettings}</span>
                </button>

                {/* Import Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const content = event.target?.result as string;
                        if (content) {
                          const imported = StorageService.importSettingsJson(content);
                          if (imported) {
                            onUpdateSettings(imported);
                            setJsonImportSuccess(true);
                            setTimeout(() => setJsonImportSuccess(false), 3000);
                          } else {
                            alert('settings.json formati noto‘g‘ri!');
                          }
                        }
                      };
                      reader.readAsText(file);
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 text-xs font-medium flex items-center gap-2 transition-all active:scale-95"
                >
                  {jsonImportSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Upload className="w-4 h-4" />}
                  <span>{jsonImportSuccess ? 'settings.json tiklandi!' : strings.settings.importSettings}</span>
                </button>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <button
                onClick={() => {
                  if (confirm(strings.settings.clearAllConfirm)) {
                    onClearAllData();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium transition-all"
              >
                <Trash2 className="w-4 h-4" />
                {strings.settings.clearAllBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
