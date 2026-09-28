import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Calculator,
  FileText,
  Package,
  Users,
  Truck,
  ArrowLeftRight,
  BookOpen,
  Settings,
  Zap,
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'orders'
  | 'takti-calc'
  | 'invoices'
  | 'inventory'
  | 'parties'
  | 'suppliers'
  | 'transfers'
  | 'rojmel'
  | 'pedhis'
  | 'expo';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Home', icon: LayoutDashboard },
    { id: 'orders' as TabType, label: 'Orders', icon: ShoppingBag },
    { id: 'takti-calc' as TabType, label: 'Takti Calc', icon: Calculator, badge: 'Sq.Ft' },
    { id: 'invoices' as TabType, label: 'Bills', icon: FileText },
    { id: 'inventory' as TabType, label: 'Stock', icon: Package },
    { id: 'parties' as TabType, label: 'Khata', icon: Users },
    { id: 'suppliers' as TabType, label: 'Quarries', icon: Truck },
    { id: 'transfers' as TabType, label: 'Transfers', icon: ArrowLeftRight },
    { id: 'rojmel' as TabType, label: 'Rojmel', icon: BookOpen },
    { id: 'expo' as TabType, label: 'Expo API', icon: Zap, highlight: true },
    { id: 'pedhis' as TabType, label: 'Pedhis', icon: Settings },
  ];

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-t border-slate-800/90 px-1 py-1 sticky bottom-0 z-30 overflow-x-auto no-scrollbar">
      <div className="flex items-center min-w-max space-x-1 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer relative shrink-0 ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : tab.highlight
                  ? 'text-indigo-400 hover:text-indigo-200'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-5 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
              )}
              <div className="relative">
                <Icon
                  className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${
                    isActive ? 'scale-110' : ''
                  } transition-transform`}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 text-[7px] bg-amber-500 text-slate-950 font-bold px-0.8 py-0.1 rounded-full leading-none">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
