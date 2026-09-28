import React, { useState } from 'react';
import { X, Calculator, TrendingUp, Layers, CheckCircle2, ArrowRight, Truck } from 'lucide-react';
import { api } from '../services/api.ts';

interface TaktiCostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookOrderWithCosting?: (data: {
    stoneType: string;
    lengthInches: number;
    widthInches: number;
    totalSqFt: number;
    supplierPrice: number;
    labourCost: number;
    sellingRate: number;
    totalProfit: number;
  }) => void;
}

const STONES = [
  { name: 'Lakha Red Stone', defaultCost: 450, defaultSell: 680, desc: 'Rajasthan Red Stone, high outdoor durability' },
  { name: 'Makrana Pure White Marble', defaultCost: 500, defaultSell: 750, desc: 'Subtle grey veins, temple exterior & interior' },
  { name: 'Jet Black Granite', defaultCost: 420, defaultSell: 620, desc: 'High gloss mirror finish with gold engraving' },
];

export const TaktiCostingModal: React.FC<TaktiCostingModalProps> = ({
  isOpen,
  onClose,
  onBookOrderWithCosting,
}) => {
  const [selectedStone, setSelectedStone] = useState(STONES[0].name);
  const [lengthInches, setLengthInches] = useState<number>(36);
  const [widthInches, setWidthInches] = useState<number>(24);
  const [supplierPricePerSqFt, setSupplierPricePerSqFt] = useState<number>(450); // e.g. 450 vs 500
  const [labourPerSqFt, setLabourPerSqFt] = useState<number>(80); // deep CNC & 24K gold foil
  const [sellingRatePerSqFt, setSellingRatePerSqFt] = useState<number>(680);
  const [supplierBatchNote, setSupplierBatchNote] = useState<string>('Quarry Batch Lot #4');

  if (!isOpen) return null;

  const totalSqFt = Number(((lengthInches * widthInches) / 144).toFixed(3));
  const rawCost = Math.round(supplierPricePerSqFt * totalSqFt);
  const labourCost = Math.round(labourPerSqFt * totalSqFt);
  const totalCost = rawCost + labourCost;
  const totalRevenue = Math.round(sellingRatePerSqFt * totalSqFt);
  const totalProfit = totalRevenue - totalCost;
  const profitPerSqFt = sellingRatePerSqFt - (supplierPricePerSqFt + labourPerSqFt);
  const marginPercent = totalRevenue > 0 ? Number(((totalProfit / totalRevenue) * 100).toFixed(1)) : 0;

  const handleSelectStone = (stoneName: string) => {
    setSelectedStone(stoneName);
    const item = STONES.find((s) => s.name === stoneName);
    if (item) {
      setSupplierPricePerSqFt(item.defaultCost);
      setSellingRatePerSqFt(item.defaultSell);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                <span>Takti Sq.Ft & Supplier Costing Engine</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                  Custom Cost
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Solves variable quarry sourcing prices (e.g. ₹450 vs ₹500/sq.ft)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Stone Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Select Stone Type</label>
            <div className="grid grid-cols-3 gap-2">
              {STONES.map((s) => {
                const isSelected = selectedStone === s.name;
                return (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => handleSelectStone(s.name)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-xs truncate">{s.name.split(' ')[0]}</div>
                    <div className="text-[10px] opacity-75 mt-0.5">₹{s.defaultCost}/sq.ft</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dimensions (Sq Ft Measurement) */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Measurement in Inches (Converts to Sq. Ft)
              </span>
              <span className="text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                = {totalSqFt} Sq.Ft
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Length (Inches)</label>
                <input
                  type="number"
                  value={lengthInches}
                  onChange={(e) => setLengthInches(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                  min={1}
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Width / Height (Inches)</label>
                <input
                  type="number"
                  value={widthInches}
                  onChange={(e) => setWidthInches(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                  min={1}
                />
              </div>
            </div>
            <div className="text-[11px] text-slate-400">
              Formula: ({lengthInches}" × {widthInches}") ÷ 144 = <span className="text-amber-300 font-bold">{totalSqFt} Sq. Feet</span>
            </div>
          </div>

          {/* Custom Supplier Sourcing Price Option */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                Custom Supplier Price Option
              </label>
              <span className="text-[11px] text-emerald-400 font-mono">Factory Variable Cost</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Supplier Slabs (₹/Sq.Ft)</label>
                <input
                  type="number"
                  value={supplierPricePerSqFt}
                  onChange={(e) => setSupplierPricePerSqFt(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-amber-300 font-mono font-bold focus:border-amber-500 focus:outline-none"
                  placeholder="e.g. 450 or 500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Carving & Foil (₹/Sq.Ft)</label>
                <input
                  type="number"
                  value={labourPerSqFt}
                  onChange={(e) => setLabourPerSqFt(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Quarry Presets */}
            <div className="flex items-center space-x-1.5 pt-1">
              <span className="text-[10px] text-slate-400">Quick Rates:</span>
              <button
                type="button"
                onClick={() => setSupplierPricePerSqFt(420)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                  supplierPricePerSqFt === 420 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                }`}
              >
                ₹420
              </button>
              <button
                type="button"
                onClick={() => setSupplierPricePerSqFt(450)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                  supplierPricePerSqFt === 450 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                }`}
              >
                ₹450
              </button>
              <button
                type="button"
                onClick={() => setSupplierPricePerSqFt(500)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                  supplierPricePerSqFt === 500 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                }`}
              >
                ₹500
              </button>
            </div>
          </div>

          {/* Customer Selling Rate */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Customer Selling Rate (₹ / Sq.Ft)
            </label>
            <input
              type="number"
              value={sellingRatePerSqFt}
              onChange={(e) => setSellingRatePerSqFt(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-base text-slate-100 font-mono font-bold focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Live Profit Calculation Card */}
          <div
            className={`p-4 rounded-xl border ${
              totalProfit >= 0
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : 'bg-rose-950/20 border-rose-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-200">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Live Net Profit Calculation
              </span>
              <span
                className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                  totalProfit >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {marginPercent}% Margin
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center py-2 bg-slate-900/60 rounded-lg border border-slate-800/80 mb-3">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Customer Bill</div>
                <div className="text-sm font-bold text-slate-100 font-mono">₹{totalRevenue.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Factory Cost</div>
                <div className="text-sm font-bold text-slate-300 font-mono">₹{totalCost.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Net Profit</div>
                <div
                  className={`text-sm font-bold font-mono ${
                    totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  ₹{totalProfit.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 px-1">
              <span>Profit per Square Foot:</span>
              <span className="font-mono font-bold text-amber-400">
                ₹{profitPerSqFt} / Sq.Ft
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            Close
          </button>

          {onBookOrderWithCosting && (
            <button
              onClick={() => {
                onBookOrderWithCosting({
                  stoneType: selectedStone,
                  lengthInches,
                  widthInches,
                  totalSqFt,
                  supplierPrice: supplierPricePerSqFt,
                  labourCost: labourPerSqFt,
                  sellingRate: sellingRatePerSqFt,
                  totalProfit,
                });
                onClose();
              }}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-amber-950/40 cursor-pointer transition-all"
            >
              <span>Book Order with this Costing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
