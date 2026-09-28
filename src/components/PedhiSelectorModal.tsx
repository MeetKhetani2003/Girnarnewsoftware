import React from 'react';
import { X, Building2, Plus, Check, ShieldCheck, MapPin, ReceiptText } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface PedhiSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreatePedhi: () => void;
}

export const PedhiSelectorModal: React.FC<PedhiSelectorModalProps> = ({
  isOpen,
  onClose,
  onOpenCreatePedhi,
}) => {
  const { pedhis, currentPedhi, switchPedhi, user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div>
            <h3 className="font-bold text-slate-100 text-base">Select Business Pedhi</h3>
            <p className="text-xs text-slate-400">Switch between your firms and branches</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Pedhis */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1">
          {pedhis.map((pedhi) => {
            const isSelected = currentPedhi?._id === pedhi._id;
            const roleInPedhi = user?.pedhis?.find((p) => p.pedhiId === pedhi._id)?.role || 'Admin';

            return (
              <div
                key={pedhi._id}
                onClick={() => {
                  switchPedhi(pedhi._id);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-950/20'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-extrabold'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm text-slate-100">{pedhi.name}</h4>
                        {isSelected && (
                          <span className="flex items-center text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-1.5 py-0.5 rounded">
                            <Check className="w-3 h-3 mr-0.5" /> Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{pedhi.businessType}</p>
                      
                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-2">
                        <span className="flex items-center text-slate-300">
                          <MapPin className="w-3 h-3 mr-1 text-slate-500" />
                          {pedhi.contactDetails?.city || 'Gujarat'}
                        </span>
                        {pedhi.contactDetails?.gstNumber && (
                          <span className="flex items-center font-mono text-slate-300">
                            <ReceiptText className="w-3 h-3 mr-1 text-slate-500" />
                            {pedhi.contactDetails.gstNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                    {roleInPedhi}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Pedhi Button */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <button
            onClick={() => {
              onClose();
              onOpenCreatePedhi();
            }}
            className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold py-2.5 px-4 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>+ Add New Pedhi / Branch</span>
          </button>
        </div>
      </div>
    </div>
  );
};
