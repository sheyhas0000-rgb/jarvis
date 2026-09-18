import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Check, X, Folder, Monitor, FileText, Download, Image, Film } from 'lucide-react';
import { ApprovedLocation } from '../types';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  allowedLocations: Record<ApprovedLocation, boolean>;
  onToggleLocation: (loc: ApprovedLocation) => void;
  onSave: () => void;
  isFirstStartup?: boolean;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  allowedLocations,
  onToggleLocation,
  onSave,
  isFirstStartup,
}) => {
  if (!isOpen) return null;

  const listItems: { id: ApprovedLocation; nameUz: string; icon: React.ReactNode }[] = [
    { id: 'Desktop', nameUz: 'Ish stoli (Desktop)', icon: <Monitor className="w-5 h-5 text-cyan-400" /> },
    { id: 'Documents', nameUz: 'Hujjatlar (Documents)', icon: <FileText className="w-5 h-5 text-indigo-400" /> },
    { id: 'Downloads', nameUz: 'Yuklamalar (Downloads)', icon: <Download className="w-5 h-5 text-emerald-400" /> },
    { id: 'Pictures', nameUz: 'Rasmlar (Pictures)', icon: <Image className="w-5 h-5 text-amber-400" /> },
    { id: 'Videos', nameUz: 'Videolar (Videos)', icon: <Film className="w-5 h-5 text-rose-400" /> },
  ];

  const activeLocations = listItems.filter(item => allowedLocations[item.id]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg rounded-2xl bg-slate-900 border border-cyan-500/30 p-6 shadow-[0_0_40px_rgba(6,182,212,0.2)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100 font-['Chakra_Petch']">
                  JARVIS ruxsatlari
                </h2>
                <p className="text-xs text-slate-400">
                  Kompyuteringiz xavfsizligi uchun ruxsat berilgan papkalarni belgilang
                </p>
              </div>
            </div>

            {!isFirstStartup && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Current permissions summary */}
          <div className="my-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              JARVIS hozir quyidagi joylarga ruxsatga ega:
            </p>
            {activeLocations.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {activeLocations.map(item => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-950/60 border border-cyan-500/40 text-cyan-300"
                  >
                    <Check className="w-3 h-3 text-cyan-400" />
                    {item.nameUz.split(' ')[0]} {item.nameUz.split(' ')[1]}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-amber-400">
                ⚠️ Hech qanday papkaga ruxsat berilmagan.
              </p>
            )}
          </div>

          {/* Checklist items */}
          <div className="space-y-2.5 my-4">
            {listItems.map((item) => {
              const isChecked = !!allowedLocations[item.id];
              return (
                <label
                  key={item.id}
                  onClick={() => onToggleLocation(item.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-cyan-950/30 border-cyan-500/40 text-slate-100'
                      : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">
                      {item.nameUz}
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      isChecked
                        ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </label>
              );
            })}
          </div>

          {/* Action button */}
          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => {
                onSave();
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              Saqlash va davom etish
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
