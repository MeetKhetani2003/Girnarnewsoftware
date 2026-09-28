import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  Users,
  FileText,
  AlertTriangle,
  PlusCircle,
  Package,
  BookOpen,
  Building2,
  Calendar,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { DashboardStats, Invoice, Transaction, Product, Customer } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface DashboardViewProps {
  onOpenNewInvoice: () => void;
  onOpenNewPayment: (type?: 'PAYMENT_IN' | 'PAYMENT_OUT') => void;
  onOpenNewCustomer: () => void;
  onOpenNewProduct: () => void;
  onSelectInvoice: (invoice: Invoice) => void;
  onAdjustProductStock: (product: Product) => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewInvoice,
  onOpenNewPayment,
  onOpenNewCustomer,
  onOpenNewProduct,
  onSelectInvoice,
  onAdjustProductStock,
  onNavigateTab,
}) => {
  const { currentPedhi } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadDashboard = async () => {
    if (!currentPedhi?._id) return;
    setIsLoading(true);
    try {
      const data = await api.getDashboardStats(currentPedhi._id);
      setStats(data.stats);
      setLowStockItems(data.lowStockItems || []);
      setRecentInvoices(data.recentInvoices || []);
      setRecentTransactions(data.recentTransactions || []);
      setDbStatus(data.dbStatus);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [currentPedhi]);

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Top Welcome & Pedhi Card */}
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 rounded-2xl p-4 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Active Business Pedhi
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-100 tracking-tight mt-0.5">
              {currentPedhi?.name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              GST: <span className="font-mono text-slate-300">{currentPedhi?.contactDetails?.gstNumber || 'Not configured'}</span> •{' '}
              {currentPedhi?.contactDetails?.city || 'Gujarat'}
            </p>
          </div>

          <button
            onClick={loadDashboard}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Refresh Dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* 4 Main KPI Cards */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          {/* Today's Sales */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] text-slate-400 block font-medium">Today's Sales</span>
            <div className="text-base sm:text-lg font-black font-mono text-amber-400 mt-0.5">
              ₹{(stats?.todaySales || 0).toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Collected: ₹{(stats?.todayCollected || 0).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Month's Sales */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[11px] text-slate-400 block font-medium">This Month</span>
            <div className="text-base sm:text-lg font-black font-mono text-slate-100 mt-0.5">
              ₹{(stats?.monthSales || 0).toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">Total Invoiced</span>
          </div>

          {/* Receivables (Lena) */}
          <div
            onClick={() => onNavigateTab('parties')}
            className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-3 cursor-pointer hover:bg-emerald-950/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-emerald-300 font-medium">To Receive (Lena)</span>
              <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-base sm:text-lg font-black font-mono text-emerald-400 mt-0.5">
              ₹{(stats?.totalReceivables || 0).toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-400/80 block mt-0.5">From Customers</span>
          </div>

          {/* Payables (Dena) */}
          <div
            onClick={() => onNavigateTab('parties')}
            className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-3 cursor-pointer hover:bg-rose-950/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-rose-300 font-medium">To Pay (Dena)</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-base sm:text-lg font-black font-mono text-rose-400 mt-0.5">
              ₹{(stats?.totalPayables || 0).toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-rose-400/80 block mt-0.5">To Suppliers</span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons Row */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={onOpenNewInvoice}
          className="flex flex-col items-center justify-center bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 rounded-xl p-2.5 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-200 mt-1.5">+ Bill</span>
        </button>

        <button
          onClick={() => onOpenNewPayment('PAYMENT_IN')}
          className="flex flex-col items-center justify-center bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 rounded-xl p-2.5 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ArrowDownRight className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-200 mt-1.5">+ Jama</span>
        </button>

        <button
          onClick={onOpenNewCustomer}
          className="flex flex-col items-center justify-center bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 rounded-xl p-2.5 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-200 mt-1.5">+ Party</span>
        </button>

        <button
          onClick={onOpenNewProduct}
          className="flex flex-col items-center justify-center bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 rounded-xl p-2.5 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Package className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-200 mt-1.5">+ Stock</span>
        </button>
      </div>

      {/* Low Stock Alert Section */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-xs text-amber-300">
                Low Stock Alerts ({lowStockItems.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="space-y-2">
            {lowStockItems.map((item) => (
              <div
                key={item._id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-slate-200 text-xs">{item.name}</h4>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                    <span>
                      Stock:{' '}
                      <strong className="text-rose-400 font-mono">
                        {item.currentStock} {item.unit}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>Min Alert: {item.minStockAlert}</span>
                  </div>
                </div>

                <button
                  onClick={() => onAdjustProductStock(item)}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  + Add Stock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Invoices */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
            Recent Sales Bills
          </h3>
          <button
            onClick={() => onNavigateTab('invoices')}
            className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center cursor-pointer"
          >
            <span>All Bills</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentInvoices.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 text-center text-xs text-slate-400">
              No bills created yet for this Pedhi.
            </div>
          ) : (
            recentInvoices.map((inv) => (
              <div
                key={inv._id}
                onClick={() => onSelectInvoice(inv)}
                className="bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-amber-400 text-xs font-bold">
                      {inv.invoiceNumber}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        inv.paymentStatus === 'Paid'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : inv.paymentStatus === 'Partial'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {inv.paymentStatus}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-200 text-xs mt-0.5">
                    {inv.customerName}
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    {new Date(inv.date).toLocaleDateString('en-IN')} • {inv.items?.length || 1} items
                  </span>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-slate-100 text-sm">
                    ₹{inv.grandTotal.toLocaleString('en-IN')}
                  </div>
                  {inv.balanceDue > 0 && (
                    <span className="text-[10px] text-rose-400 block font-mono">
                      Due: ₹{inv.balanceDue.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Cash Flow / Rojmel Transactions */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
            Latest Cashbook (Rojmel)
          </h3>
          <button
            onClick={() => onNavigateTab('rojmel')}
            className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center cursor-pointer"
          >
            <span>View Rojmel</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentTransactions.map((tx) => {
            const isIn = tx.type === 'PAYMENT_IN';
            return (
              <div
                key={tx._id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isIn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {isIn ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200 text-xs">{tx.partyName}</h4>
                    <span className="text-[10px] text-slate-400">
                      {tx.category} • {tx.paymentMode}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-mono font-bold text-xs ${
                      isIn ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isIn ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(tx.date).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
