import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowDownRight, ArrowUpRight, Plus, Filter, Calendar, Trash2 } from 'lucide-react';
import { Transaction } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface RojmelViewProps {
  onOpenNewPayment: (type?: 'PAYMENT_IN' | 'PAYMENT_OUT') => void;
}

export const RojmelView: React.FC<RojmelViewProps> = ({ onOpenNewPayment }) => {
  const { currentPedhi } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [modeFilter, setModeFilter] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [summary, setSummary] = useState({ count: 0, totalIn: 0, totalOut: 0, netBalance: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const loadTransactions = async () => {
    if (!currentPedhi?._id) return;
    setIsLoading(true);
    try {
      const res = await api.getTransactions(currentPedhi._id, {
        type: typeFilter !== 'All' ? typeFilter : undefined,
        paymentMode: modeFilter !== 'All' ? modeFilter : undefined,
        date: selectedDate || undefined,
      });
      setTransactions(res.transactions || []);
      setSummary(res.summary || { count: 0, totalIn: 0, totalOut: 0, netBalance: 0 });
    } catch (err) {
      console.error('Failed to load rojmel:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [currentPedhi, typeFilter, modeFilter, selectedDate]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment entry? Party balance will be reverted.')) {
      return;
    }
    try {
      await api.deleteTransaction(id);
      loadTransactions();
    } catch (err: any) {
      alert(err.message || 'Failed to delete entry');
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100">Rojmel (Daybook & Cashbook)</h2>
          <p className="text-xs text-slate-400">Daily cashflow, karigar wages & party payments</p>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onOpenNewPayment('PAYMENT_IN')}
            className="flex items-center space-x-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>+ Jama</span>
          </button>
          <button
            onClick={() => onOpenNewPayment('PAYMENT_OUT')}
            className="flex items-center space-x-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+ Naame</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-2.5">
          <span className="text-[10px] text-emerald-300 block font-medium">Total In (Jama)</span>
          <div className="text-sm font-black font-mono text-emerald-400 mt-0.5">
            +₹{summary.totalIn.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-2.5">
          <span className="text-[10px] text-rose-300 block font-medium">Total Out (Naame)</span>
          <div className="text-sm font-black font-mono text-rose-400 mt-0.5">
            -₹{summary.totalOut.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
          <span className="text-[10px] text-slate-400 block font-medium">Net Flow</span>
          <div
            className={`text-sm font-black font-mono mt-0.5 ${
              summary.netBalance >= 0 ? 'text-amber-400' : 'text-rose-400'
            }`}
          >
            ₹{summary.netBalance.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Date & Mode Filters */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="block text-slate-400 text-[10px] mb-1">Filter by Date</label>
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-200 text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-[10px] mb-1">Payment Mode</label>
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-medium"
          >
            <option value="All">All Modes</option>
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>
      </div>

      {/* Type Toggle */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setTypeFilter('All')}
          className={`flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
            typeFilter === 'All'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Entries ({transactions.length})
        </button>
        <button
          onClick={() => setTypeFilter('PAYMENT_IN')}
          className={`flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
            typeFilter === 'PAYMENT_IN'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Jama (Inflow)
        </button>
        <button
          onClick={() => setTypeFilter('PAYMENT_OUT')}
          className={`flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
            typeFilter === 'PAYMENT_OUT'
              ? 'bg-rose-500 text-white font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Naame (Outflow)
        </button>
      </div>

      {/* Transaction Feed */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading cashbook...</div>
        ) : transactions.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
            No entries found for the selected filters.
          </div>
        ) : (
          transactions.map((tx) => {
            const isIn = tx.type === 'PAYMENT_IN';

            return (
              <div
                key={tx._id}
                className="bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/80 rounded-xl p-3 transition-all flex items-center justify-between"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mt-0.5 ${
                      isIn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {isIn ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-100 text-xs">{tx.partyName}</h4>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="text-amber-400 font-medium">{tx.category}</span>
                      <span>•</span>
                      <span>{tx.paymentMode}</span>
                      {tx.referenceNumber && <span>• Ref: {tx.referenceNumber}</span>}
                    </div>
                    {tx.notes && <p className="text-[10px] text-slate-500 mt-0.5 italic">{tx.notes}</p>}
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {new Date(tx.date).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end space-y-1">
                  <div
                    className={`font-mono font-bold text-sm ${
                      isIn ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isIn ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </div>

                  <button
                    onClick={() => handleDelete(tx._id)}
                    className="p-1 rounded text-slate-600 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
