import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Edit3,
  Check,
  Database,
  ShieldCheck,
  RefreshCw,
  Landmark,
  FileText,
  MapPin,
  Phone,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { Pedhi } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface PedhisManagementViewProps {
  onOpenCreatePedhi: () => void;
  onOpenEditPedhi: (pedhi: Pedhi) => void;
}

export const PedhisManagementView: React.FC<PedhisManagementViewProps> = ({
  onOpenCreatePedhi,
  onOpenEditPedhi,
}) => {
  const { pedhis, currentPedhi, switchPedhi, user, currentRole, refreshPedhis } = useAuth();
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleResetSeed = async () => {
    if (
      !confirm(
        'Reset database and re-seed with Girnar Shilp sample data (Showroom, Granite Mills, Mandir Arts, Items & Bills)?'
      )
    ) {
      return;
    }

    setIsResetting(true);
    setMessage(null);
    try {
      const res = await api.resetAndSeed();
      setMessage(res.message);
      await refreshPedhis();
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      alert(err.message || 'Reset failed');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100">Multi-Pedhi & System Settings</h2>
          <p className="text-xs text-slate-400">Enterprise business units, user roles & database</p>
        </div>
        <button
          onClick={onOpenCreatePedhi}
          className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md shadow-amber-950/40 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Pedhi</span>
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 font-semibold">
          {message}
        </div>
      )}

      {/* User & Role Badge */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold text-sm">
            {user?.name?.slice(0, 2).toUpperCase() || 'MK'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-slate-100 text-sm">{user?.name || 'Meet Khetani'}</h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
                {currentRole}
              </span>
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5">{user?.mobile} • {user?.email || 'Admin'}</p>
          </div>
        </div>
      </div>

      {/* Pedhis List */}
      <div className="space-y-3">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
          Registered Business Pedhis ({pedhis.length})
        </span>

        {pedhis.map((p) => {
          const isSelected = currentPedhi?._id === p._id;

          return (
            <div
              key={p._id}
              className={`p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-950/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-100 text-sm">{p.name}</h3>
                    {isSelected && (
                      <span className="flex items-center text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.2 rounded-full">
                        <Check className="w-3 h-3 mr-0.5" /> Active Pedhi
                      </span>
                    )}
                  </div>
                  <p className="text-amber-400/90 font-medium text-xs">{p.businessType}</p>
                  {p.tagline && <p className="text-slate-400 text-[11px] italic">{p.tagline}</p>}

                  <div className="space-y-1 pt-2 text-[11px] text-slate-300">
                    <div className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                      <span>
                        {p.contactDetails?.address}, {p.contactDetails?.city}, {p.contactDetails?.state}
                      </span>
                    </div>
                    {p.contactDetails?.gstNumber && (
                      <div className="flex items-center font-mono">
                        <FileText className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                        <span>GSTIN: {p.contactDetails.gstNumber}</span>
                      </div>
                    )}
                    {p.bankDetails?.bankName && (
                      <div className="flex items-center font-mono text-[10px] text-slate-400">
                        <Landmark className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                        <span>
                          {p.bankDetails.bankName} • A/C: {p.bankDetails.accountNumber} ({p.bankDetails.ifscCode})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onOpenEditPedhi(p)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Edit Pedhi Settings"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {!isSelected && (
                    <button
                      onClick={() => switchPedhi(p._id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Switch
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Database & System Info */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-slate-200">Database Engine</h3>
          </div>
          <span className="flex items-center text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
            MongoDB Atlas Connected
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          Connected to multi-region MongoDB Atlas replica set with ACID transaction support for invoicing, khata ledger,
          and inventory reconciliation.
        </p>

        <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
          <div>
            <span className="font-semibold text-slate-300 block">Reset & Seed Sample Data</span>
            <span className="text-[10px] text-slate-500">Restore default Girnar Shilp pedhis and sample bills</span>
          </div>
          <button
            onClick={handleResetSeed}
            disabled={isResetting}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-3 py-1.5 rounded-xl font-bold cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isResetting ? 'Resetting...' : 'Re-seed Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
