import React, { useState } from 'react';
import { User, ShieldCheck, HardDrive, Terminal, Laptop, Cpu, Check, Edit2 } from 'lucide-react';

interface ProfileModalProps {
  agentName: string;
  onUpdateAgentName: (name: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  agentName,
  onUpdateAgentName,
}) => {
  const [userName, setUserName] = useState('Ser');
  const [isEditing, setIsEditing] = useState(false);
  const [customName, setCustomName] = useState(agentName);

  const handleSave = () => {
    if (customName.trim()) {
      onUpdateAgentName(customName.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="h-full flex flex-col p-6 max-w-2xl mx-auto overflow-y-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-cyan-200 flex items-center gap-2">
          <User className="w-6 h-6 text-cyan-400" />
          Foydalanuvchi va Agent Profili
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Lokal stansiya identifikatsiyasi va agent sozlamalari
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="p-6 rounded-2xl bg-[#0c121e] border border-cyan-900/40 shadow-[0_0_30px_rgba(0,240,255,0.06)] space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border-2 border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <Laptop className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-100">Foydalanuvchi: {userName}</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono">
                Administrator
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Lokal Windows Ish Stantsiyasi Operator
            </p>
          </div>
        </div>

        {/* Agent Name Configuration */}
        <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
          <span className="text-xs font-medium text-zinc-400 block">
            Agent Nomi:
          </span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-cyan-500 text-sm text-cyan-200 focus:outline-none"
              />
              <button
                onClick={handleSave}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Saqlash
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-cyan-300 font-mono">{agentName}</span>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-zinc-400 hover:text-cyan-300"
                title="Nomni tahrirlash"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* System Specs */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
            <span className="text-zinc-500 block mb-1">Operatsion muhit:</span>
            <span className="text-zinc-200 font-medium flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Windows NT / Local Desktop
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
            <span className="text-zinc-500 block mb-1">Xavfsizlik:</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Whitelist Strict Enforced
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
            <span className="text-zinc-500 block mb-1">AI Bog‘liqligi:</span>
            <span className="text-zinc-300 font-medium">
              Mutlaqo yo‘q (0% AI / 100% Local)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
            <span className="text-zinc-500 block mb-1">Xotira turi:</span>
            <span className="text-zinc-300 font-medium flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              Lokal Brauzer & Sandbox Disk
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
