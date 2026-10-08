'use client';

import React from 'react';
import { Plus, Calendar, RotateCcw, LogOut, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentDate: string;
  onDateChange: (newDate: string) => void;
  onOpenAddModal: () => void;
  onResetData: () => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  onDateChange,
  onOpenAddModal,
  onResetData,
  onLogout,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#090d16]/90 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/80 px-4 py-3 shadow-xs">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Başlık */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-lg">
            ₺
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Finans & Borç Takip
              </h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                PRO
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>Tarih:</span>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-emerald-300 font-medium px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Açık/Koyu Tema Değiştirici */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Açık Beyaz Temaya Geç' : 'Koyu Temaya Geç'}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1 text-xs active:scale-95"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline text-slate-200 font-medium">Açık</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span className="hidden md:inline text-slate-700 font-medium">Koyu</span>
              </>
            )}
          </button>

          <button
            onClick={onResetData}
            title="Örnek verileri sıfırla"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700/60 transition-colors text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Sıfırla</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-3 py-2 rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Yeni Borç</span>
            <span className="sm:hidden">Ekle</span>
          </button>

          <button
            onClick={onLogout}
            title="Güvenli Çıkış Yap"
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/20 dark:border-rose-500/30 transition-colors text-xs flex items-center gap-1 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Çıkış</span>
          </button>
        </div>
      </div>
    </header>
  );
};
