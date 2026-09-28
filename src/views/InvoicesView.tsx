import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, FileText, ChevronRight, Filter, Calendar } from 'lucide-react';
import { Invoice } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface InvoicesViewProps {
  onOpenNewInvoice: () => void;
  onSelectInvoice: (invoice: Invoice) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  onOpenNewInvoice,
  onSelectInvoice,
}) => {
  const { currentPedhi } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('All');
  const [summary, setSummary] = useState({ count: 0, totalAmount: 0, totalDue: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const loadInvoices = async () => {
    if (!currentPedhi?._id) return;
    setIsLoading(true);
    try {
      const res = await api.getInvoices(currentPedhi._id, {
        status: status !== 'All' ? status : undefined,
        search: search || undefined,
      });
      setInvoices(res.invoices || []);
      setSummary(res.summary || { count: 0, totalAmount: 0, totalDue: 0 });
    } catch (err) {
      console.error('Failed to load bills:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [currentPedhi, search, status]);

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Top Header & New Bill Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100">Sales Invoices (Vyapar Bills)</h2>
          <p className="text-xs text-slate-400">GST Bills, Cash Memos & Delivery Challans</p>
        </div>
        <button
          onClick={onOpenNewInvoice}
          className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md shadow-amber-950/40 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Create Bill</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
          <span className="text-[11px] text-slate-400 block font-medium">Total Billed</span>
          <div className="text-base font-black font-mono text-amber-400 mt-0.5">
            ₹{summary.totalAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500 block">{summary.count} Total Invoices</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
          <span className="text-[11px] text-slate-400 block font-medium">Outstanding Due</span>
          <div className="text-base font-black font-mono text-rose-400 mt-0.5">
            ₹{summary.totalDue.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-rose-400/80 block">Uncollected Balance</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search by Bill #, Customer Name, Mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
        {['All', 'Unpaid', 'Partial', 'Paid'].map((st) => (
          <button
            key={st}
            onClick={() => setStatus(st)}
            className={`flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              status === st
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Invoices List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading bills...</div>
        ) : invoices.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
            No bills found. Click "+ Create Bill" to generate your first tax invoice.
          </div>
        ) : (
          invoices.map((inv) => (
            <div
              key={inv._id}
              onClick={() => onSelectInvoice(inv)}
              className="bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/80 rounded-xl p-3.5 transition-all cursor-pointer flex flex-col space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-amber-400 font-bold text-xs">{inv.invoiceNumber}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                        inv.paymentStatus === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : inv.paymentStatus === 'Partial'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {inv.paymentStatus.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-100 text-sm mt-0.5">{inv.customerName}</h3>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                    <span>{new Date(inv.date).toLocaleDateString('en-IN')}</span>
                    <span>•</span>
                    <span>{inv.items?.length || 1} items</span>
                    <span>•</span>
                    <span>{inv.paymentMode}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-slate-100 text-sm">
                    ₹{inv.grandTotal.toLocaleString('en-IN')}
                  </div>
                  {inv.balanceDue > 0 ? (
                    <span className="text-[10px] text-rose-400 font-mono font-bold block mt-0.5">
                      Due: ₹{inv.balanceDue.toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">Fully Paid</span>
                  )}
                </div>
              </div>

              {/* Items Preview snippet */}
              <div className="text-[11px] text-slate-400 truncate pt-1 border-t border-slate-800/50">
                {inv.items?.map((it) => `${it.quantity} ${it.unit} ${it.name}`).join(', ')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
