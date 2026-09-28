import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle2, UserPlus, Sparkles, Calculator, TrendingUp, AlertCircle, Truck } from 'lucide-react';
import { Customer, Order, Supplier } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface OrderCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (order: Order) => void;
  onOpenCreateCustomer: () => void;
}

export const OrderCreateModal: React.FC<OrderCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenCreateCustomer,
}) => {
  const { currentPedhi } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [productType, setProductType] = useState<'takti' | 'mandir' | 'murti' | 'custom'>('takti');
  const [title, setTitle] = useState<string>('');
  const [specsSummary, setSpecsSummary] = useState<string>('');
  const [assignedKarigar, setAssignedKarigar] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Takti Specifications & Measurements
  const [taktiStone, setTaktiStone] = useState('Lakha Red Stone');
  const [taktiLen, setTaktiLen] = useState<number>(36);
  const [taktiWid, setTaktiWid] = useState<number>(24);
  const [engravingText, setEngravingText] = useState('');

  // FACTORY COSTING & PROFIT ENGINE
  const [selectedSupplierName, setSelectedSupplierName] = useState('Factory Yard Stock / Unknown');
  // Raw stone supplier cost per sqft (editable custom price)
  const [rawCostPerSqFt, setRawCostPerSqFt] = useState<number>(210);
  // Labour, CNC carving & 24K gold foil cost per sqft
  const [labourCostPerSqFt, setLabourCostPerSqFt] = useState<number>(80);
  // Selling rate per sqft charged to customer
  const [sellingRatePerSqFt, setSellingRatePerSqFt] = useState<number>(440);

  // For Mandir / Murti Costing
  const [rawMaterialCost, setRawMaterialCost] = useState<number>(35000);
  const [karigarLabourCost, setKarigarLabourCost] = useState<number>(18000);
  const [manualSellingPrice, setManualSellingPrice] = useState<number>(78000);

  // Advance paid
  const [advancePaid, setAdvancePaid] = useState<string>('');

  // 2. Mandir custom
  const [mandirMat, setMandirMat] = useState('Pure Sevan Wood');
  const [mandirW, setMandirW] = useState<number>(48);
  const [mandirD, setMandirD] = useState<number>(24);
  const [mandirH, setMandirH] = useState<number>(66);
  const [mandirShikhara, setMandirShikhara] = useState('3 Shikhara with Kalash');

  // 3. Murti custom
  const [murtiDeity, setMurtiDeity] = useState('Radha Krishna');
  const [murtiHeight, setMurtiHeight] = useState<number>(24);
  const [murtiMarble, setMurtiMarble] = useState('Makrana Super White (Grade A)');
  const [murtiShringar, setMurtiShringar] = useState('24K Real Gold Leaf Foil (Vark)');

  // Dynamic Takti calculations
  const taktiSqFt = Number(((taktiLen * taktiWid) / 144).toFixed(2));

  // Calculations based on product type
  let computedTotalCost = 0;
  let computedTotalRevenue = 0;
  let computedProfit = 0;
  let computedMarginPercent = 0;

  if (productType === 'takti') {
    const totalCostPerSqFt = Number(rawCostPerSqFt || 0) + Number(labourCostPerSqFt || 0);
    computedTotalCost = Math.round(totalCostPerSqFt * taktiSqFt);
    computedTotalRevenue = Math.round(Number(sellingRatePerSqFt || 0) * taktiSqFt);
    computedProfit = computedTotalRevenue - computedTotalCost;
    computedMarginPercent = computedTotalRevenue > 0 ? Number(((computedProfit / computedTotalRevenue) * 100).toFixed(1)) : 0;
  } else {
    computedTotalCost = Number(rawMaterialCost || 0) + Number(karigarLabourCost || 0);
    computedTotalRevenue = Number(manualSellingPrice || 0);
    computedProfit = computedTotalRevenue - computedTotalCost;
    computedMarginPercent = computedTotalRevenue > 0 ? Number(((computedProfit / computedTotalRevenue) * 100).toFixed(1)) : 0;
  }

  // Load Customers, Suppliers, Next Order Number
  useEffect(() => {
    if (!isOpen || !currentPedhi?._id) return;

    // Delivery date default: 21 days from now
    const d = new Date();
    d.setDate(d.getDate() + 21);
    setDeliveryDate(d.toISOString().split('T')[0]);

    api.getCustomers(currentPedhi._id).then((res) => {
      setCustomers(res.customers || []);
      if (res.customers?.length > 0 && !selectedCustomerId) {
        setSelectedCustomerId(res.customers[0]._id);
      }
    });

    api.getSuppliers(currentPedhi._id).then((res) => {
      setSuppliers(res.suppliers || []);
    });

    api.getNextOrderNumber(currentPedhi._id).then((res) => {
      setOrderNumber(res.orderNumber);
    });

    handleTypeChange('takti');
  }, [isOpen, currentPedhi]);

  const handleTypeChange = (type: 'takti' | 'mandir' | 'murti' | 'custom') => {
    setProductType(type);
    if (type === 'takti') {
      setTitle(`${taktiStone} Takti (${taktiLen}"x${taktiWid}" = ${taktiSqFt} Sq.Ft)`);
      setSpecsSummary(`${taktiLen}"x${taktiWid}" = ${taktiSqFt} Sq.Ft (${taktiStone})`);
      setRawCostPerSqFt(taktiStone.includes('Lakha') ? 210 : taktiStone.includes('Marble') ? 260 : 180);
      setLabourCostPerSqFt(80);
      setSellingRatePerSqFt(440);
      const rev = Math.round(440 * taktiSqFt);
      setAdvancePaid(Math.round(rev * 0.5).toString());
    } else if (type === 'mandir') {
      setTitle(`Custom ${mandirMat} Mandir (${mandirW}"W x ${mandirD}"D x ${mandirH}"H)`);
      setSpecsSummary(`${mandirW}x${mandirD}x${mandirH} inches, ${mandirShikhara}`);
      setRawMaterialCost(38000);
      setKarigarLabourCost(18000);
      setManualSellingPrice(78000);
      setAdvancePaid('40000');
    } else if (type === 'murti') {
      setTitle(`${murtiDeity} Marble Murty (${murtiHeight} Inch)`);
      setSpecsSummary(`${murtiHeight} Inch, ${murtiMarble}, ${murtiShringar}`);
      setRawMaterialCost(36000);
      setKarigarLabourCost(16000);
      setManualSellingPrice(85000);
      setAdvancePaid('40000');
    }
  };

  const handleStoneChange = (newStone: string) => {
    setTaktiStone(newStone);
    let defaultRawCost = 210;
    let defaultSelling = 440;

    if (newStone === 'Lakha Red Stone') {
      defaultRawCost = 210;
      defaultSelling = 440;
    } else if (newStone === 'Makrana White Marble') {
      defaultRawCost = 280;
      defaultSelling = 520;
    } else if (newStone === 'Ambaji White Marble') {
      defaultRawCost = 230;
      defaultSelling = 460;
    } else if (newStone === 'Black Jet Granite') {
      defaultRawCost = 175;
      defaultSelling = 380;
    }

    setRawCostPerSqFt(defaultRawCost);
    setSellingRatePerSqFt(defaultSelling);
    setTitle(`${newStone} Takti (${taktiLen}"x${taktiWid}" = ${taktiSqFt} Sq.Ft)`);
    setSpecsSummary(`${taktiLen}"x${taktiWid}" = ${taktiSqFt} Sq.Ft (${newStone})`);
  };

  const handleSupplierSelect = (supplierName: string) => {
    setSelectedSupplierName(supplierName);
    const found = suppliers.find((s) => s.name === supplierName);
    if (found) {
      if (found.category === 'Stone Quarry') {
        if (found.materialSupplied.toLowerCase().includes('lakha')) setRawCostPerSqFt(220);
        else setRawCostPerSqFt(180);
      } else if (found.category === 'Makrana Marble') {
        setRawCostPerSqFt(310);
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      setError('Please select a customer / temple trust');
      return;
    }
    if (!currentPedhi?._id) return;

    setIsSubmitting(true);
    setError(null);

    const finalRevenue = computedTotalRevenue;
    const finalAdvance = Number(advancePaid) || 0;
    const finalBalance = Math.max(0, finalRevenue - finalAdvance);

    const payload = {
      pedhiId: currentPedhi._id,
      orderNumber,
      deliveryDate,
      customerId: selectedCustomerId,
      productType,
      title,
      specsSummary,
      customDetails: {
        stoneOrWoodType: productType === 'takti' ? taktiStone : productType === 'mandir' ? mandirMat : murtiMarble,
        dimensionsText:
          productType === 'takti'
            ? `${taktiLen}" x ${taktiWid}"`
            : productType === 'mandir'
            ? `${mandirW}"W x ${mandirD}"D x ${mandirH}"H`
            : `${murtiHeight} Inches`,
        calculatedSqFt: productType === 'takti' ? taktiSqFt : 0,
        heightInches: productType === 'murti' ? murtiHeight : 0,
        shikharaOrDome: productType === 'mandir' ? mandirShikhara : '',
        deityName: productType === 'murti' ? murtiDeity : '',
        goldWorkOrFinish: productType === 'murti' ? murtiShringar : '',
        engravingText: productType === 'takti' ? engravingText : '',
      },
      totalAmount: finalRevenue,
      advancePaid: finalAdvance,
      balanceDue: finalBalance,
      costPerSqFt: productType === 'takti' ? rawCostPerSqFt : 0,
      labourCostPerSqFt: productType === 'takti' ? labourCostPerSqFt : 0,
      totalCost: computedTotalCost,
      estimatedProfit: computedProfit,
      profitMarginPercent: computedMarginPercent,
      supplierName: selectedSupplierName,
      assignedKarigar,
      notes,
    };

    try {
      const res = await api.createOrder(payload);
      onSuccess(res.order);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to book order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-10">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-slate-100 text-sm sm:text-base">Book Order with Costing & Profit</h3>
              <span className="font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded text-xs border border-amber-500/30">
                {orderNumber}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Firm: {currentPedhi?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-4 mt-3 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Product Type Tabs */}
          <div className="grid grid-cols-3 gap-2">
            {(['takti', 'mandir', 'murti'] as const).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => handleTypeChange(t)}
                className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                  productType === t
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'takti' && '1. Takti (Sq.Ft)'}
                {t === 'mandir' && '2. Mandir (Size)'}
                {t === 'murti' && '3. Murti (Inches)'}
              </button>
            ))}
          </div>

          {/* Customer / Party */}
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold">Client / Temple Trust / Buyer *</label>
              <button
                type="button"
                onClick={onOpenCreateCustomer}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer font-medium"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add Party</span>
              </button>
            </div>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-semibold focus:outline-none focus:border-amber-500"
            >
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.mobile}) - {c.city}
                </option>
              ))}
            </select>
          </div>

          {/* 1. TAKTI CONFIGURATION & MEASUREMENT */}
          {productType === 'takti' && (
            <div className="bg-slate-800/50 p-3.5 rounded-xl border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span className="flex items-center space-x-1">
                  <Calculator className="w-4 h-4" />
                  <span>Taktis Measurement (Length × Width = Sq.Ft)</span>
                </span>
                <span className="font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-xs font-black">
                  {taktiSqFt} Sq.Ft
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Length (Inches)</label>
                  <input
                    type="number"
                    min="1"
                    value={taktiLen}
                    onChange={(e) => {
                      const l = Number(e.target.value);
                      setTaktiLen(l);
                      const sq = Number(((l * taktiWid) / 144).toFixed(2));
                      setTitle(`${taktiStone} Takti (${l}"x${taktiWid}" = ${sq} Sq.Ft)`);
                      setSpecsSummary(`${l}"x${taktiWid}" = ${sq} Sq.Ft (${taktiStone})`);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Width (Inches)</label>
                  <input
                    type="number"
                    min="1"
                    value={taktiWid}
                    onChange={(e) => {
                      const w = Number(e.target.value);
                      setTaktiWid(w);
                      const sq = Number(((taktiLen * w) / 144).toFixed(2));
                      setTitle(`${taktiStone} Takti (${taktiLen}"x${w}" = ${sq} Sq.Ft)`);
                      setSpecsSummary(`${taktiLen}"x${w}" = ${sq} Sq.Ft (${taktiStone})`);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Stone Material</label>
                  <select
                    value={taktiStone}
                    onChange={(e) => handleStoneChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold"
                  >
                    <option value="Lakha Red Stone">Lakha Red Stone</option>
                    <option value="Black Jet Granite">Black Jet Granite</option>
                    <option value="Makrana White Marble">Makrana White Marble</option>
                    <option value="Ambaji White Marble">Ambaji White Marble</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Donor Inscription / Takti Carving Text (Gujarati / Hindi / English)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. શ્રી સોમનાથ મહાદેવ મંદિર જીર્ણોદ્ધાર દાતા પરિવાર..."
                  value={engravingText}
                  onChange={(e) => setEngravingText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>
            </div>
          )}

          {/* 2. MANDIR CONFIGURATION */}
          {productType === 'mandir' && (
            <div className="bg-slate-800/50 p-3.5 rounded-xl border border-amber-500/30 space-y-3">
              <span className="text-amber-400 font-bold block">Mandir Dimensions & Architecture</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Material</label>
                  <select
                    value={mandirMat}
                    onChange={(e) => {
                      setMandirMat(e.target.value);
                      setTitle(`Custom ${e.target.value} Mandir (${mandirW}"W x ${mandirD}"D x ${mandirH}"H)`);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold"
                  >
                    <option value="Pure Sevan Wood">Pure Sevan Wood</option>
                    <option value="Makrana White Marble">Makrana White Marble</option>
                    <option value="Ambaji Marble">Ambaji White Marble</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Shikhara Style</label>
                  <select
                    value={mandirShikhara}
                    onChange={(e) => setMandirShikhara(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100"
                  >
                    <option value="3 Shikhara with Kalash">3 Shikhara with Kalash</option>
                    <option value="Single Gopuram Dome">Single Gopuram Dome</option>
                    <option value="Step Dome Flat Top">Step Dome Flat Top</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Width (Inches)</label>
                  <input
                    type="number"
                    value={mandirW}
                    onChange={(e) => setMandirW(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Depth (Inches)</label>
                  <input
                    type="number"
                    value={mandirD}
                    onChange={(e) => setMandirD(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Height (Inches)</label>
                  <input
                    type="number"
                    value={mandirH}
                    onChange={(e) => setMandirH(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. MURTI CONFIGURATION */}
          {productType === 'murti' && (
            <div className="bg-slate-800/50 p-3.5 rounded-xl border border-amber-500/30 space-y-3">
              <span className="text-amber-400 font-bold block">Bhagwan Marble Murty Specs</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Deity (Bhagwan)</label>
                  <select
                    value={murtiDeity}
                    onChange={(e) => {
                      setMurtiDeity(e.target.value);
                      setTitle(`${e.target.value} Marble Murty (${murtiHeight} Inch)`);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold"
                  >
                    <option value="Radha Krishna">Radha Krishna</option>
                    <option value="Ganeshji">Ganeshji</option>
                    <option value="Shiv Parivar">Shiv Parivar</option>
                    <option value="Ram Darbar">Ram Darbar</option>
                    <option value="Hanumanji">Hanumanji</option>
                    <option value="Jain Tirthankara">Jain Tirthankara</option>
                    <option value="Maa Ambaji">Maa Ambaji</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Height (Inches)</label>
                  <select
                    value={murtiHeight}
                    onChange={(e) => {
                      setMurtiHeight(Number(e.target.value));
                      setTitle(`${murtiDeity} Marble Murty (${e.target.value} Inch)`);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono font-bold"
                  >
                    <option value={12}>12 Inch</option>
                    <option value={15}>15 Inch</option>
                    <option value={18}>18 Inch</option>
                    <option value={21}>21 Inch</option>
                    <option value={24}>24 Inch (2 Ft)</option>
                    <option value={30}>30 Inch</option>
                    <option value={36}>36 Inch (3 Ft)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* DEDICATED FACTORY COSTING & PROFIT ENGINE (User's Exact Need) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-3.5 rounded-2xl border-2 border-emerald-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="font-extrabold text-slate-100 text-xs tracking-tight">
                  Factory Costing & Profit Calculator
                </span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-full">
                Profit Margin: {computedMarginPercent}%
              </span>
            </div>

            {/* Supplier / Quarry Batch Selection */}
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 text-[11px] font-semibold flex items-center space-x-1">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Raw Stone Supplier / Quarry Source:</span>
                </label>
                <span className="text-[10px] text-slate-400 italic">Custom rate editable below</span>
              </div>

              <select
                value={selectedSupplierName}
                onChange={(e) => handleSupplierSelect(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="Factory Yard Stock / Unknown">-- Factory Yard Stock / Unknown Supplier --</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s.name}>
                    {s.name} ({s.materialSupplied}) - {s.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Costing Inputs */}
            {productType === 'takti' ? (
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50">
                  <label className="block text-slate-400 text-[10px] mb-1">
                    Raw Stone Rate (₹/Sq.Ft) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1.5 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={rawCostPerSqFt}
                      onChange={(e) => setRawCostPerSqFt(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 pl-5 py-1 text-slate-100 font-mono font-bold"
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 block mt-0.5">Supplier purchase</span>
                </div>

                <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50">
                  <label className="block text-slate-400 text-[10px] mb-1">
                    Carving & Gold (₹/Sq.Ft)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1.5 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={labourCostPerSqFt}
                      onChange={(e) => setLabourCostPerSqFt(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 pl-5 py-1 text-slate-100 font-mono font-bold"
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 block mt-0.5">Karigar / CNC labor</span>
                </div>

                <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50">
                  <label className="block text-amber-400 font-semibold text-[10px] mb-1">
                    Selling Rate (₹/Sq.Ft) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1.5 text-amber-400 font-bold">₹</span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={sellingRatePerSqFt}
                      onChange={(e) => setSellingRatePerSqFt(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-amber-500/50 rounded px-2 pl-5 py-1 text-amber-300 font-mono font-black"
                    />
                  </div>
                  <span className="text-[9px] text-amber-400/80 block mt-0.5">Charged to buyer</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50">
                  <label className="block text-slate-400 text-[10px] mb-1">Raw Wood/Marble (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={rawMaterialCost}
                    onChange={(e) => setRawMaterialCost(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono font-bold"
                  />
                </div>
                <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50">
                  <label className="block text-slate-400 text-[10px] mb-1">Karigar Labour (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={karigarLabourCost}
                    onChange={(e) => setKarigarLabourCost(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono font-bold"
                  />
                </div>
                <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/50">
                  <label className="block text-amber-400 font-semibold text-[10px] mb-1">Selling Quote (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={manualSellingPrice}
                    onChange={(e) => setManualSellingPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-amber-500/50 rounded px-2 py-1 text-amber-300 font-mono font-black"
                  />
                </div>
              </div>
            )}

            {/* LIVE FINANCIAL BREAKDOWN & PROFIT BADGE */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>
                  Total Factory Cost {productType === 'takti' ? `(${rawCostPerSqFt + labourCostPerSqFt} ₹/SqFt × ${taktiSqFt} SqFt)` : ''}:
                </span>
                <span className="font-mono text-slate-300 font-semibold">₹{computedTotalCost.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-slate-300 font-medium">
                <span>Total Client Billing (Revenue):</span>
                <span className="font-mono font-bold text-slate-100">₹{computedTotalRevenue.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center pt-1.5 border-t border-slate-800">
                <span className="font-bold text-xs text-emerald-300">Net Estimated Profit:</span>
                <div className="text-right">
                  <span
                    className={`text-base font-black font-mono ${
                      computedProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {computedProfit >= 0 ? '+' : '-'}₹{Math.abs(computedProfit).toLocaleString('en-IN')}
                  </span>
                  <span
                    className={`ml-2 text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      computedMarginPercent >= 25
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : computedMarginPercent >= 10
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {computedMarginPercent}% Margin
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ADVANCE & DATES */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Delivery Date *</label>
              <input
                type="date"
                required
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Advance Received Now (₹)</label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-emerald-400 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  max={computedTotalRevenue}
                  value={advancePaid}
                  onChange={(e) => setAdvancePaid(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-emerald-400 font-bold font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Balance Due: ₹
                {Math.max(0, computedTotalRevenue - (Number(advancePaid) || 0)).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Assigned Karigar / Artisan</label>
              <input
                type="text"
                placeholder="e.g. Master Ramkishan / Workshop A"
                value={assignedKarigar}
                onChange={(e) => setAssignedKarigar(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Site Delivery Remarks</label>
              <input
                type="text"
                placeholder="e.g. Crate packing, temple delivery"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center space-x-1.5 shadow-md shadow-amber-950/40 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Booking...' : 'Confirm Order & Profit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
