import React, { useState, useEffect } from 'react';
import { Truck, Plus, Phone, MapPin, DollarSign, Package, CheckCircle2, X } from 'lucide-react';
import { Supplier } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

export const SuppliersView: React.FC = () => {
  const { currentPedhi } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [summary, setSummary] = useState({ count: 0, totalPayables: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // New Supplier modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Stone Quarry' | 'Sevan Timber' | 'Makrana Marble' | 'Karigar / Artisan' | 'Gold & Polish Materials' | 'General'>('Stone Quarry');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('Rajkot');
  const [materialSupplied, setMaterialSupplied] = useState('');
  const [openingBalance, setOpeningBalance] = useState('0');

  // Payment dialog state
  const [payingSupplier, setPayingSupplier] = useState<Supplier | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMode, setPayMode] = useState('UPI');
  const [payRef, setPayRef] = useState('');

  const loadSuppliers = async () => {
    if (!currentPedhi?._id) return;
    setIsLoading(true);
    try {
      const res = await api.getSuppliers(currentPedhi._id, {
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
        search: search || undefined,
      });
      setSuppliers(res.suppliers || []);
      setSummary(res.summary || { count: 0, totalPayables: 0 });
    } catch (err) {
      console.error('Failed to load suppliers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [currentPedhi, categoryFilter, search]);

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) return;

    try {
      await api.createSupplier({
        pedhiId: currentPedhi?._id,
        name: name.trim(),
        category,
        mobile: mobile.trim(),
        city: city.trim(),
        materialSupplied: materialSupplied.trim(),
        openingBalance: Number(openingBalance) || 0,
      });
      setIsAddOpen(false);
      setName('');
      setMobile('');
      setMaterialSupplied('');
      setOpeningBalance('0');
      loadSuppliers();
    } catch (err: any) {
      alert(err.message || 'Failed to add supplier');
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingSupplier) return;
    const amt = Number(payAmount);
    if (isNaN(amt) || amt <= 0) return;

    try {
      await api.recordSupplierPayment(payingSupplier._id, {
        amount: amt,
        paymentMode: payMode,
        referenceNumber: payRef,
      });
      setPayingSupplier(null);
      setPayAmount('');
      loadSuppliers();
    } catch (err: any) {
      alert(err.message || 'Payment recording failed');
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100">Suppliers & Karigars</h2>
          <p className="text-xs text-slate-400">Raw stone quarries, Sevan timber depots & master sculptors</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md shadow-amber-950/40 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Supplier</span>
        </button>
      </div>

      {/* Payables Banner */}
      <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-3 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-rose-300 block font-medium">Total Supplier & Karigar Dues (Dena)</span>
          <div className="text-base font-black font-mono text-rose-400 mt-0.5">
            ₹{summary.totalPayables.toLocaleString('en-IN')}
          </div>
        </div>
        <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-1 rounded-lg">
          {summary.count} Registered Vendors
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          'All',
          'Stone Quarry',
          'Sevan Timber',
          'Makrana Marble',
          'Karigar / Artisan',
          'Gold & Polish Materials',
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
              categoryFilter === cat
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Suppliers List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400">Loading suppliers...</div>
        ) : suppliers.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
            No suppliers found. Click "+ Add Supplier" to register quarries, timber merchants, and karigars.
          </div>
        ) : (
          suppliers.map((s) => (
            <div
              key={s._id}
              className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-100 text-sm">{s.name}</h3>
                    <span className="text-[10px] bg-slate-800 text-amber-300 px-1.5 py-0.2 rounded border border-slate-700 font-semibold">
                      {s.category}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs mt-0.5 font-medium">{s.materialSupplied}</p>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                    <span className="flex items-center">
                      <Phone className="w-3 h-3 mr-1 text-slate-500" />
                      {s.mobile}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-slate-500" />
                      {s.city}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Balance Due:</span>
                  <div className="text-sm font-black font-mono text-rose-400 mt-0.5">
                    ₹{Math.abs(s.currentBalance).toLocaleString('en-IN')}
                  </div>
                  <button
                    onClick={() => {
                      setPayingSupplier(s);
                      setPayAmount(Math.abs(s.currentBalance).toString());
                    }}
                    className="mt-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer"
                  >
                    Pay Vendor
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pay Modal */}
      {payingSupplier && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleRecordPayment}
            className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-slate-100">Pay Vendor: {payingSupplier.name}</h3>
              <button onClick={() => setPayingSupplier(null)} className="text-slate-400 hover:text-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Amount to Pay (₹)</label>
              <input
                type="number"
                required
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold font-mono focus:outline-none focus:border-amber-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Mode</label>
              <select
                value={payMode}
                onChange={(e) => setPayMode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Ref / UTR Number</label>
              <input
                type="text"
                placeholder="UTR-99120"
                value={payRef}
                onChange={(e) => setPayRef(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setPayingSupplier(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold">
                Confirm Payment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Supplier Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSupplier}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-slate-100">Add Quarry, Timber or Artisan Vendor</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Supplier / Karigar Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Lakha Red Stone Quarry Barmer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Stone Quarry">Stone Quarry (Lakha/Granite)</option>
                  <option value="Sevan Timber">Sevan Timber Depot</option>
                  <option value="Makrana Marble">Makrana Marble Mines</option>
                  <option value="Karigar / Artisan">Karigar / Artisan Studio</option>
                  <option value="Gold & Polish Materials">Gold Foil & Colors</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Opening Payable (₹)</label>
                <input
                  type="number"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Raw Material / Craft Supplied</label>
              <input
                type="text"
                placeholder="e.g. Lakha red slabs 25mm, Seasoned Sevan logs, 24K gold foil"
                value={materialSupplied}
                onChange={(e) => setMaterialSupplied(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
                Add Supplier
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
