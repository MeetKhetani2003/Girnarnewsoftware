import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Menu,
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
  onOpenDrawer: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  onOpenDrawer,
}) => {
  const quickTabs = [
    { id: 'dashboard' as TabType, label: 'Home', icon: LayoutDashboard },
    {
      id: 'orders' as TabType,
      label: 'Orders',
      icon: ShoppingBag,
      badge: 'Sq.Ft',
    },
    { id: 'invoices' as TabType, label: 'Bills', icon: FileText },
  ];

  const isMoreActive =
    activeTab !== 'dashboard' && activeTab !== 'orders' && activeTab !== 'invoices';

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-t border-slate-800/90 px-3 py-1.5 sticky bottom-0 z-30 select-none">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {quickTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
              )}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'scale-110 text-amber-400' : 'text-slate-400'
                  } transition-transform`}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-3 text-[8px] bg-amber-500 text-slate-950 font-bold px-1 py-0.2 rounded-full leading-none">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight font-medium">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* 4th Item: Drawer Trigger (Opens All Modules & Features) */}
        <button
          onClick={onOpenDrawer}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer relative ${
            isMoreActive
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Open All Features Drawer"
        >
          {isMoreActive && (
            <span className="absolute -top-1 w-6 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
          )}
          <div className="relative">
            <Menu
              className={`w-5 h-5 ${
                isMoreActive ? 'scale-110 text-amber-400' : 'text-slate-400'
              } transition-transform`}
            />
            {isMoreActive && (
              <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-900"></span>
            )}
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight font-medium">
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
};
