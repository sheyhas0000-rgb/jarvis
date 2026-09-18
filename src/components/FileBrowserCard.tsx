import React from 'react';
import { Folder, FileText, ExternalLink, Trash2, Edit3, HardDrive, Download } from 'lucide-react';
import { FileItem, ApprovedLocation } from '../types';
import { downloadFileToComputer } from '../utils/fileDownloader';

interface FileBrowserCardProps {
  location: ApprovedLocation;
  items: FileItem[];
  onOpenFile: (name: string) => void;
  onDeleteFile: (name: string) => void;
  onRenameFile: (name: string) => void;
}

export const FileBrowserCard: React.FC<FileBrowserCardProps> = ({
  location,
  items,
  onOpenFile,
  onDeleteFile,
  onRenameFile,
}) => {
  if (!items || items.length === 0) return null;

  const formatSize = (bytes?: number) => {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mt-4">
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/60 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-['Chakra_Petch']">
              {location} tarkibi ({items.length} ta obyekt)
            </span>
          </div>
        </div>

        {/* Files Grid / List */}
        <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.type === 'folder' ? (
                  <Folder className="w-5 h-5 text-amber-400 shrink-0" />
                ) : (
                  <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                )}
                <div className="truncate">
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {item.name}
                  </p>
                  {item.type === 'file' && item.size !== undefined && (
                    <p className="text-[11px] text-slate-500 font-mono">
                      {formatSize(item.size)}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                {item.type === 'file' && (
                  <button
                    onClick={() => downloadFileToComputer(item.name, '')}
                    title="Mac / PC kompyuteringizga yuklab olish"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => onOpenFile(item.name)}
                  title="Faylni ochish"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onRenameFile(item.name)}
                  title="Nomini o'zgartirish"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteFile(item.name)}
                  title="O'chirish"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
