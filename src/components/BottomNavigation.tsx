import React from 'react';
import { LayoutDashboard, ShoppingBag, FileText, Package, Users, Truck, ArrowLeftRight, BookOpen, Settings } from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'orders'
  | 'invoices'
  | 'inventory'
  | 'parties'
  | 'suppliers'
  | 'transfers'
  | 'rojmel'
  | 'pedhis';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Home', icon: LayoutDashboard },
    { id: 'orders' as TabType, label: 'Orders', icon: ShoppingBag },
    { id: 'invoices' as TabType, label: 'Bills', icon: FileText },
    { id: 'inventory' as TabType, label: 'Stock', icon: Package },
    { id: 'parties' as TabType, label: 'Khata', icon: Users },
    { id: 'suppliers' as TabType, label: 'Quarries', icon: Truck },
    { id: 'transfers' as TabType, label: 'Transfers', icon: ArrowLeftRight },
    { id: 'rojmel' as TabType, label: 'Rojmel', icon: BookOpen },
    { id: 'pedhis' as TabType, label: 'Pedhis', icon: Settings },
  ];

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-t border-slate-800/90 px-1 py-1.5 sticky bottom-0 z-30 overflow-x-auto no-scrollbar">
      <div className="flex items-center justify-between min-w-full sm:justify-around space-x-1 sm:space-x-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer relative shrink-0 ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
              )}
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
