'use client';

import React from 'react';
import { LayoutDashboard, CreditCard, CalendarDays, ReceiptText, Activity } from 'lucide-react';

export type TabType = 'dashboard' | 'debts' | 'calendar' | 'payments' | 'analysis';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  overdueBadgeCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  overdueBadgeCount,
}) => {
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Ana Sayfa', icon: LayoutDashboard },
    { id: 'debts' as TabType, label: 'Borçlar', icon: CreditCard },
    { id: 'calendar' as TabType, label: 'Takvim', icon: CalendarDays },
    { id: 'payments' as TabType, label: 'Ödemeler', icon: ReceiptText },
    { id: 'analysis' as TabType, label: 'Analiz', icon: Activity },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 md:py-2">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.id === 'dashboard' && overdueBadgeCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {overdueBadgeCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
