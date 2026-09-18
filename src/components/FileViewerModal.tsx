import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Download, X, Save, Check, Copy } from 'lucide-react';
import { downloadFileToComputer } from '../utils/fileDownloader';

interface FileViewerModalProps {
  isOpen: boolean;
  fileName: string;
  initialContent: string;
  location: string;
  onClose: () => void;
  onSave?: (fileName: string, newContent: string) => void;
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({
  isOpen,
  fileName,
  initialContent,
  location,
  onClose,
  onSave,
}) => {
  const [content, setContent] = useState(initialContent);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  if (!isOpen) return null;

  const handleDownload = () => {
    downloadFileToComputer(fileName, content);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(fileName, content);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700/80 p-5 shadow-2xl flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate">
                <h3 className="text-sm sm:text-base font-bold text-slate-100 font-mono truncate">
                  {fileName}
                </h3>
                <p className="text-xs text-slate-400">
                  Joylashuvi: <span className="text-cyan-400">{location}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleDownload}
                title="Mac / PC kompyuteriga yuklab olish"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kompyuterga yuklash</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content Editor */}
          <div className="my-4 flex-1 flex flex-col min-h-[220px]">
            <div className="flex items-center justify-between pb-2 text-xs text-slate-400">
              <span>Fayl matni (tahrirlash mumkin):</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Nusxalandi' : 'Nusxa olish'}</span>
              </button>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Fayl bo'sh..."
              className="w-full flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs sm:text-sm resize-none focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
              rows={8}
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              {content.length} ta belgi | UTF-8
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{saved ? 'Saqlandi!' : 'Saqlash'}</span>
              </button>

              <button
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Yopish
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
