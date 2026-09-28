import React from 'react';
import { ChevronDown, Building2, User, PlusCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface HeaderProps {
  onOpenPedhiSelector: () => void;
  onOpenNewInvoice: () => void;
  onOpenNewPayment: () => void;
  onOpenExpoHub?: () => void;
  onOpenTaktiCalc?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPedhiSelector,
  onOpenNewInvoice,
  onOpenNewPayment,
  onOpenExpoHub,
  onOpenTaktiCalc,
}) => {
  const { currentPedhi, user, currentRole } = useAuth();

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-3.5 py-2.5 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        {/* Pedhi Selector Trigger */}
        <button
          onClick={onOpenPedhiSelector}
          className="flex items-center space-x-2 text-left group hover:opacity-90 transition-opacity cursor-pointer min-w-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-950/40 shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1">
              <span className="font-bold text-xs sm:text-sm text-slate-100 group-hover:text-amber-300 transition-colors truncate max-w-[130px] sm:max-w-[190px]">
                {currentPedhi?.name || 'Select Pedhi'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400 group-hover:translate-y-0.5 transition-transform shrink-0" />
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
              <span className="text-amber-400 font-medium">
                {currentPedhi?.contactDetails?.city || 'Gujarat'}
              </span>
              <span>•</span>
              <span className="truncate max-w-[100px]">{currentPedhi?.businessType || 'Vyapar'}</span>
            </div>
          </div>
        </button>

        {/* Quick action buttons & Expo trigger */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {onOpenTaktiCalc && (
            <button
              onClick={onOpenTaktiCalc}
              className="flex items-center space-x-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              title="Takti Square Feet & Custom Supplier Profit Calculator"
            >
              <span>📐 Takti</span>
            </button>
          )}

          {onOpenExpoHub && (
            <button
              onClick={onOpenExpoHub}
              className="flex items-center space-x-1 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              title="Open Expo Native & Serverless API Hub"
            >
              <span>⚡ Expo</span>
            </button>
          )}

          <button
            onClick={onOpenNewPayment}
            className="flex items-center space-x-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            title="Record Jama / Naame (Payment)"
          >
            <span>+ Jama</span>
          </button>

          <button
            onClick={onOpenNewInvoice}
            className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1.5 rounded-lg text-xs shadow-md shadow-amber-950/30 transition-all cursor-pointer"
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

