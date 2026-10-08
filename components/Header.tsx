'use client';

import React from 'react';
import { Plus, ShieldAlert, Calendar, RotateCcw, Sparkles } from 'lucide-react';
import { formatDateTR } from '@/lib/calculations';

interface HeaderProps {
  currentDate: string;
  onDateChange: (newDate: string) => void;
  onOpenAddModal: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  onDateChange,
  onOpenAddModal,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Başlık */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-lg">
            ₺
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Finans & Borç Takip
              </h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                PRO
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simülasyon Tarihi:</span>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-slate-800/90 text-emerald-300 font-medium px-2 py-0.5 rounded border border-slate-700 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResetData}
            title="Örnek verileri sıfırla"
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition-colors text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Sıfırla</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Yeni Borç</span>
          </button>
        </div>
      </div>
    </header>
  );
};
