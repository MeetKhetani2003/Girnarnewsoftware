import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Phone, Share2, MapPin, ChevronRight, Edit3, Trash2 } from 'lucide-react';
import { Customer } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface PartiesViewProps {
  onOpenCreateCustomer: () => void;
  onOpenEditCustomer: (customer: Customer) => void;
  onOpenLedgerStatement: (customerId: string) => void;
}

export const PartiesView: React.FC<PartiesViewProps> = ({
  onOpenCreateCustomer,
  onOpenEditCustomer,
  onOpenLedgerStatement,
}) => {
  const { currentPedhi } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'to_receive' | 'to_pay' | 'settled'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadCustomers = async () => {
    if (!currentPedhi?._id) return;
    setIsLoading(true);
    try {
      const res = await api.getCustomers(currentPedhi._id, {
        search: search || undefined,
        filter: filter !== 'all' ? filter : undefined,
      });
      setCustomers(res.customers || []);
    } catch (err) {
      console.error('Failed to load parties:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [currentPedhi, search, filter]);

  // Totals
  let totalLena = 0;
  let totalDena = 0;
  customers.forEach((c) => {
    if (c.currentBalance > 0) totalLena += c.currentBalance;
    if (c.currentBalance < 0) totalDena += Math.abs(c.currentBalance);
  });

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Top Header & Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100">Parties & Khata (Ledger)</h2>
          <p className="text-xs text-slate-400">Track party balances & customer accounts</p>
        </div>
        <button
          onClick={onOpenCreateCustomer}
          className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md shadow-amber-950/40 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Party</span>
        </button>
      </div>

      {/* Lena / Dena Balance Banner */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-3">
          <span className="text-[11px] text-emerald-300 block font-medium">To Receive (Lena)</span>
          <div className="text-base font-black font-mono text-emerald-400 mt-0.5">
            ₹{totalLena.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-3">
          <span className="text-[11px] text-rose-300 block font-medium">To Pay (Dena)</span>
          <div className="text-base font-black font-mono text-rose-400 mt-0.5">
            ₹{totalDena.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search party by name, mobile, city, GSTIN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
            filter === 'all' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({customers.length})
        </button>
        <button
          onClick={() => setFilter('to_receive')}
          className={`flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
            filter === 'to_receive'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Lena
        </button>
        <button
          onClick={() => setFilter('to_pay')}
          className={`flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
            filter === 'to_pay'
              ? 'bg-rose-500 text-white font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Dena
        </button>
        <button
          onClick={() => setFilter('settled')}
          className={`flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
            filter === 'settled'
              ? 'bg-slate-700 text-slate-100 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Settled
        </button>
      </div>

      {/* Parties List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading parties...</div>
        ) : customers.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
            No parties found. Click "+ Add Party" to register your first client or vendor.
          </div>
        ) : (
          customers.map((c) => {
            const bal = c.currentBalance || 0;
            const isLena = bal > 0;
            const isDena = bal < 0;

            return (
              <div
                key={c._id}
                className="bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/80 rounded-xl p-3.5 transition-all flex flex-col space-y-2.5"
              >
                <div
                  onClick={() => onOpenLedgerStatement(c._id)}
                  className="flex items-start justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-slate-100 text-sm">{c.name}</h3>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded border border-slate-700">
                        {c.partyType}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center">
                        <Phone className="w-3 h-3 mr-1 text-slate-500" />
                        {c.mobile}
                      </span>
                      {c.city && (
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1 text-slate-500" />
                          {c.city}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-sm font-black font-mono ${
                        isLena ? 'text-emerald-400' : isDena ? 'text-rose-400' : 'text-slate-400'
                      }`}
                    >
                      ₹{Math.abs(bal).toLocaleString('en-IN')}
                    </div>
                    <span
                      className={`text-[9px] font-bold block uppercase mt-0.5 ${
                        isLena ? 'text-emerald-400' : isDena ? 'text-rose-400' : 'text-slate-500'
                      }`}
                    >
                      {isLena ? 'Lena (Receive)' : isDena ? 'Dena (Pay)' : 'Settled'}
                    </span>
                  </div>
                </div>

                {/* Bottom Bar: Action buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <button
                    onClick={() => onOpenLedgerStatement(c._id)}
                    className="text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View Khata Statement</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onOpenEditCustomer(c)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer"
                      title="Edit Party Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
