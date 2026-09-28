import React, { useState } from 'react';
import { Calculator, TrendingUp, Layers, Truck, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api.ts';

interface TaktiCostingViewProps {
  onBookOrderWithCosting: (data: any) => void;
}

const STONES = [
  { name: 'Lakha Red Stone', cost: 450, sell: 680, desc: 'Durable Rajasthan Lakha Red Stone with deep gold leaf carving' },
  { name: 'Makrana Pure White Marble', cost: 500, sell: 750, desc: 'Flawless white marble from Rajasthan for mandir & trust donor plaques' },
  { name: 'Jet Black Granite', cost: 420, sell: 620, desc: 'High gloss mirror finish granite with laser & CNC engraving' },
];

export const TaktiCostingView: React.FC<TaktiCostingViewProps> = ({ onBookOrderWithCosting }) => {
  const [selectedStone, setSelectedStone] = useState(STONES[0].name);
  const [lengthInches, setLengthInches] = useState<number>(36);
  const [widthInches, setWidthInches] = useState<number>(24);
  const [supplierPricePerSqFt, setSupplierPricePerSqFt] = useState<number>(450); // e.g. 450 vs 500
  const [labourPerSqFt, setLabourPerSqFt] = useState<number>(80);
  const [sellingRatePerSqFt, setSellingRatePerSqFt] = useState<number>(680);
  const [supplierBatchName, setSupplierBatchName] = useState<string>('Rajasthan Direct Quarry Lot #3');

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
      setSupplierPricePerSqFt(item.cost);
      setSellingRatePerSqFt(item.sell);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/10 p-4 rounded-2xl border border-amber-500/30">
        <div className="flex items-center space-x-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">
              Takti Sq.Ft & Custom Supplier Profit Engine
            </h2>
            <span className="text-[10px] text-amber-400 font-mono">
              Solves Variable Quarry Sourcing Prices
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          In factory production, slab sourcing costs fluctuate (e.g. ₹450 vs ₹500/sq.ft). Use this
          custom pricing option to lock in your profit before booking the order.
        </p>
      </div>

      {/* Stone Selector */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
        <label className="text-xs font-semibold text-slate-300 block">Select Stone Variety</label>
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
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs truncate">{s.name.split(' ')[0]}</div>
                <div className="text-[10px] opacity-75 mt-0.5">₹{s.cost}/sq.ft</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dimensions & Sq Ft */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Dimensions (Length × Width in Inches)
          </span>
          <span className="text-amber-400 font-mono font-bold text-xs bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            {totalSqFt} Sq. Feet
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Length (Inches)</label>
            <input
              type="number"
              value={lengthInches}
              onChange={(e) => setLengthInches(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
              min={1}
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Width / Height (Inches)</label>
            <input
              type="number"
              value={widthInches}
              onChange={(e) => setWidthInches(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
              min={1}
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between">
          <span>Calculation: ({lengthInches}" × {widthInches}") ÷ 144</span>
          <span className="text-amber-300 font-bold font-mono">= {totalSqFt} Sq.Ft</span>
        </div>
      </div>

      {/* Custom Supplier Sourcing Price Option */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            Custom Supplier Sourcing Price (₹ / Sq.Ft)
          </label>
          <span className="text-[10px] text-emerald-400 font-mono">Editable Batch Cost</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Supplier Slab Rate</label>
            <input
              type="number"
              value={supplierPricePerSqFt}
              onChange={(e) => setSupplierPricePerSqFt(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-amber-400 font-mono font-bold focus:border-amber-500 focus:outline-none"
              placeholder="e.g. 450 or 500"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Carving & Gold Inscription</label>
            <input
              type="number"
              value={labourPerSqFt}
              onChange={(e) => setLabourPerSqFt(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex items-center space-x-1.5 pt-1">
          <span className="text-[10px] text-slate-400">Quick Rates:</span>
          <button
            type="button"
            onClick={() => setSupplierPricePerSqFt(420)}
            className={`px-2.5 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
              supplierPricePerSqFt === 420
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            ₹420 (Quarry Direct)
          </button>
          <button
            type="button"
            onClick={() => setSupplierPricePerSqFt(450)}
            className={`px-2.5 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
              supplierPricePerSqFt === 450
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            ₹450 (Yard A)
          </button>
          <button
            type="button"
            onClick={() => setSupplierPricePerSqFt(500)}
            className={`px-2.5 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
              supplierPricePerSqFt === 500
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            ₹500 (Yard B)
          </button>
        </div>
      </div>

      {/* Customer Selling Rate */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <label className="text-xs font-semibold text-slate-300 block mb-1">
          Customer Selling Rate (₹ / Sq.Ft)
        </label>
        <input
          type="number"
          value={sellingRatePerSqFt}
          onChange={(e) => setSellingRatePerSqFt(Number(e.target.value))}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-base text-slate-100 font-mono font-bold focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* Live Profit & Margins Card */}
      <div
        className={`p-4 rounded-2xl border ${
          totalProfit >= 0
            ? 'bg-emerald-950/20 border-emerald-500/40'
            : 'bg-rose-950/20 border-rose-500/40'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-200">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Live Net Profit & Margin
          </span>
          <span
            className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full ${
              totalProfit >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}
          >
            {marginPercent}% Margin
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center py-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80 mb-3">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Customer Bill</div>
            <div className="text-sm font-bold text-slate-100 font-mono">
              ₹{totalRevenue.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Factory Cost</div>
            <div className="text-sm font-bold text-slate-300 font-mono">
              ₹{totalCost.toLocaleString()}
            </div>
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

        <div className="flex items-center justify-between text-xs text-slate-300 px-1 mb-3">
          <span>Profit per Square Foot:</span>
          <span className="font-mono font-bold text-amber-400">₹{profitPerSqFt} / Sq.Ft</span>
        </div>

        <button
          onClick={() =>
            onBookOrderWithCosting({
              stoneType: selectedStone,
              lengthInches,
              widthInches,
              totalSqFt,
              supplierPrice: supplierPricePerSqFt,
              labourCost: labourPerSqFt,
              sellingRate: sellingRatePerSqFt,
              totalProfit,
            })
          }
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs shadow-lg shadow-amber-950/40 cursor-pointer transition-all"
        >
          <span>Book Order with this Calculation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
