import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Plus, Truck, Building2, CheckCircle2, Clock } from 'lucide-react';
import { StockTransfer, Product } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

export const TransfersView: React.FC = () => {
  const { currentPedhi, pedhis } = useAuth();
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Transfer Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromPedhiId, setFromPedhiId] = useState(currentPedhi?._id || '');
  const [toPedhiId, setToPedhiId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [transRes, prodRes] = await Promise.all([
        api.getStockTransfers(currentPedhi?._id),
        currentPedhi?._id ? api.getProducts(currentPedhi._id) : { products: [] },
      ]);
      setTransfers(transRes.transfers || []);
      setProducts(prodRes.products || []);
      if (prodRes.products?.length > 0 && !selectedProductId) {
        setSelectedProductId(prodRes.products[0]._id);
      }
      if (pedhis.length > 1 && !toPedhiId) {
        const other = pedhis.find((p) => p._id !== currentPedhi?._id);
        if (other) setToPedhiId(other._id);
      }
    } catch (err) {
      console.error('Failed to load transfers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (currentPedhi?._id) setFromPedhiId(currentPedhi._id);
  }, [currentPedhi]);

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromPedhiId || !toPedhiId || !selectedProductId) return;
    if (fromPedhiId === toPedhiId) {
      alert('Source and destination pedhi must be different');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createStockTransfer({
        fromPedhiId,
        toPedhiId,
        productId: selectedProductId,
        quantity: Number(quantity) || 1,
        vehicleNumber,
        notes,
      });
      setIsModalOpen(false);
      setQuantity('1');
      setVehicleNumber('');
      setNotes('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Transfer failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProduct = products.find((p) => p._id === selectedProductId);

  return (
    <div className="p-4 space-y-4 pb-20 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100">Inter-Pedhi Stock Transfers</h2>
          <p className="text-xs text-slate-400">
            Move stock between Girnarshilp, ArvindRamjibhai, Jaipurshilpkala & Bhagvatikalamandir
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md shadow-amber-950/40 cursor-pointer"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>+ Transfer Stock</span>
        </button>
      </div>

      {/* 4 Pedhi Network Flow Visualizer */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
        <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] block">
          Enterprise Multi-Firm Network (4 Pedhis)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {pedhis.map((p) => (
            <div
              key={p._id}
              className={`p-2 rounded-lg border text-center ${
                currentPedhi?._id === p._id
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 font-bold'
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-300'
              }`}
            >
              <div className="font-bold truncate">{p.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{p.contactDetails?.city || 'Gujarat'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Transfers Feed */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400">Loading transfer history...</div>
        ) : transfers.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
            No stock transfers recorded yet. Click "+ Transfer Stock" to transfer mandirs, murtis, or taktis between your
            4 business pedhis.
          </div>
        ) : (
          transfers.map((trf) => (
            <div
              key={trf._id}
              className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-amber-400 font-bold text-xs">{trf.transferNumber}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded-full border border-emerald-500/40 font-semibold">
                      {trf.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-100 text-sm mt-1">{trf.productName}</h3>

                  <div className="flex items-center space-x-2 text-xs text-slate-300 mt-1">
                    <span className="text-amber-300 font-bold">{trf.fromPedhiName}</span>
                    <span className="text-slate-500">➔</span>
                    <span className="text-emerald-300 font-bold">{trf.toPedhiName}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-black text-amber-400 text-sm">
                    {trf.quantity} {trf.unit}
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {new Date(trf.transferDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              {(trf.vehicleNumber || trf.notes) && (
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 flex items-center space-x-3">
                  {trf.vehicleNumber && (
                    <span className="flex items-center">
                      <Truck className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      Vehicle: {trf.vehicleNumber}
                    </span>
                  )}
                  {trf.notes && <span>• {trf.notes}</span>}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Transfer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTransfer}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3.5"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-slate-100 text-sm sm:text-base">Inter-Pedhi Stock Transfer</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-100">
                <span className="text-lg">✕</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 text-[10px] mb-0.5">Source Pedhi (From)</label>
                <select
                  value={fromPedhiId}
                  onChange={(e) => setFromPedhiId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-semibold focus:outline-none focus:border-amber-500"
                >
                  {pedhis.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] mb-0.5">Target Pedhi (To)</label>
                <select
                  value={toPedhiId}
                  onChange={(e) => setToPedhiId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-semibold focus:outline-none focus:border-amber-500"
                >
                  {pedhis
                    .filter((p) => p._id !== fromPedhiId)
                    .map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-[10px] mb-0.5">Product to Transfer</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-amber-500 font-medium"
              >
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} (Stock: {p.currentStock} {p.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 text-[10px] mb-0.5">
                  Transfer Qty ({selectedProduct?.unit || 'Pcs'})
                </label>
                <input
                  type="number"
                  required
                  min="0.1"
                  step="any"
                  max={selectedProduct?.currentStock}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] mb-0.5">Vehicle / Tempo No</label>
                <input
                  type="text"
                  placeholder="e.g. GJ-03-BW-9901"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 uppercase font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-[10px] mb-0.5">Transfer Notes</label>
              <input
                type="text"
                placeholder="e.g. Sent for temple client inspection"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
              >
                {isSubmitting ? 'Transferring...' : 'Confirm Transfer'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
