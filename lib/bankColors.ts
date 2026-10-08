export interface BankTheme {
  primary: string;         // Hex ana renk
  secondary: string;       // İkincil renk
  badgeBg: string;         // Tailwind arka plan
  badgeText: string;       // Tailwind yazı rengi
  badgeBorder: string;     // Tailwind çerçeve
  gradientFrom: string;    // Gradient başlangıç
  gradientTo: string;      // Gradient bitiş
  accentText: string;      // Öne çıkan metin rengi
  glowColor: string;       // CSS glow efekti (rgba)
}

export function getBankTheme(bankName?: string): BankTheme {
  const normalized = (bankName || '').toLowerCase().trim();

  // 1. Yapı Kredi (Karakteristik Koç / Yapı Kredi Mavisi)
  if (normalized.includes('yapı kredi') || normalized.includes('yapi kredi') || normalized.includes('worldcard')) {
    return {
      primary: '#0047bb',
      secondary: '#002875',
      badgeBg: 'bg-blue-600/20',
      badgeText: 'text-blue-300',
      badgeBorder: 'border-blue-500/40',
      gradientFrom: 'from-blue-600',
      gradientTo: 'to-indigo-700',
      accentText: 'text-blue-400',
      glowColor: 'rgba(0, 71, 187, 0.25)',
    };
  }

  // 2. Akbank / Axess (Karakteristik Akbank Kırmızısı)
  if (normalized.includes('akbank') || normalized.includes('axess') || normalized.includes('wings')) {
    return {
      primary: '#e30613',
      secondary: '#9e0009',
      badgeBg: 'bg-red-600/20',
      badgeText: 'text-red-300',
      badgeBorder: 'border-red-500/40',
      gradientFrom: 'from-red-600',
      gradientTo: 'to-rose-700',
      accentText: 'text-red-400',
      glowColor: 'rgba(227, 6, 19, 0.25)',
    };
  }

  // 3. Enpara (Karakteristik Enpara Moru / Eflatun)
  if (normalized.includes('enpara')) {
    return {
      primary: '#6b21a8',
      secondary: '#4c1d95',
      badgeBg: 'bg-purple-600/20',
      badgeText: 'text-purple-300',
      badgeBorder: 'border-purple-500/40',
      gradientFrom: 'from-purple-600',
      gradientTo: 'to-violet-700',
      accentText: 'text-purple-400',
      glowColor: 'rgba(107, 33, 168, 0.3)',
    };
  }

  // 4. Garanti BBVA (Karakteristik Garanti Yeşili)
  if (normalized.includes('garanti') || normalized.includes('bonus')) {
    return {
      primary: '#008542',
      secondary: '#005826',
      badgeBg: 'bg-emerald-600/20',
      badgeText: 'text-emerald-300',
      badgeBorder: 'border-emerald-500/40',
      gradientFrom: 'from-emerald-600',
      gradientTo: 'to-teal-700',
      accentText: 'text-emerald-400',
      glowColor: 'rgba(0, 133, 66, 0.25)',
    };
  }

  // 5. Türkiye İş Bankası (İş Bankası Laciverti / Maximum)
  if (normalized.includes('iş bankası') || normalized.includes('is bankasi') || normalized.includes('maximum')) {
    return {
      primary: '#003882',
      secondary: '#001e4a',
      badgeBg: 'bg-indigo-600/20',
      badgeText: 'text-indigo-300',
      badgeBorder: 'border-indigo-500/40',
      gradientFrom: 'from-blue-700',
      gradientTo: 'to-indigo-800',
      accentText: 'text-indigo-400',
      glowColor: 'rgba(0, 56, 130, 0.25)',
    };
  }

  // 6. Ziraat Bankası (Ziraat Kırmızısı)
  if (normalized.includes('ziraat')) {
    return {
      primary: '#c8102e',
      secondary: '#8a0018',
      badgeBg: 'bg-rose-700/20',
      badgeText: 'text-rose-300',
      badgeBorder: 'border-rose-600/40',
      gradientFrom: 'from-rose-700',
      gradientTo: 'to-red-800',
      accentText: 'text-rose-400',
      glowColor: 'rgba(200, 16, 46, 0.25)',
    };
  }

  // 7. VakıfBank (Karakteristik VakıfBank Sarısı / Gold)
  if (normalized.includes('vakıf') || normalized.includes('vakif')) {
    return {
      primary: '#fdb913',
      secondary: '#b45309',
      badgeBg: 'bg-amber-500/20',
      badgeText: 'text-amber-300',
      badgeBorder: 'border-amber-500/40',
      gradientFrom: 'from-amber-500',
      gradientTo: 'to-yellow-600',
      accentText: 'text-amber-400',
      glowColor: 'rgba(253, 185, 19, 0.25)',
    };
  }

  // 8. QNB Finansbank (Koyu Mavi / Cyan)
  if (normalized.includes('qnb') || normalized.includes('finansbank')) {
    return {
      primary: '#005b94',
      secondary: '#003459',
      badgeBg: 'bg-sky-600/20',
      badgeText: 'text-sky-300',
      badgeBorder: 'border-sky-500/40',
      gradientFrom: 'from-sky-600',
      gradientTo: 'to-blue-700',
      accentText: 'text-sky-400',
      glowColor: 'rgba(0, 91, 148, 0.25)',
    };
  }

  // 9. TEB (Karakteristik Koyu Yeşil)
  if (normalized.includes('teb')) {
    return {
      primary: '#008752',
      secondary: '#005232',
      badgeBg: 'bg-emerald-700/20',
      badgeText: 'text-emerald-300',
      badgeBorder: 'border-emerald-600/40',
      gradientFrom: 'from-emerald-700',
      gradientTo: 'to-teal-800',
      accentText: 'text-emerald-400',
      glowColor: 'rgba(0, 135, 82, 0.25)',
    };
  }

  // 10. DenizBank (Deniz Mavisi)
  if (normalized.includes('deniz')) {
    return {
      primary: '#006699',
      secondary: '#003e5c',
      badgeBg: 'bg-cyan-600/20',
      badgeText: 'text-cyan-300',
      badgeBorder: 'border-cyan-500/40',
      gradientFrom: 'from-cyan-600',
      gradientTo: 'to-blue-700',
      accentText: 'text-cyan-400',
      glowColor: 'rgba(0, 102, 153, 0.25)',
    };
  }

  // Varsayılan / Belirlenecek (Sleek Slate)
  return {
    primary: '#475569',
    secondary: '#1e293b',
    badgeBg: 'bg-slate-700/20',
    badgeText: 'text-slate-300',
    badgeBorder: 'border-slate-600/40',
    gradientFrom: 'from-slate-600',
    gradientTo: 'to-slate-700',
    accentText: 'text-slate-300',
    glowColor: 'rgba(71, 85, 105, 0.2)',
  };
}
