import React, { useState } from 'react';
import { Folder, FileText, Download, Trash2, Edit3, Plus, HardDrive, Eye } from 'lucide-react';
import { FileItem, ApprovedLocation } from '../types';
import { downloadFileToComputer } from '../utils/fileDownloader';

interface MobileFilesViewProps {
  location: ApprovedLocation;
  items: FileItem[];
  onOpenFile: (name: string) => void;
  onDeleteFile: (name: string) => void;
  onRenameFile: (name: string) => void;
  onViewFile: (name: string, content?: string, loc?: ApprovedLocation) => void;
  onCreateNewFile: (name: string, content: string) => void;
}

export const MobileFilesView: React.FC<MobileFilesViewProps> = ({
  location,
  items,
  onOpenFile,
  onDeleteFile,
  onRenameFile,
  onViewFile,
  onCreateNewFile,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const name = newFileName.trim().endsWith('.txt') ? newFileName.trim() : `${newFileName.trim()}.txt`;
    onCreateNewFile(name, newFileContent);
    setNewFileName('');
    setNewFileContent('');
    setIsCreating(false);
  };

  const formatSize = (bytes?: number) => {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div id="mobile-files-view" className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-3 space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-['Chakra_Petch']">
              Fayllar va Hujjatlar
            </h3>
            <p className="text-xs text-slate-400">
              {items.length} ta fayl saqlangan • Telefoningizga yuklab olish mumkin
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Yangi fayl</span>
          <span className="sm:hidden">Yaratish</span>
        </button>
      </div>

      {/* New file creation form */}
      {isCreating && (
        <form
          onSubmit={handleCreateSubmit}
          className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-3 shadow-lg"
        >
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-['Chakra_Petch']">
            Yangi fayl yaratish
          </h4>
          <input
            type="text"
            placeholder="Fayl nomi (masalan: eslatma.txt)"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            autoFocus
          />
          <textarea
            placeholder="Fayl matni (ixtiyoriy)..."
            value={newFileContent}
            onChange={(e) => setNewFileContent(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={!newFileName.trim()}
              className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold disabled:opacity-40"
            >
              Yaratish & Saqlash
            </button>
          </div>
        </form>
      )}

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
          <Folder className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">
            Hozircha birorta ham fayl yaratilmagan
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Muloqotda "test.txt yarat" deb yozing yoki yuqoridagi "Yaratish" tugmasini bosing.
          </p>
        </div>
      ) : (
        /* File cards list */
        <div className="space-y-2.5">
          {items.map((item) => (
            <div
              key={item.name}
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-3 group"
            >
              <div
                onClick={() => {
                  if (item.type === 'file') {
                    onViewFile(item.name, item.content, item.location || location);
                  } else {
                    onOpenFile(item.name);
                  }
                }}
                className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                  {item.type === 'folder' ? (
                    <Folder className="w-5 h-5 text-amber-400" />
                  ) : (
                    <FileText className="w-5 h-5 text-cyan-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {item.type === 'folder' ? 'Papka' : formatSize(item.size) || 'Fayl'} • {item.location || location}
                  </p>
                </div>
              </div>

              {/* Action buttons (optimized for touch) */}
              <div className="flex items-center gap-1 shrink-0">
                {item.type === 'file' && (
                  <>
                    <button
                      onClick={() => onViewFile(item.name, item.content, item.location || location)}
                      title="Ko'rish / Tahrirlash"
                      className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors active:scale-90"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadFileToComputer(item.name, item.content || '')}
                      title="Telefonga yuklab olish"
                      className="p-2 rounded-xl text-cyan-400 hover:text-cyan-200 hover:bg-slate-800 transition-colors active:scale-90"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => onRenameFile(item.name)}
                  title="Nomini o'zgartirish"
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors active:scale-90"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteFile(item.name)}
                  title="O'chirish"
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors active:scale-90"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
