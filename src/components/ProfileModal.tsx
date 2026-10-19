import React, { useState } from 'react';
import { User, ShieldCheck, HardDrive, Terminal, Laptop, Cpu, Check, Edit2, Sparkles, Smartphone, Monitor } from 'lucide-react';
import { ActiveOSType } from '../types';
import { detectOSInfo } from '../utils/osDetector';

interface ProfileModalProps {
  agentName: string;
  onUpdateAgentName: (name: string) => void;
  theme?: 'dark' | 'light';
  osTheme?: ActiveOSType;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  agentName,
  onUpdateAgentName,
  theme = 'dark',
  osTheme = 'windows',
}) => {
  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem('jarvis_user_name_v1') || 'Foydalanuvchi';
    } catch {
      return 'Foydalanuvchi';
    }
  });
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [tempUserName, setTempUserName] = useState(userName);

  const [isEditingAgent, setIsEditingAgent] = useState(false);
  const [customName, setCustomName] = useState(agentName);

  const isLight = theme === 'light';
  const osInfo = detectOSInfo();

  const handleSaveUser = () => {
    if (tempUserName.trim()) {
      setUserName(tempUserName.trim());
      try {
        localStorage.setItem('jarvis_user_name_v1', tempUserName.trim());
      } catch {}
    }
    setIsEditingUser(false);
  };

  const handleSaveAgent = () => {
    if (customName.trim()) {
      onUpdateAgentName(customName.trim());
    }
    setIsEditingAgent(false);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 max-w-2xl mx-auto overflow-y-auto space-y-6">
      <div>
        <h1 className={`text-xl font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-cyan-200'}`}>
          <User className="w-6 h-6 text-cyan-400" />
          Foydalanuvchi va Agent Profili
        </h1>
        <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
          Lokal stansiya identifikatsiyasi va agent sozlamalari
        </p>
      </div>

      {/* Main Profile Card */}
      <div className={`p-6 border space-y-6 transition-all ${
        osTheme === 'macos'
          ? (isLight 
              ? 'rounded-3xl bg-white/80 backdrop-blur-2xl border-black/10 shadow-[0_10px_35px_rgba(0,0,0,0.05)]' 
              : 'rounded-3xl bg-[#141b28]/80 backdrop-blur-2xl border-white/10 shadow-[0_15px_45px_rgba(0,0,0,0.5)]')
          : osTheme === 'android'
          ? (isLight 
              ? 'rounded-[28px] bg-[#e4ede8] border-[#ceddd4] shadow-sm' 
              : 'rounded-[28px] bg-[#18212e] border-[#29374b] shadow-sm')
          : (isLight 
              ? 'rounded-2xl bg-white border-slate-200 shadow-sm' 
              : 'rounded-2xl bg-[#0c121e] border-cyan-900/40 shadow-[0_0_30px_rgba(0,240,255,0.06)]')
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 flex items-center justify-center transition-all ${
            osTheme === 'macos'
              ? 'rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-white/20 text-blue-400 shadow-sm'
              : osTheme === 'android'
              ? 'rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
              : 'rounded-2xl bg-cyan-950/60 border-2 border-cyan-500/50 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
          }`}>
            {osTheme === 'macos' ? <Laptop className="w-8 h-8" /> : osTheme === 'android' ? <Smartphone className="w-8 h-8" /> : <Monitor className="w-8 h-8" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {isEditingUser ? (
                <div className="flex items-center gap-1.5 flex-1 max-w-xs">
                  <input
                    type="text"
                    value={tempUserName}
                    onChange={e => setTempUserName(e.target.value)}
                    className={`px-2.5 py-1 text-sm rounded-lg border font-semibold w-full focus:outline-none ${
                      isLight ? 'bg-slate-100 border-cyan-500 text-slate-900' : 'bg-black/60 border-cyan-400 text-cyan-200'
                    }`}
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSaveUser();
                      if (e.key === 'Escape') setIsEditingUser(false);
                    }}
                  />
                  <button
                    onClick={handleSaveUser}
                    className="p-1 rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 truncate">
                  <h2 className={`text-lg font-bold truncate ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>
                    {userName}
                  </h2>
                  <button
                    onClick={() => {
                      setTempUserName(userName);
                      setIsEditingUser(true);
                    }}
                    className="p-1 text-zinc-400 hover:text-cyan-400 transition-colors"
                    title="Foydalanuvchi nomini tahrirlash"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono shrink-0">
                Lokal Foydalanuvchi
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              Lokal Operator ({osInfo.detectedOSName} • {osInfo.deviceType.toUpperCase()})
            </p>
          </div>
        </div>

        {/* Agent Name Configuration */}
        <div className={`p-4 rounded-xl border space-y-2 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-zinc-800'
        }`}>
          <span className={`text-xs font-medium block ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Assistent (Agent) Nomi:
          </span>
          {isEditingAgent ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                className={`flex-1 px-3 py-1.5 rounded-lg border text-sm focus:outline-none ${
                  isLight ? 'bg-white border-cyan-500 text-slate-900' : 'bg-zinc-900 border-cyan-500 text-cyan-200'
                }`}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSaveAgent();
                  if (e.key === 'Escape') setIsEditingAgent(false);
                }}
              />
              <button
                onClick={handleSaveAgent}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs flex items-center gap-1 font-medium"
              >
                <Check className="w-3.5 h-3.5" /> Saqlash
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold font-mono ${isLight ? 'text-cyan-700' : 'text-cyan-300'}`}>
                {agentName}
              </span>
              <button
                onClick={() => {
                  setCustomName(agentName);
                  setIsEditingAgent(true);
                }}
                className="p-1 text-zinc-400 hover:text-cyan-300"
                title="Nomni tahrirlash"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Genuine Environment Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/40 border-zinc-800/80'}`}>
            <span className={`block mb-1 ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>Aniqlangan Operatsion Tizim:</span>
            <span className={`font-medium flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              {osInfo.detectedOSName} ({osInfo.rawPlatform})
            </span>
          </div>

          <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/40 border-zinc-800/80'}`}>
            <span className={`block mb-1 ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>Aktiv Dizayn Rejimi:</span>
            <span className="text-cyan-400 font-medium flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              {osTheme === 'macos' ? 'macOS 27 Liquid Glass' : osTheme === 'android' ? 'Android 16 Material You' : 'Windows 12 Fluent Design'}
            </span>
          </div>

          <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/40 border-zinc-800/80'}`}>
            <span className={`block mb-1 ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>Xavfsizlik Arxitekturasi:</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Oflayn Lokal (Zero AI API / Zero Cloud)
            </span>
          </div>

          <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/40 border-zinc-800/80'}`}>
            <span className={`block mb-1 ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>Qurilma / Ekran o‘lchami:</span>
            <span className={`font-medium flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-zinc-300'}`}>
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              {osInfo.deviceType.toUpperCase()} • {osInfo.screenSize}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
