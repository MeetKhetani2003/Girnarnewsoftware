import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, FileText, CheckCircle2, UserPlus, ArrowRight } from 'lucide-react';
import { Customer, Product, Invoice } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface InvoiceCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (invoice: Invoice) => void;
  onOpenCreateCustomer: () => void;
}

interface FormItem {
  productId: string;
  name: string;
  unit: string;
  quantity: number;
  rate: number;
  discountPercent: number;
  gstRate: number;
}

export const InvoiceCreateModal: React.FC<InvoiceCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenCreateCustomer,
}) => {
  const { currentPedhi } = useAuth();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState<string>('');
  const [isInterstate, setIsInterstate] = useState<boolean>(false);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Credit'>('Credit');
  const [amountPaid, setAmountPaid] = useState<string>('0');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [items, setItems] = useState<FormItem[]>([
    {
      productId: '',
      name: '',
      unit: 'Pcs',
      quantity: 1,
      rate: 0,
      discountPercent: 0,
      gstRate: 18,
    },
  ]);

  // Load parties, products, and next invoice number
  useEffect(() => {
    if (!isOpen || !currentPedhi?._id) return;

    const loadData = async () => {
      try {
        const [custRes, prodRes, numRes] = await Promise.all([
          api.getCustomers(currentPedhi._id),
          api.getProducts(currentPedhi._id),
          api.getNextInvoiceNumber(currentPedhi._id),
        ]);

        setCustomers(custRes.customers || []);
        setProducts(prodRes.products || []);
        setInvoiceNumber(numRes.invoiceNumber || 'GS/101');

        if (custRes.customers?.length > 0 && !selectedCustomerId) {
          setSelectedCustomerId(custRes.customers[0]._id);
        }

        // Auto select first product for line 1 if blank
        if (prodRes.products?.length > 0 && !items[0].productId) {
          const first = prodRes.products[0];
          setItems([
            {
              productId: first._id,
              name: first.name,
              unit: first.unit,
              quantity: 1,
              rate: first.sellingPrice,
              discountPercent: 0,
              gstRate: first.gstRate,
            },
          ]);
        }
      } catch (err: any) {
        console.error('Error loading invoice form data:', err);
      }
    };

    loadData();
  }, [isOpen, currentPedhi]);

  // Calculations
  const calculatedItems = items.map((item) => {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const disc = Number(item.discountPercent) || 0;
    const gross = qty * rate;
    const discountAmount = (gross * disc) / 100;
    const taxable = gross - discountAmount;
    const gstRate = Number(item.gstRate) || 0;
    const taxAmount = (taxable * gstRate) / 100;
    const total = taxable + taxAmount;

    return {
      ...item,
      taxable,
      taxAmount,
      total,
    };
  });

  const subtotal = calculatedItems.reduce((sum, it) => sum + it.taxable, 0);
  const totalTax = calculatedItems.reduce((sum, it) => sum + it.taxAmount, 0);
  const rawGrandTotal = subtotal + totalTax;
  const grandTotal = Math.round(rawGrandTotal);
  const roundOff = Number((grandTotal - rawGrandTotal).toFixed(2));

  // Auto set amount paid when changing payment mode
  const handlePaymentModeChange = (mode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Credit') => {
    setPaymentMode(mode);
    if (mode === 'Credit') {
      setAmountPaid('0');
    } else {
      setAmountPaid(grandTotal.toString());
    }
  };

  const handleProductSelect = (index: number, productId: string) => {
    const prod = products.find((p) => p._id === productId);
    if (!prod) return;

    setItems((prev) => {
      const copy = [...prev];
      copy[index] = {
        productId: prod._id,
        name: prod.name,
        unit: prod.unit,
        quantity: copy[index]?.quantity || 1,
        rate: prod.sellingPrice,
        discountPercent: copy[index]?.discountPercent || 0,
        gstRate: prod.gstRate,
      };
      return copy;
    });
  };

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      {
        productId: '',
        name: '',
        unit: 'Pcs',
        quantity: 1,
        rate: 0,
        discountPercent: 0,
        gstRate: 18,
      },
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      setError('Please select a customer / party');
      return;
    }

    if (items.some((it) => !it.name.trim() || it.quantity <= 0)) {
      setError('Each item must have a valid name and quantity greater than 0');
      return;
    }

    if (!currentPedhi?._id) return;

    setIsSubmitting(true);
    setError(null);

    const payload = {
      pedhiId: currentPedhi._id,
      customerId: selectedCustomerId,
      invoiceNumber,
      date,
      dueDate: dueDate || undefined,
      isInterstate,
      items: items.map((it) => ({
        productId: it.productId || undefined,
        name: it.name,
        unit: it.unit,
        quantity: Number(it.quantity) || 1,
        rate: Number(it.rate) || 0,
        discountPercent: Number(it.discountPercent) || 0,
        gstRate: Number(it.gstRate) || 0,
      })),
      discountTotal: 0,
      paymentMode,
      amountPaid: Number(amountPaid) || 0,
      notes,
    };

    try {
      const res = await api.createInvoice(payload);
      onSuccess(res.invoice);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to generate invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectedCustomer = customers.find((c) => c._id === selectedCustomerId);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-100 text-sm sm:text-base">Create Tax Invoice</h3>
                <span className="font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded text-xs border border-amber-500/30">
                  {invoiceNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{currentPedhi?.name}</p>
            </div>
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

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Party and Date Section */}
          <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold">Bill To Party (Khata) *</label>
              <button
                type="button"
                onClick={onOpenCreateCustomer}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center space-x-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add New Party</span>
              </button>
            </div>

            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs font-semibold focus:outline-none focus:border-amber-500"
            >
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.mobile}) {c.currentBalance !== 0 ? `| Bal: ₹${c.currentBalance}` : ''}
                </option>
              ))}
            </select>

            {selectedCustomer && (
              <div className="text-[11px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1 pt-1 border-t border-slate-700/40">
                <span>
                  GSTIN:{' '}
                  <strong className="text-slate-300 font-mono">
                    {selectedCustomer.gstNumber || 'Unregistered'}
                  </strong>
                </span>
                <span>
                  City: <strong className="text-slate-300">{selectedCustomer.city || 'Rajkot'}</strong>
                </span>
                <span>
                  Balance:{' '}
                  <strong
                    className={
                      selectedCustomer.currentBalance > 0
                        ? 'text-emerald-400 font-mono'
                        : selectedCustomer.currentBalance < 0
                        ? 'text-rose-400 font-mono'
                        : 'text-slate-300'
                    }
                  >
                    ₹{Math.abs(selectedCustomer.currentBalance).toLocaleString('en-IN')}{' '}
                    {selectedCustomer.currentBalance > 0 ? '(Lena)' : selectedCustomer.currentBalance < 0 ? '(Dena)' : '(Settled)'}
                  </strong>
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-slate-400 mb-1">Invoice Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center">
                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer select-none mt-4 sm:mt-0">
                  <input
                    type="checkbox"
                    checked={isInterstate}
                    onChange={(e) => setIsInterstate(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-slate-700 bg-slate-900"
                  />
                  <span>Interstate (IGST)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                Items / Products ({items.length})
              </label>
              <button
                type="button"
                onClick={addItemRow}
                className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item Line</span>
              </button>
            </div>

            {items.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 space-y-2.5 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400 text-[11px]">Item #{idx + 1}</span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItemRow(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-0.5">Select from Inventory</label>
                    <select
                      value={item.productId}
                      onChange={(e) => handleProductSelect(idx, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="">-- Choose Item or Custom --</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} (Stock: {p.currentStock} {p.unit}) - ₹{p.sellingPrice}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[10px] mb-0.5">Item Description *</label>
                    <input
                      type="text"
                      required
                      placeholder="Product or Work Name"
                      value={item.name}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx].name = e.target.value;
                        setItems(copy);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Qty, Unit, Rate, Disc, GST */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-0.5">Qty</label>
                    <input
                      type="number"
                      min="0.01"
                      step="any"
                      required
                      value={item.quantity}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx].quantity = Number(e.target.value);
                        setItems(copy);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-0.5">Unit</label>
                    <select
                      value={item.unit}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx].unit = e.target.value;
                        setItems(copy);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="Pcs">Pcs</option>
                      <option value="SqFt">SqFt</option>
                      <option value="Brass">Brass</option>
                      <option value="Ton">Ton</option>
                      <option value="Kg">Kg</option>
                      <option value="Box">Box</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-0.5">Rate (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={item.rate}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx].rate = Number(e.target.value);
                        setItems(copy);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-0.5">Disc %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={item.discountPercent}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx].discountPercent = Number(e.target.value);
                        setItems(copy);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-slate-400 text-[10px] mb-0.5">GST %</label>
                    <select
                      value={item.gstRate}
                      onChange={(e) => {
                        const copy = [...items];
                        copy[idx].gstRate = Number(e.target.value);
                        setItems(copy);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-amber-500 font-semibold"
                    >
                      <option value={0}>0%</option>
                      <option value={5}>5%</option>
                      <option value={12}>12%</option>
                      <option value={18}>18%</option>
                      <option value={28}>28%</option>
                    </select>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400 pt-1 border-t border-slate-700/30">
                  Taxable: ₹{calculatedItems[idx].taxable.toFixed(2)} + GST: ₹
                  {calculatedItems[idx].taxAmount.toFixed(2)} ={' '}
                  <strong className="text-slate-100 font-bold">
                    ₹{calculatedItems[idx].total.toFixed(2)}
                  </strong>
                </div>
              </div>
            ))}
          </div>

          {/* Billing Totals & Payment Status */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80 space-y-3">
            <div className="space-y-1.5 text-slate-300 text-xs">
              <div className="flex justify-between">
                <span>Taxable Subtotal:</span>
                <span className="font-mono">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>
                  {isInterstate ? 'IGST Total:' : 'CGST + SGST Total:'}
                </span>
                <span className="font-mono">₹{totalTax.toFixed(2)}</span>
              </div>
              {roundOff !== 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Round Off:</span>
                  <span className="font-mono">{roundOff > 0 ? `+₹${roundOff}` : `-₹${Math.abs(roundOff)}`}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-100 pt-2 border-t border-slate-700">
                <span>Grand Total:</span>
                <span className="font-mono text-amber-400 text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Mode Selection */}
            <div className="pt-2 border-t border-slate-700/60 space-y-2">
              <label className="block text-slate-300 font-semibold">Payment Mode & Terms</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {(['Credit', 'Cash', 'UPI', 'Bank Transfer', 'Cheque'] as const).map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => handlePaymentModeChange(m)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer ${
                      paymentMode === m
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {m === 'Credit' ? 'Credit (Udhaar)' : m}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Amount Paid Now (₹)</label>
                  <input
                    type="number"
                    min="0"
                    max={grandTotal}
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Balance Due (Added to Khata)</label>
                  <div className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-amber-400 font-bold font-mono">
                    ₹{Math.max(0, grandTotal - (Number(amountPaid) || 0)).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-[10px] mb-0.5">Vehicle No / Site Notes / Remarks</label>
              <input
                type="text"
                placeholder="e.g. GJ-03-BW-9901 tempo delivery / Somnath project site"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
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
              <span>{isSubmitting ? 'Generating Bill...' : 'Generate Invoice'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
