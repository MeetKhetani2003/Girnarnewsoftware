import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  FileCheck,
  ChevronRight,
  ArrowRight,
  Sparkles,
  TrendingUp,
  DollarSign,
  Truck,
} from 'lucide-react';
import { Order, OrderStatus, Invoice } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface OrdersViewProps {
  onOpenCreateOrder: () => void;
  onInvoiceCreated?: (invoice: Invoice) => void;
}

const ORDER_STAGES: OrderStatus[] = [
  'Booked',
  'Material Assigned',
  'Carving & Carpentry',
  'Shringar & Polish',
  'Ready for Dispatch',
  'Delivered',
];

export const OrdersView: React.FC<OrdersViewProps> = ({ onOpenCreateOrder, onInvoiceCreated }) => {
  const { currentPedhi } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [productTypeFilter, setProductTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    if (!currentPedhi?._id) return;
    setIsLoading(true);
    try {
      const res = await api.getOrders(currentPedhi._id, {
        status: statusFilter !== 'All' ? statusFilter : undefined,
        productType: productTypeFilter !== 'All' ? productTypeFilter : undefined,
        search: search || undefined,
      });
      setOrders(res.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [currentPedhi, productTypeFilter, statusFilter, search]);

  const handleAdvanceStatus = async (order: Order) => {
    const currentIndex = ORDER_STAGES.indexOf(order.status);
    if (currentIndex < ORDER_STAGES.length - 1) {
      const nextStage = ORDER_STAGES[currentIndex + 1];
      try {
        await api.updateOrderStatus(order._id, nextStage);
        loadOrders();
      } catch (err: any) {
        alert(err.message || 'Status update failed');
      }
    }
  };

  const handleConvertToInvoice = async (orderId: string) => {
    try {
      const res = await api.convertOrderToInvoice(orderId);
      alert(res.message);
      loadOrders();
      if (onInvoiceCreated && res.invoice) {
        onInvoiceCreated(res.invoice);
      }
    } catch (err: any) {
      alert(err.message || 'Invoice generation failed');
    }
  };

  // Profit & totals
  const totalBilledValue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalEstimatedCost = orders.reduce((sum, o) => sum + (o.totalCost || 0), 0);
  const totalEstimatedProfit = orders.reduce(
    (sum, o) => sum + (o.estimatedProfit !== undefined && o.estimatedProfit > 0 ? o.estimatedProfit : Math.max(0, o.totalAmount - (o.totalCost || 0))),
    0
  );
  const avgMargin = totalBilledValue > 0 ? ((totalEstimatedProfit / totalBilledValue) * 100).toFixed(1) : '0';

  return (
    <div className="p-4 space-y-4 pb-20 text-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100">Orders, Costing & Crafting</h2>
          <p className="text-xs text-slate-400">Track custom commissions, supplier costs & net profit</p>
        </div>
        <button
          onClick={onOpenCreateOrder}
          className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md shadow-amber-950/40 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Book Order</span>
        </button>
      </div>

      {/* Financial Profit & Cost KPI Strip */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
          <span className="text-[10px] text-slate-400 block font-medium">Total Orders Value</span>
          <div className="text-sm font-black font-mono text-slate-100 mt-0.5">
            ₹{totalBilledValue.toLocaleString('en-IN')}
          </div>
          <span className="text-[9px] text-slate-500 block mt-0.5">{orders.length} Commissions</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
          <span className="text-[10px] text-slate-400 block font-medium">Total Factory Cost</span>
          <div className="text-sm font-black font-mono text-amber-400/90 mt-0.5">
            ₹{totalEstimatedCost.toLocaleString('en-IN')}
          </div>
          <span className="text-[9px] text-slate-500 block mt-0.5">Stone & Labour</span>
        </div>

        <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-2.5">
          <span className="text-[10px] text-emerald-300 block font-medium">Est. Net Profit</span>
          <div className="text-sm font-black font-mono text-emerald-400 mt-0.5">
            +₹{totalEstimatedProfit.toLocaleString('en-IN')}
          </div>
          <span className="text-[9px] text-emerald-400 font-bold block mt-0.5">{avgMargin}% Avg Margin</span>
        </div>
      </div>

      {/* Product Type Filter Pills */}
      <div className="grid grid-cols-4 gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-center font-medium">
        {['All', 'takti', 'mandir', 'murti'].map((type) => (
          <button
            key={type}
            onClick={() => setProductTypeFilter(type)}
            className={`py-1.5 rounded-lg transition-all cursor-pointer capitalize ${
              productTypeFilter === type
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {type === 'All' ? 'All Orders' : type === 'takti' ? 'Takti (SqFt)' : type === 'mandir' ? 'Mandir' : 'Murti'}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search by order #, client, stone/wood type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400">Loading custom orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
            No orders found. Click "+ Book Order" to record a new mandir, murti, or takti commission with custom pricing.
          </div>
        ) : (
          orders.map((order) => {
            const stageIndex = ORDER_STAGES.indexOf(order.status);
            const isCompleted = order.status === 'Delivered';

            const profit = order.estimatedProfit !== undefined && order.estimatedProfit > 0
              ? order.estimatedProfit
              : Math.max(0, order.totalAmount - (order.totalCost || 0));

            const margin = order.profitMarginPercent !== undefined && order.profitMarginPercent > 0
              ? order.profitMarginPercent
              : order.totalAmount > 0
              ? Math.round((profit / order.totalAmount) * 100)
              : 0;

            return (
              <div
                key={order._id}
                className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3.5 space-y-3 transition-all"
              >
                {/* Order Top Bar */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-amber-400 font-bold text-xs">{order.orderNumber}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.2 rounded-full border border-slate-700 uppercase font-semibold">
                        {order.productType}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-100 text-sm mt-0.5">{order.title}</h3>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Client: <strong className="text-slate-200">{order.customerName}</strong> ({order.customerMobile})
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black font-mono text-slate-100">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono block">
                      Adv: ₹{order.advancePaid.toLocaleString('en-IN')}
                    </span>
                    {order.balanceDue > 0 && (
                      <span className="text-[10px] text-rose-400 font-mono font-bold block">
                        Bal: ₹{order.balanceDue.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Specs Box */}
                <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/60 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>
                      Specs: <strong className="text-amber-300">{order.specsSummary}</strong>
                    </span>
                    {order.customDetails?.calculatedSqFt && (
                      <span className="font-mono text-amber-400 font-bold">
                        {order.customDetails.calculatedSqFt} Sq.Ft
                      </span>
                    )}
                  </div>

                  {order.customDetails?.engravingText && (
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-700/40 italic">
                      Inscription: "{order.customDetails.engravingText}"
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/40">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-slate-500" />
                      Delivery Target: <strong className="text-slate-300 ml-1">{new Date(order.deliveryDate).toLocaleDateString('en-IN')}</strong>
                    </span>
                    {order.assignedKarigar && (
                      <span>Karigar: <strong className="text-slate-300">{order.assignedKarigar}</strong></span>
                    )}
                  </div>
                </div>

                {/* FACTORY COSTING & PROFIT STRIP */}
                <div className="bg-slate-950/70 p-2 rounded-lg border border-emerald-500/30 flex items-center justify-between text-[11px]">
                  <div className="text-slate-400 flex items-center space-x-1.5">
                    <span>Cost:</span>
                    <strong className="text-slate-200 font-mono">₹{(order.totalCost || 0).toLocaleString('en-IN')}</strong>
                    {order.supplierName && (
                      <span className="text-[9px] text-slate-400 truncate max-w-[140px] italic">
                        ({order.supplierName})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400 font-bold font-mono">
                      Profit: +₹{profit.toLocaleString('en-IN')}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        margin >= 25
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : margin >= 10
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {margin}%
                    </span>
                  </div>
                </div>

                {/* Crafting Pipeline Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                    <span className="text-amber-400">Stage: {order.status}</span>
                    <span>{stageIndex + 1} / {ORDER_STAGES.length}</span>
                  </div>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                      style={{ width: `${((stageIndex + 1) / ORDER_STAGES.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions: Next Stage / Generate Invoice */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  {!isCompleted ? (
                    <button
                      onClick={() => handleAdvanceStatus(order)}
                      className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                    >
                      <span>Move to Next Stage</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  ) : (
                    <span className="text-emerald-400 flex items-center font-bold">
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Delivered & Completed
                    </span>
                  )}

                  {!order.invoiceId ? (
                    <button
                      onClick={() => handleConvertToInvoice(order._id)}
                      className="flex items-center space-x-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-lg font-bold cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5 mr-1" />
                      <span>Generate Bill</span>
                    </button>
                  ) : (
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700 font-mono">
                      Billed
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
