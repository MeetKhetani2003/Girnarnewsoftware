import React from 'react';
import {
  X,
  Building2,
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
  PlusCircle,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { TabType } from './BottomNavigation.tsx';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenNewOrder: () => void;
  onOpenNewInvoice: () => void;
  onOpenNewPayment: (type: 'PAYMENT_IN' | 'PAYMENT_OUT') => void;
  onOpenPedhiSelector: () => void;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onOpenNewOrder,
  onOpenNewInvoice,
  onOpenNewPayment,
  onOpenPedhiSelector,
}) => {
  const { currentPedhi, pedhis, switchPedhi, currentRole } = useAuth();

  if (!isOpen) return null;

  const handleNav = (tab: TabType) => {
    onSelectTab(tab);
    onClose();
  };

  const sections = [
    {
      title: 'CORE TRANSACTIONS',
      items: [
        {
          id: 'dashboard' as TabType,
          label: 'Dashboard Overview',
          desc: 'Sales KPIs, Today Bookings & Stock Status',
          icon: LayoutDashboard,
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/10 border-amber-500/30',
        },
        {
          id: 'orders' as TabType,
          label: 'Orders & Custom Costing',
          desc: 'Custom supplier pricing & net profit tracking',
          icon: ShoppingBag,
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10 border-emerald-500/30',
          badge: 'Sq.Ft & Live Profit',
        },
        {
          id: 'invoices' as TabType,
          label: 'GST Invoices & Billing',
          desc: 'Tax invoices, PDF view, WhatsApp share & payment status',
          icon: FileText,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10 border-blue-500/30',
        },
      ],
    },
    {
      title: '3 PRODUCT LINES & FACTORY SOURCING',
      items: [
        {
          id: 'takti-calc' as TabType,
          label: 'Takti Sq.Ft Profit Engine',
          desc: 'L" × W" ÷ 144 • Custom quarry rate (e.g. ₹450 vs ₹500)',
          icon: Calculator,
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/10 border-amber-500/30',
          badge: 'Factory Costing',
        },
        {
          id: 'inventory' as TabType,
          label: 'Inventory & Stock Management',
          desc: 'Taktis (Sq.Ft), Sevan Mandirs (Pcs), Makrana Murtis',
          icon: Package,
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-500/10 border-cyan-500/30',
        },
        {
          id: 'suppliers' as TabType,
          label: 'Quarries & Sourcing Suppliers',
          desc: 'Rajasthan quarries, stone lots, supplier ledger & pricing',
          icon: Truck,
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/10 border-orange-500/30',
        },
        {
          id: 'transfers' as TabType,
          label: 'Inter-Pedhi Stock Transfers',
          desc: 'Move inventory seamlessly between the 4 Pedhis',
          icon: ArrowLeftRight,
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10 border-purple-500/30',
        },
      ],
    },
    {
      title: 'KHATA & CASHBOOK (ROJMEL)',
      items: [
        {
          id: 'parties' as TabType,
          label: 'Parties & Khata Ledger',
          desc: 'Customers, Trust, Derasar, Lena & Dena balances',
          icon: Users,
          color: 'text-rose-400',
          bgColor: 'bg-rose-500/10 border-rose-500/30',
        },
        {
          id: 'rojmel' as TabType,
          label: 'Rojmel / Daily Daybook',
          desc: 'Jama (Cash In) & Naame (Cash Out) register',
          icon: BookOpen,
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10 border-emerald-500/30',
        },
      ],
    },
    {
      title: 'ENTERPRISE & DEVELOPER',
      items: [
        {
          id: 'pedhis' as TabType,
          label: '4 Pedhis Management',
          desc: 'Girnarshilp, ArvindRamjibhai, Jaipurshilp, Bhagvati',
          icon: Settings,
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/10 border-amber-500/30',
        },
        {
          id: 'expo' as TabType,
          label: 'Expo Native & Serverless API Hub',
          desc: 'Next-Native serverless runner, QR code, live testing',
          icon: Zap,
          color: 'text-indigo-400',
          bgColor: 'bg-indigo-500/10 border-indigo-500/30',
          badge: 'Serverless APIs',
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-out Drawer Panel */}
      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className="w-80 sm:w-96 bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col h-full overflow-hidden">
          {/* Drawer Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800/90 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-950/40">
                <Building2 className="w-5 h-5 text-slate-950" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span className="truncate">{currentPedhi?.name || 'Girnar Shilp'}</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                    {currentRole}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {currentPedhi?.contactDetails?.city || 'Gujarat'} • {currentPedhi?.businessType || 'Vyapar'}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Shortcuts inside Drawer */}
          <div className="p-3 bg-slate-950/50 border-b border-slate-800 grid grid-cols-3 gap-1.5 text-center">
            <button
              onClick={() => {
                onClose();
                onOpenNewOrder();
              }}
              className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>+ Order</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenNewInvoice();
              }}
              className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>+ Bill</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenNewPayment('PAYMENT_IN');
              }}
              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Jama</span>
            </button>
          </div>

          {/* Fast 4-Pedhi Switcher Strip inside Drawer */}
          <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Business Pedhi (4 Units)
              </span>
              <button
                onClick={() => {
                  onClose();
                  onOpenPedhiSelector();
                }}
                className="text-[10px] text-amber-400 hover:underline cursor-pointer"
              >
                Manage All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {pedhis.map((p) => {
                const isSelected = p._id === currentPedhi?._id;
                return (
                  <button
                    key={p._id}
                    onClick={() => {
                      switchPedhi(p._id);
                      onClose();
                    }}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[11px] truncate">{p.name.split(' ')[0]}</div>
                    <div className="text-[9px] text-slate-500 truncate">{p.contactDetails?.city || 'GJ'}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categorized Menu List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {sections.map((sec) => (
              <div key={sec.title} className="space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
                  {sec.title}
                </div>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold shadow-sm'
                          : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center border ${item.bgColor} ${item.color} shrink-0`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left min-w-0">
                          <div className="text-xs font-bold text-slate-200 truncate flex items-center gap-1.5">
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">{item.desc}</div>
                        </div>
                      </div>

                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Drawer Footer */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Girnar Shilp Vyapar v1.0</span>
            <span className="text-emerald-400 font-mono">MongoDB Atlas Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
