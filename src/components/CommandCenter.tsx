import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Play, 
  Plus, 
  Trash2, 
  Layers, 
  Tag, 
  Search, 
  Command, 
  Sliders, 
  ShieldAlert, 
  Clock, 
  CheckCircle,
  Flame,
  ArrowRight
} from 'lucide-react';
import { 
  AppSettings, 
  CustomAlias, 
  CustomMacro, 
  MacroAction, 
  CommandCategory,
  PermissionType 
} from '../types';
import { ALL_COMMANDS_META } from '../commands/commandRegistry';
import { StorageService } from '../services/storageService';
import { getThemeTokens } from '../utils/osDetector';

interface CommandCenterProps {
  settings: AppSettings;
  onRunCommand: (commandText: string) => void;
  onNavigateTab?: (tab: any) => void;
}

type CenterTab = 'builder' | 'aliases' | 'macros' | 'catalog' | 'shortcuts';

export const CommandCenter: React.FC<CommandCenterProps> = ({
  settings,
  onRunCommand,
}) => {
  const [activeTab, setActiveTab] = useState<CenterTab>('builder');
  const tokens = getThemeTokens(settings.osTheme, settings.theme);

  // --- BUILDER STATE ---
  const [builderCategory, setBuilderCategory] = useState<CommandCategory>('applications');
  const [builderApp, setBuilderApp] = useState<string>('notepad');
  const [builderAction, setBuilderAction] = useState<'open' | 'close'>('open');
  const [builderLocation, setBuilderLocation] = useState<string>('Downloads');
  const [builderVolume, setBuilderVolume] = useState<number>(70);
  const [builderFileName, setBuilderFileName] = useState<string>('notes.txt');
  const [builderFileContent, setBuilderFileContent] = useState<string>('Salom, JARVIS!');
  const [builderSysAction, setBuilderSysAction] = useState<string>('status');
  const [generatedCommand, setGeneratedCommand] = useState<string>('open notepad');
  const [aliasFromBuilder, setAliasFromBuilder] = useState<string>('');
  const [builderSavedMessage, setBuilderSavedMessage] = useState<string>('');

  // --- ALIASES STATE ---
  const [aliases, setAliases] = useState<CustomAlias[]>([]);
  const [newAliasTrigger, setNewAliasTrigger] = useState<string>('');
  const [newAliasTarget, setNewAliasTarget] = useState<string>('');
  const [aliasSearch, setAliasSearch] = useState<string>('');

  // --- MACROS STATE ---
  const [macros, setMacros] = useState<CustomMacro[]>([]);
  const [runningMacroId, setRunningMacroId] = useState<string | null>(null);
  const [macroStepIndex, setMacroStepIndex] = useState<number>(-1);
  const [isCreatingMacro, setIsCreatingMacro] = useState<boolean>(false);
  const [newMacroName, setNewMacroName] = useState<string>('');
  const [newMacroDesc, setNewMacroDesc] = useState<string>('');
  const [newMacroActions, setNewMacroActions] = useState<MacroAction[]>([
    { command: 'open notepad', delayMs: 400 },
    { command: 'time', delayMs: 300 },
  ]);

  // --- CATALOG STATE ---
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<string>('all');

  // Load aliases & macros
  useEffect(() => {
    setAliases(StorageService.getCustomAliases());
    setMacros(StorageService.getCustomMacros());
  }, []);

  // Update generated command based on builder controls
  useEffect(() => {
    if (builderCategory === 'applications') {
      setGeneratedCommand(`${builderAction} ${builderApp}`);
    } else if (builderCategory === 'files') {
      setGeneratedCommand(`create file ${builderFileName} content "${builderFileContent}" in ${builderLocation}`);
    } else if (builderCategory === 'windows') {
      if (builderSysAction === 'open_folder') {
        setGeneratedCommand(`open ${builderLocation.toLowerCase()}`);
      } else if (builderSysAction === 'lock') {
        setGeneratedCommand('lock pc');
      } else if (builderSysAction === 'mute') {
        setGeneratedCommand('mute');
      } else if (builderSysAction === 'volume') {
        setGeneratedCommand(`volume ${builderVolume}`);
      }
    } else if (builderCategory === 'system') {
      if (builderSysAction === 'status') setGeneratedCommand('status');
      else if (builderSysAction === 'battery') setGeneratedCommand('battery');
      else if (builderSysAction === 'clipboard') setGeneratedCommand('clipboard');
      else if (builderSysAction === 'time') setGeneratedCommand('time');
      else if (builderSysAction === 'date') setGeneratedCommand('date');
      else if (builderSysAction === 'help') setGeneratedCommand('help');
    } else if (builderCategory === 'automation') {
      setGeneratedCommand('clean temp');
    } else if (builderCategory === 'browser') {
      if (builderSysAction === 'youtube') setGeneratedCommand('open youtube');
      else if (builderSysAction === 'telegram') setGeneratedCommand('open telegram');
      else setGeneratedCommand('open instagram');
    }
  }, [
    builderCategory, 
    builderApp, 
    builderAction, 
    builderLocation, 
    builderVolume, 
    builderFileName, 
    builderFileContent, 
    builderSysAction
  ]);

  // Handle Save Alias from Builder
  const handleSaveAliasFromBuilder = () => {
    if (!aliasFromBuilder.trim()) return;
    const added = StorageService.addCustomAlias(aliasFromBuilder, generatedCommand);
    setAliases(prev => [added, ...prev.filter(a => a.alias !== added.alias)]);
    setAliasFromBuilder('');
    setBuilderSavedMessage(`"${added.alias}" taxallusi muvaffaqiyatli saqlandi!`);
    setTimeout(() => setBuilderSavedMessage(''), 3000);
  };

  // Handle Manual Add Alias
  const handleAddAlias = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAliasTrigger.trim() || !newAliasTarget.trim()) return;
    const added = StorageService.addCustomAlias(newAliasTrigger, newAliasTarget);
    setAliases(prev => [added, ...prev.filter(a => a.alias !== added.alias)]);
    setNewAliasTrigger('');
    setNewAliasTarget('');
  };

  // Handle Delete Alias
  const handleDeleteAlias = (id: string) => {
    StorageService.deleteCustomAlias(id);
    setAliases(prev => prev.filter(a => a.id !== id));
  };

  // Run Macro Sequentially
  const handleRunMacro = async (macro: CustomMacro) => {
    if (runningMacroId) return;
    setRunningMacroId(macro.id);

    for (let i = 0; i < macro.actions.length; i++) {
      setMacroStepIndex(i);
      const action = macro.actions[i];
      onRunCommand(action.command);
      const delay = action.delayMs || 600;
      await new Promise(res => setTimeout(res, delay));
    }

    setRunningMacroId(null);
    setMacroStepIndex(-1);
  };

  // Save New Macro
  const handleSaveNewMacro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMacroName.trim() || newMacroActions.length === 0) return;
    const created = StorageService.addCustomMacro(
      newMacroName,
      newMacroDesc || 'Foydalanuvchi makrosi',
      newMacroActions.filter(a => a.command.trim().length > 0)
    );
    setMacros(prev => [created, ...prev]);
    setIsCreatingMacro(false);
    setNewMacroName('');
    setNewMacroDesc('');
    setNewMacroActions([
      { command: 'open notepad', delayMs: 400 },
      { command: 'time', delayMs: 300 },
    ]);
  };

  // Delete Macro
  const handleDeleteMacro = (id: string) => {
    StorageService.deleteCustomMacro(id);
    setMacros(prev => prev.filter(m => m.id !== id));
  };

  // Filter Catalog
  const filteredCatalog = ALL_COMMANDS_META.filter(cmd => {
    const matchesSearch = 
      cmd.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      cmd.description.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      cmd.keywords.some(k => k.toLowerCase().includes(catalogSearch.toLowerCase()));
    const matchesCategory = selectedCatalogCategory === 'all' || cmd.category === selectedCatalogCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter Aliases
  const filteredAliases = aliases.filter(a => 
    a.alias.toLowerCase().includes(aliasSearch.toLowerCase()) ||
    a.command.toLowerCase().includes(aliasSearch.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER BANNER */}
      <div 
        className={`p-6 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4`}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <Command className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-2xl font-bold tracking-tight ${tokens.textPrimary}`}>
                Command Center 2.0
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Rule-Based Engine
              </span>
            </div>
            <p className={`text-sm ${tokens.textSecondary} mt-0.5`}>
              Lokal qoidalar, buyruq konstruktori, maxsus taxalluslar (aliases), makroslar va klaviatura yorliqlari.
            </p>
          </div>
        </div>

        {/* Quick Nav Badges */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/10 dark:bg-black/30 backdrop-blur-md border border-white/10 self-start md:self-auto overflow-x-auto">
          {[
            { id: 'builder', label: 'Builder', icon: Sliders },
            { id: 'aliases', label: `Aliases (${aliases.length})`, icon: Tag },
            { id: 'macros', label: `Macros (${macros.length})`, icon: Layers },
            { id: 'catalog', label: 'Catalog', icon: Terminal },
            { id: 'shortcuts', label: 'Shortcuts', icon: Command },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as CenterTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
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

      {/* 1. COMMAND BUILDER TAB */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className={`lg:col-span-7 p-6 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg space-y-6`}>
            <div>
              <h2 className={`text-lg font-bold ${tokens.textPrimary} flex items-center gap-2`}>
                <Sliders className="w-5 h-5 text-cyan-400" />
                Interaktiv Buyruq Konstruktori
              </h2>
              <p className={`text-xs ${tokens.textSecondary} mt-1`}>
                Kategoriya va parametrlarni tanlang, natijaviy buyruq darhol tuziladi va sinab ko‘rishga tayyor bo‘ladi.
              </p>
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className={`text-xs font-semibold uppercase tracking-wider ${tokens.textSecondary}`}>
                Kategoriya
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'applications', label: 'Dasturlar' },
                  { id: 'windows', label: 'Tizim & Oynalar' },
                  { id: 'files', label: 'Fayllar' },
                  { id: 'system', label: 'Diagnostika' },
                  { id: 'browser', label: 'Internet' },
                  { id: 'automation', label: 'Avtomatlashtirish' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setBuilderCategory(cat.id as CommandCategory)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border text-left cursor-pointer ${
                      builderCategory === cat.id
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 font-semibold'
                        : `${tokens.cardBorder} ${tokens.textSecondary} hover:bg-white/5`
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Controls based on Category */}
            {builderCategory === 'applications' && (
              <div className="space-y-4 p-4 rounded-xl bg-black/5 dark:bg-black/20 border border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-xs font-semibold ${tokens.textSecondary} block mb-1.5`}>
                      Amal
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setBuilderAction('open')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border cursor-pointer ${
                          builderAction === 'open' 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                            : `${tokens.cardBorder} ${tokens.textSecondary}`
                        }`}
                      >
                        Ochish (Open)
                      </button>
                      <button
                        onClick={() => setBuilderAction('close')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border cursor-pointer ${
                          builderAction === 'close' 
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                            : `${tokens.cardBorder} ${tokens.textSecondary}`
                        }`}
                      >
                        Yopish (Close)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={`text-xs font-semibold ${tokens.textSecondary} block mb-1.5`}>
                      Dastur
                    </label>
                    <select
                      value={builderApp}
                      onChange={e => setBuilderApp(e.target.value)}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs border ${tokens.cardBorder} bg-black/20 ${tokens.textPrimary} focus:outline-none focus:border-cyan-500`}
                    >
                      <option value="notepad">Notepad (Bloknot)</option>
                      <option value="calculator">Calculator (Kalkulyator)</option>
                      <option value="cmd">CMD (Command Prompt)</option>
                      <option value="explorer">File Explorer</option>
                      <option value="task manager">Task Manager</option>
                      <option value="clock">Clock & Timer</option>
                      <option value="paint">MS Paint</option>
                      <option value="settings">Settings (Sozlamalar)</option>
                      <option value="browser">Web Browser</option>
                      <option value="control panel">Control Panel</option>
                      <option value="calendar">Calendar</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {builderCategory === 'files' && (
              <div className="space-y-4 p-4 rounded-xl bg-black/5 dark:bg-black/20 border border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`text-xs font-semibold ${tokens.textSecondary} block mb-1.5`}>
                      Fayl nomi (.txt, .md, .json)
                    </label>
                    <input
                      type="text"
                      value={builderFileName}
                      onChange={e => setBuilderFileName(e.target.value)}
                      placeholder="masalan: task.txt"
                      className={`w-full py-1.5 px-3 rounded-lg text-xs border ${tokens.cardBorder} bg-black/20 ${tokens.textPrimary} focus:outline-none focus:border-cyan-500`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-semibold ${tokens.textSecondary} block mb-1.5`}>
                      Joylashuv (Papka)
                    </label>
                    <select
                      value={builderLocation}
                      onChange={e => setBuilderLocation(e.target.value)}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs border ${tokens.cardBorder} bg-black/20 ${tokens.textPrimary} focus:outline-none focus:border-cyan-500`}
                    >
                      <option value="Downloads">Downloads</option>
                      <option value="Documents">Documents</option>
                      <option value="Desktop">Desktop</option>
                      <option value="Pictures">Pictures</option>
                      <option value="Videos">Videos</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={`text-xs font-semibold ${tokens.textSecondary} block mb-1.5`}>
                    Fayl ichidagi matn
                  </label>
                  <textarea
                    rows={2}
                    value={builderFileContent}
                    onChange={e => setBuilderFileContent(e.target.value)}
                    className={`w-full py-1.5 px-3 rounded-lg text-xs border ${tokens.cardBorder} bg-black/20 ${tokens.textPrimary} focus:outline-none focus:border-cyan-500`}
                  />
                </div>
              </div>
            )}

            {builderCategory === 'windows' && (
              <div className="space-y-4 p-4 rounded-xl bg-black/5 dark:bg-black/20 border border-white/5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'open_folder', label: 'Papka ochish' },
                    { id: 'volume', label: 'Ovoz darajasi' },
                    { id: 'mute', label: 'Ovozni o‘chirish' },
                    { id: 'lock', label: 'Kompyuterni qulflash' },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setBuilderSysAction(item.id)}
                      className={`p-2 rounded-lg text-xs font-medium border text-center cursor-pointer ${
                        builderSysAction === item.id
                          ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                          : `${tokens.cardBorder} ${tokens.textSecondary}`
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {builderSysAction === 'open_folder' && (
                  <div>
                    <label className={`text-xs font-semibold ${tokens.textSecondary} block mb-1.5`}>
                      Qaysi papkani ochish kerak:
                    </label>
                    <select
                      value={builderLocation}
                      onChange={e => setBuilderLocation(e.target.value)}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs border ${tokens.cardBorder} bg-black/20 ${tokens.textPrimary} focus:outline-none`}
                    >
                      <option value="Downloads">Downloads (Yuklamalar)</option>
                      <option value="Documents">Documents (Hujjatlar)</option>
                      <option value="Desktop">Desktop (Ish stoli)</option>
                      <option value="Pictures">Pictures (Rasmlar)</option>
                      <option value="Videos">Videos (Videolar)</option>
                    </select>
                  </div>
                )}

                {builderSysAction === 'volume' && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className={`text-xs font-semibold ${tokens.textSecondary}`}>
                        Ovoz balandligi:
                      </label>
                      <span className="text-xs font-bold text-cyan-400">{builderVolume}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={builderVolume}
                      onChange={e => setBuilderVolume(parseInt(e.target.value, 10))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                )}
              </div>
            )}

            {builderCategory === 'system' && (
              <div className="space-y-4 p-4 rounded-xl bg-black/5 dark:bg-black/20 border border-white/5">
                <label className={`text-xs font-semibold ${tokens.textSecondary} block`}>
                  Diagnostika buyrug‘ini tanlang:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'status', label: 'Tizim holati (Status)' },
                    { id: 'battery', label: 'Batareya zaryadi' },
                    { id: 'clipboard', label: 'Clipboard ko‘rish' },
                    { id: 'time', label: 'Hozirgi vaqt' },
                    { id: 'date', label: 'Bugungi sana' },
                    { id: 'help', label: 'Barcha buyruqlar' },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setBuilderSysAction(item.id)}
                      className={`p-2 rounded-lg text-xs font-medium border text-center cursor-pointer ${
                        builderSysAction === item.id
                          ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                          : `${tokens.cardBorder} ${tokens.textSecondary}`
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {builderCategory === 'browser' && (
              <div className="space-y-4 p-4 rounded-xl bg-black/5 dark:bg-black/20 border border-white/5">
                <label className={`text-xs font-semibold ${tokens.textSecondary} block`}>
                  Veb-servisni tanlang:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'youtube', label: 'YouTube' },
                    { id: 'telegram', label: 'Telegram Web' },
                    { id: 'instagram', label: 'Instagram' },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setBuilderSysAction(item.id)}
                      className={`p-2 rounded-lg text-xs font-medium border text-center cursor-pointer ${
                        builderSysAction === item.id
                          ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                          : `${tokens.cardBorder} ${tokens.textSecondary}`
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {builderCategory === 'automation' && (
              <div className="p-4 rounded-xl bg-black/5 dark:bg-black/20 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                  <Flame className="w-4 h-4" />
                  Kesh va vaqtinchalik fayllarni tozalash (Clean Temp)
                </div>
                <p className={`text-xs ${tokens.textSecondary}`}>
                  Tizim keshini, vaqtinchalik hisob-kitoblar va brauzer xotiralarini xavfsiz tartibga soladi.
                </p>
              </div>
            )}
          </div>

          {/* Result & Execution Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Generated Command Card */}
            <div className={`p-6 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg space-y-4`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${tokens.textSecondary}`}>
                  Tuzilgan Buyruq
                </span>
                <span className="px-2 py-0.5 text-2xs font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 rounded">
                  Tayyor
                </span>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/30 font-mono text-cyan-300 text-sm break-all flex items-center justify-between">
                <span>&gt; {generatedCommand}</span>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => onRunCommand(generatedCommand)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                Buyruqni Ishga Tushirish
              </button>

              <div className="pt-2 border-t border-white/10">
                <label className={`text-xs font-semibold ${tokens.textSecondary} block mb-1.5`}>
                  Ushbu buyruq uchun tezkor taxallus (alias) saqlash:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aliasFromBuilder}
                    onChange={e => setAliasFromBuilder(e.target.value)}
                    placeholder="masalan: ish2"
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs border ${tokens.cardBorder} bg-black/20 ${tokens.textPrimary} focus:outline-none focus:border-cyan-500`}
                  />
                  <button
                    onClick={handleSaveAliasFromBuilder}
                    disabled={!aliasFromBuilder.trim()}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Saqlash
                  </button>
                </div>
                {builderSavedMessage && (
                  <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {builderSavedMessage}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Tips */}
            <div className={`p-4 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl text-xs space-y-2`}>
              <div className="font-semibold text-cyan-400 flex items-center gap-1.5">
                <Command className="w-3.5 h-3.5" />
                Maslahat
              </div>
              <p className={tokens.textSecondary}>
                Buyruq markazidan yuborilgan buyruqlar darhol asosiy chat panelida log qilinadi, audio javob aytiladi va dastur oynasi ochiladi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. CUSTOM ALIASES TAB */}
      {activeTab === 'aliases' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Add Alias Form */}
          <div className={`lg:col-span-5 p-6 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg space-y-5 self-start`}>
            <div>
              <h2 className={`text-lg font-bold ${tokens.textPrimary} flex items-center gap-2`}>
                <Tag className="w-5 h-5 text-cyan-400" />
                Yangi Taxallus (Alias) Qo‘shish
              </h2>
              <p className={`text-xs ${tokens.textSecondary} mt-1`}>
                Qisqa so‘z yoki so‘z birikmasini to‘liq buyruqqa bog‘lang. Masalan: <code className="text-cyan-400 font-mono">"ish" &rarr; "open notepad"</code>.
              </p>
            </div>

            <form onSubmit={handleAddAlias} className="space-y-4">
              <div>
                <label className={`text-xs font-semibold ${tokens.textSecondary} block mb-1.5`}>
                  Qisqa taxallus (Trigger)
                </label>
                <input
                  type="text"
                  value={newAliasTrigger}
                  onChange={e => setNewAliasTrigger(e.target.value)}
                  placeholder="masalan: ish, toza, audio70"
                  required
                  className={`w-full py-2 px-3 rounded-xl text-xs border ${tokens.cardBorder} bg-black/20 ${tokens.textPrimary} focus:outline-none focus:border-cyan-500`}
                />
              </div>

              <div>
                <label className={`text-xs font-semibold ${tokens.textSecondary} block mb-1.5`}>
                  Bajariladigan buyruq (Target Command)
                </label>
                <input
                  type="text"
                  value={newAliasTarget}
                  onChange={e => setNewAliasTarget(e.target.value)}
                  placeholder="masalan: open notepad, clean temp, volume 70"
                  required
                  className={`w-full py-2 px-3 rounded-xl text-xs border ${tokens.cardBorder} bg-black/20 ${tokens.textPrimary} focus:outline-none focus:border-cyan-500`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Taxallusni Saqlash
              </button>
            </form>
          </div>

          {/* Existing Aliases List */}
          <div className={`lg:col-span-7 p-6 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className={`font-bold ${tokens.textPrimary} text-base`}>
                  Mavjud Taxalluslar ({aliases.length})
                </h3>
                <p className={`text-xs ${tokens.textSecondary}`}>
                  Qisqartirilgan so‘z kiritilganda JARVIS uni avtomatik aniqlaydi va bajaradi.
                </p>
              </div>

              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  value={aliasSearch}
                  onChange={e => setAliasSearch(e.target.value)}
                  placeholder="Qidirish..."
                  className={`w-full py-1.5 pl-8 pr-3 rounded-lg text-xs border ${tokens.cardBorder} bg-black/20 ${tokens.textPrimary} focus:outline-none`}
                />
              </div>
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredAliases.length === 0 ? (
                <div className={`p-8 text-center text-xs ${tokens.textSecondary}`}>
                  Taxalluslar topilmadi.
                </div>
              ) : (
                filteredAliases.map(item => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-black/5 dark:bg-black/20 border border-white/5 flex items-center justify-between gap-3 hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold shrink-0">
                        "{item.alias}"
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <div className="font-mono text-xs text-zinc-300 truncate">
                        {item.command}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onRunCommand(item.command)}
                        title="Sinab ko‘rish"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 text-zinc-400 transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAlias(item.id)}
                        title="O‘chirish"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-zinc-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. CUSTOM MACROS TAB */}
      {activeTab === 'macros' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className={`text-lg font-bold ${tokens.textPrimary} flex items-center gap-2`}>
                <Layers className="w-5 h-5 text-cyan-400" />
                Ketma-ket Buyruqlar (Makroslar)
              </h2>
              <p className={`text-xs ${tokens.textSecondary} mt-0.5`}>
                Bir bosishda bir nechta lokal buyruqni ketma-ket va kechikish bilan avtomatik bajaring.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingMacro(!isCreatingMacro)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-2 self-start cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              {isCreatingMacro ? 'Bekor qilish' : 'Yangi Makros'}
            </button>
          </div>

          {/* Create Macro Drawer */}
          {isCreatingMacro && (
            <form 
              onSubmit={handleSaveNewMacro}
              className={`p-6 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-xl space-y-4 border-2 border-cyan-500/40`}
            >
              <h3 className={`font-bold ${tokens.textPrimary} text-sm`}>
                Yangi Makros yaratish
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-semibold ${tokens.textSecondary} block mb-1`}>
                    Makros nomi
                  </label>
                  <input
                    type="text"
                    value={newMacroName}
                    onChange={e => setNewMacroName(e.target.value)}
                    placeholder="masalan: Tezkor ish boshlash"
                    required
                    className={`w-full py-1.5 px-3 rounded-lg text-xs border ${tokens.cardBorder} bg-black/20 ${tokens.textPrimary} focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-semibold ${tokens.textSecondary} block mb-1`}>
                    Tavsif
                  </label>
                  <input
                    type="text"
                    value={newMacroDesc}
                    onChange={e => setNewMacroDesc(e.target.value)}
                    placeholder="masalan: Bloknot ochish va vaqtni bilish"
                    className={`w-full py-1.5 px-3 rounded-lg text-xs border ${tokens.cardBorder} bg-black/20 ${tokens.textPrimary} focus:outline-none`}
                  />
                </div>
              </div>

              {/* Step Editor */}
              <div className="space-y-2">
                <label className={`text-xs font-semibold ${tokens.textSecondary} block`}>
                  Ketma-ket bosqichlar:
                </label>
                {newMacroActions.map((act, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 text-center text-xs font-mono text-cyan-400">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      value={act.command}
                      onChange={e => {
                        const updated = [...newMacroActions];
                        updated[idx].command = e.target.value;
                        setNewMacroActions(updated);
                      }}
                      placeholder="Buyruq matni (masalan: open calc)"
                      className={`flex-1 py-1 px-3 rounded-lg text-xs border ${tokens.cardBorder} bg-black/20 ${tokens.textPrimary} focus:outline-none`}
                    />
                    <div className="flex items-center gap-1 text-xs text-zinc-400 shrink-0">
                      <Clock className="w-3 h-3" />
                      <input
                        type="number"
                        min={100}
                        step={100}
                        value={act.delayMs}
                        onChange={e => {
                          const updated = [...newMacroActions];
                          updated[idx].delayMs = parseInt(e.target.value, 10) || 300;
                          setNewMacroActions(updated);
                        }}
                        className={`w-16 py-1 px-2 rounded-lg text-xs border ${tokens.cardBorder} bg-black/20 text-right`}
                      />
                      <span>ms</span>
                    </div>
                    {newMacroActions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setNewMacroActions(prev => prev.filter((_, i) => i !== idx))}
                        className="p-1 hover:text-rose-400 text-zinc-500 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setNewMacroActions(prev => [...prev, { command: '', delayMs: 400 }])}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 pt-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Bosqich qo‘shish
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreatingMacro(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:bg-white/5 cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs cursor-pointer"
                >
                  Makrosni Saqlash
                </button>
              </div>
            </form>
          )}

          {/* Macros Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {macros.map(macro => {
              const isRunning = runningMacroId === macro.id;
              return (
                <div
                  key={macro.id}
                  className={`p-5 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className={`font-bold ${tokens.textPrimary} text-sm`}>
                            {macro.name}
                          </h4>
                          {macro.shortcut && (
                            <span className="text-2xs font-mono text-zinc-500 bg-black/20 px-1.5 py-0.5 rounded">
                              {macro.shortcut}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteMacro(macro.id)}
                        title="O‘chirish"
                        className="text-zinc-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className={`text-xs ${tokens.textSecondary} mt-2 line-clamp-2`}>
                      {macro.description}
                    </p>

                    {/* Step pills */}
                    <div className="mt-3 space-y-1.5">
                      {macro.actions.map((act, sIdx) => {
                        const isCurrentStep = isRunning && macroStepIndex === sIdx;
                        return (
                          <div
                            key={sIdx}
                            className={`flex items-center justify-between text-2xs px-2.5 py-1 rounded-md font-mono transition-all ${
                              isCurrentStep
                                ? 'bg-cyan-500 text-white font-bold animate-pulse'
                                : 'bg-black/10 dark:bg-black/30 text-zinc-400'
                            }`}
                          >
                            <span className="truncate">
                              {sIdx + 1}. {act.command}
                            </span>
                            <span className="text-zinc-500 shrink-0 ml-2">
                              +{act.delayMs}ms
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRunMacro(macro)}
                    disabled={isRunning}
                    className={`w-full py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isRunning
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-md shadow-cyan-500/20'
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <div className="w-3 h-3 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                        Bajarilmoqda ({macroStepIndex + 1}/{macro.actions.length})...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Makrosni Ishga Tushirish
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. COMMAND CATALOG TAB */}
      {activeTab === 'catalog' && (
        <div className={`p-6 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg space-y-6`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className={`text-lg font-bold ${tokens.textPrimary} flex items-center gap-2`}>
                <Terminal className="w-5 h-5 text-cyan-400" />
                Lokal Buyruqlar Katalogi ({ALL_COMMANDS_META.length})
              </h2>
              <p className={`text-xs ${tokens.textSecondary} mt-0.5`}>
                JARVIS tan oladigan barcha 100% lokal va xavfsiz qoidalar ro‘yxati.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                value={catalogSearch}
                onChange={e => setCatalogSearch(e.target.value)}
                placeholder="Buyruqlarni qidirish..."
                className={`w-full py-2 pl-9 pr-3 rounded-xl text-xs border ${tokens.cardBorder} bg-black/20 ${tokens.textPrimary} focus:outline-none focus:border-cyan-500`}
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'Barchasi' },
              { id: 'applications', label: 'Dasturlar' },
              { id: 'windows', label: 'Windows & OS' },
              { id: 'files', label: 'Fayllar' },
              { id: 'system', label: 'Diagnostika' },
              { id: 'browser', label: 'Internet' },
              { id: 'automation', label: 'Avtomatlashtirish' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCatalogCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCatalogCategory === cat.id
                    ? 'bg-cyan-500 text-white font-semibold shadow-sm'
                    : `${tokens.textSecondary} hover:bg-white/5`
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Commands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map(cmd => (
              <div
                key={cmd.id}
                className="p-4 rounded-xl bg-black/5 dark:bg-black/20 border border-white/5 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-cyan-400 font-mono">
                      {cmd.name}
                    </span>
                    {cmd.dangerous ? (
                      <span className="flex items-center gap-1 text-2xs px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        <ShieldAlert className="w-3 h-3" />
                        Tasdiq talab
                      </span>
                    ) : (
                      <span className="text-2xs px-1.5 py-0.5 rounded bg-white/5 text-zinc-400">
                        {cmd.category}
                      </span>
                    )}
                  </div>

                  <p className={`text-xs ${tokens.textSecondary} mt-1.5`}>
                    {cmd.description}
                  </p>

                  <div className="mt-2.5 p-2 rounded bg-black/30 border border-white/5 font-mono text-2xs text-zinc-300">
                    <span className="text-zinc-500 select-none">Misol: </span>
                    {cmd.example}
                  </div>
                </div>

                <button
                  onClick={() => onRunCommand(cmd.example)}
                  className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="w-3 h-3" />
                  Sinab ko‘rish
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. KEYBOARD SHORTCUTS TAB */}
      {activeTab === 'shortcuts' && (
        <div className={`p-6 ${tokens.cardBg} ${tokens.cardBorder} rounded-2xl shadow-lg space-y-6`}>
          <div>
            <h2 className={`text-lg font-bold ${tokens.textPrimary} flex items-center gap-2`}>
              <Command className="w-5 h-5 text-cyan-400" />
              Tezkor Klaviatura Tugmalari (Shortcuts)
            </h2>
            <p className={`text-xs ${tokens.textSecondary} mt-0.5`}>
              JARVIS interfeysini sichqonchasiz, tezkor va professional tarzda boshqaring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { keys: ['Ctrl', 'K'], desc: 'Global Qidiruv (Omnibox)', purpose: 'Barcha buyruqlar, dasturlar va chatlar ichidan tezkor qidirish' },
              { keys: ['Ctrl', 'Shift', 'D'], desc: 'Dashboard', purpose: 'Asosiy Bosh sahifaga o‘tish' },
              { keys: ['Ctrl', 'Shift', 'C'], desc: 'Command Center', purpose: 'Buyruq konstruktori va katalogiga o‘tish' },
              { keys: ['Ctrl', 'Shift', 'T'], desc: 'Desktop Tools', purpose: 'Skrinshot, Clipboard va Diagnostika vositalariga o‘tish' },
              { keys: ['Ctrl', 'Shift', 'L'], desc: 'Mavzuni almashtirish', purpose: 'Dark va Light rejimini almashtirish' },
              { keys: ['↑', '↓'], desc: 'Buyruqlar tarixi', purpose: 'Chat kiritish maydonida oxirgi 20 ta buyruqni aylanib chiqish' },
              { keys: ['Enter'], desc: 'Buyruqni yuborish', purpose: 'Kiritilgan buyruqni tekshirib darhol ishga tushirish' },
              { keys: ['Esc'], desc: 'Yopish', purpose: 'Ochiq modallar va qidiruv oynasini yopish' },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-black/5 dark:bg-black/20 border border-white/5 flex items-center justify-between gap-4"
              >
                <div>
                  <div className={`text-sm font-semibold ${tokens.textPrimary}`}>
                    {item.desc}
                  </div>
                  <div className={`text-xs ${tokens.textSecondary} mt-0.5`}>
                    {item.purpose}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {item.keys.map((k, kIdx) => (
                    <kbd
                      key={kIdx}
                      className="px-2 py-1 rounded-md bg-black/40 border border-white/10 text-cyan-400 font-mono text-xs font-semibold shadow-sm"
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
