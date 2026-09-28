import React from 'react';
import { ChevronDown, Building2, User, PlusCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface HeaderProps {
  onOpenPedhiSelector: () => void;
  onOpenNewInvoice: () => void;
  onOpenNewPayment: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPedhiSelector,
  onOpenNewInvoice,
  onOpenNewPayment,
}) => {
  const { currentPedhi, user, currentRole } = useAuth();

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        {/* Pedhi Selector Trigger */}
        <button
          onClick={onOpenPedhiSelector}
          className="flex items-center space-x-2 text-left group hover:opacity-90 transition-opacity cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-950/40">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-bold text-sm text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1 max-w-[170px] sm:max-w-[240px]">
                {currentPedhi?.name || 'Select Pedhi'}
              </span>
              <ChevronDown className="w-4 h-4 text-amber-400 group-hover:translate-y-0.5 transition-transform" />
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
              <span className="text-amber-400/90 font-medium">
                {currentPedhi?.contactDetails?.city || 'Gujarat'}
              </span>
              <span>•</span>
              <span className="truncate max-w-[120px]">{currentPedhi?.businessType || 'Vyapar'}</span>
            </div>
          </div>
        </button>

        {/* Quick action buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onOpenNewPayment}
            className="flex items-center space-x-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            title="Record Jama / Naame (Payment)"
          >
            <span>+ Jama</span>
          </button>
          <button
            onClick={onOpenNewInvoice}
            className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-md shadow-amber-950/30 transition-all cursor-pointer"
            title="Create Tax Invoice"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Bill</span>
          </button>
        </div>
      </div>
    </div>
  );
};
