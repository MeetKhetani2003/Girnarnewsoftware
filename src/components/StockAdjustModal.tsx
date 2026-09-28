import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Product } from '../types/index.ts';
import { api } from '../services/api.ts';

interface StockAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess: () => void;
}

export const StockAdjustModal: React.FC<StockAdjustModalProps> = ({
  isOpen,
  onClose,
  product,
  onSuccess,
}) => {
  const [type, setType] = useState<'add' | 'reduce'>('add');
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('New stock arrival from quarry/workshop');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const count = Number(qty);
    if (isNaN(count) || count <= 0) {
      setError('Enter a valid positive number');
      return;
    }

    const delta = type === 'add' ? count : -count;

    setIsSubmitting(true);
    setError(null);

    try {
      await api.adjustStock(product._id, delta, reason);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to adjust stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  const presetReasonsAdd = [
    'New stock arrival from quarry/workshop',
    'Customer order cancellation return',
    'Physical inventory audit adjustment',
  ];

  const presetReasonsReduce = [
    'Damage / Chipping breakage in transit',
    'Sample given to architect / client',
    'Physical count discrepancy',
    'Internal use for carving carving test',
  ];

  const currentReasons = type === 'add' ? presetReasonsAdd : presetReasonsReduce;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <h3 className="font-bold text-slate-100 text-sm">Quick Stock Adjustment</h3>
            <p className="text-xs text-amber-400 font-medium truncate max-w-[240px]">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-4 mt-3 p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          {/* Current Stock Banner */}
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <span className="text-slate-400">Current In Stock:</span>
            <span className="text-base font-bold text-slate-100 font-mono">
              {product.currentStock} {product.unit}
            </span>
          </div>

          {/* Type Toggle: Add (+) vs Reduce (-) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setType('add');
                setReason(presetReasonsAdd[0]);
              }}
              className={`py-2 rounded-xl flex items-center justify-center space-x-1.5 font-bold transition-all cursor-pointer ${
                type === 'add'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Stock In (+)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('reduce');
                setReason(presetReasonsReduce[0]);
              }}
              className={`py-2 rounded-xl flex items-center justify-center space-x-1.5 font-bold transition-all cursor-pointer ${
                type === 'reduce'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-950/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Stock Out (-)</span>
            </button>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Quantity to {type === 'add' ? 'Add' : 'Deduct'} ({product.unit}) *
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 5"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-base font-bold text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Reason for adjustment</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 mb-2"
            >
              {currentReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Projected Final Stock */}
          {qty && !isNaN(Number(qty)) && (
            <div className="text-[11px] text-slate-400 text-center py-1">
              New stock will be:{' '}
              <strong className="text-amber-400 font-mono">
                {product.currentStock + (type === 'add' ? Number(qty) : -Number(qty))} {product.unit}
              </strong>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center space-x-1.5 shadow-md shadow-amber-950/40 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Updating...' : 'Confirm'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
