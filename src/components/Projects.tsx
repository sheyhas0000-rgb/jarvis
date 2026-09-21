import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Trash2, 
  Edit2, 
  MessageSquare, 
  Globe, 
  Monitor, 
  Cpu, 
  Bot,
  X,
  Check
} from 'lucide-react';
import { Project, ChatSession } from '../types';

interface ProjectsProps {
  projects: Project[];
  chats: ChatSession[];
  onCreateProject: (name: string, description: string, color: string, icon: string) => void;
  onDeleteProject: (id: string) => void;
  onSelectChat: (chatId: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({
  projects,
  chats,
  onCreateProject,
  onDeleteProject,
  onSelectChat,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#00f0ff');
  const [icon, setIcon] = useState('FolderKanban');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const colors = ['#00f0ff', '#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ef4444'];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateProject(name.trim(), description.trim(), color, icon);
    setName('');
    setDescription('');
    setShowModal(false);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-5 h-5" />;
      case 'Monitor': return <Monitor className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Bot': return <Bot className="w-5 h-5" />;
      default: return <FolderKanban className="w-5 h-5" />;
    }
  };

  const activeProject = projects.find(p => p.id === selectedProjectId);
  const projectChats = selectedProjectId 
    ? chats.filter(c => c.projectId === selectedProjectId)
    : [];

  return (
    <div className="h-full flex flex-col p-6 max-w-4xl mx-auto overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-cyan-200 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-cyan-400" />
            Loyihalar va Kataloglar
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Buyruqlar va chatlarni yo‘nalishlar bo‘yicha guruhlash
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-medium shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all active:scale-98"
        >
          <Plus className="w-4 h-4 text-cyan-400" />
          Yangi loyiha
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {projects.map(proj => {
          const count = chats.filter(c => c.projectId === proj.id).length;
          const isSelected = selectedProjectId === proj.id;

          return (
            <div
              key={proj.id}
              onClick={() => setSelectedProjectId(isSelected ? null : proj.id)}
              className={`
                p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between
                ${isSelected
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                  : 'bg-[#0c121e] border-cyan-900/30 hover:border-cyan-700/50 hover:bg-[#0f1726]'}
              `}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${proj.color}20`, color: proj.color, borderColor: `${proj.color}50`, borderWidth: 1 }}
                  >
                    {getIconComponent(proj.icon)}
                  </div>
                  {proj.id !== 'proj_jarvis' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`"${proj.name}" loyihasini o‘chirishni xohlaysizmi?`)) {
                          onDeleteProject(proj.id);
                          if (selectedProjectId === proj.id) setSelectedProjectId(null);
                        }
                      }}
                      className="p-1 rounded text-zinc-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h3 className="text-sm font-bold text-zinc-200 truncate">{proj.name}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                  {proj.description || 'Lokal loyiha'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-cyan-900/20 flex items-center justify-between text-[11px] text-zinc-500">
                <span>{count} ta chat</span>
                <span className="text-cyan-400 font-mono">Faol</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Linked Chats Section if selected */}
      {selectedProjectId && activeProject && (
        <div className="p-5 rounded-2xl bg-[#0c121e] border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-cyan-400" />
              "{activeProject.name}" loyihasiga biriktirilgan chatlar:
            </h3>
            <button
              onClick={() => setSelectedProjectId(null)}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Yopish
            </button>
          </div>

          {projectChats.length === 0 ? (
            <p className="text-xs text-zinc-500 py-3">
              Bu loyihaga biriktirilgan chatlar mavjud emas.
            </p>
          ) : (
            <div className="space-y-2">
              {projectChats.map(c => (
                <div
                  key={c.id}
                  onClick={() => onSelectChat(c.id)}
                  className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-zinc-800 hover:border-cyan-500/40 cursor-pointer text-xs transition-all"
                >
                  <span className="font-medium text-zinc-200">{c.title}</span>
                  <span className="text-zinc-500">{c.messages.length} xabar</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleCreate} className="w-full max-w-md bg-[#0c121e] border border-cyan-500/40 rounded-2xl p-6 space-y-4 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-900/30">
              <h3 className="text-base font-bold text-cyan-200 flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Yangi Loyiha Yaratish
              </h3>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Loyiha nomi</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Masalan: Test loyihasi"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-cyan-900/40 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/60"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Tavsif (ixtiyoriy)</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Loyiha vazifasi va maqsadi..."
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-cyan-900/40 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/60 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Rang</label>
              <div className="flex items-center gap-2">
                {colors.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${color === c ? 'scale-110 border-white' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white text-xs"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-medium"
              >
                Yaratish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
