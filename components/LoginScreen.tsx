'use client';

import React, { useState } from 'react';
import { Lock, User, KeyRound, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      // Kullanıcı adı: mustafa | Şifre: 147258
      if (username.trim().toLowerCase() === 'mustafa' && password === '147258') {
        if (rememberMe) {
          localStorage.setItem('borc_takip_auth_token', 'session_active_mustafa');
        } else {
          sessionStorage.setItem('borc_takip_auth_token', 'session_active_mustafa');
        }
        onSuccess();
      } else {
        setError('Hatalı kullanıcı adı veya şifre! Lütfen tekrar deneyin.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#090d16] px-4 py-8 relative overflow-hidden selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      {/* Arka plan görsel efektleri */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Logo & Güvenlik Başlığı */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-emerald-500/25 text-white mb-3.5">
            <Lock className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Borç & Finans Takip
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>Güvenli Giriş Paneli</span>
          </p>
        </div>

        {/* Hata Uyarısı */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-rose-600 dark:text-rose-300 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Giriş Formu */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kullanıcı Adı */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Kullanıcı Adı:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="mustafa"
                autoComplete="username"
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Şifre */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Şifre:
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                autoComplete="current-password"
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
              />
            </div>
          </div>

          {/* Beni Hatırla */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-emerald-600 focus:ring-emerald-500/20 focus:ring-offset-0 w-4 h-4 accent-emerald-600"
              />
              <span>Beni Hatırla</span>
            </label>
            <span className="text-slate-500 text-[11px]">Kişisel Hesap</span>
          </div>

          {/* Giriş Butonu */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Giriş Yapılıyor...</span>
            ) : (
              <>
                <span>Giriş Yap</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-6">
          🔒 Verileriniz uçtan uca cihazınızda güvenle korunur.
        </p>
      </div>
    </div>
  );
};
