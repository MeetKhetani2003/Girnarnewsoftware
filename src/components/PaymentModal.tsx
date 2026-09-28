import React, { useState, useEffect } from 'react';
import { X, ArrowDownRight, ArrowUpRight, CheckCircle2, User } from 'lucide-react';
import { Customer } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'PAYMENT_IN' | 'PAYMENT_OUT';
  preselectedCustomer?: Customer | null;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'PAYMENT_IN',
  preselectedCustomer,
  onSuccess,
}) => {
  const { currentPedhi } = useAuth();
  const [type, setType] = useState<'PAYMENT_IN' | 'PAYMENT_OUT'>(defaultType);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [partyName, setPartyName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque'>('UPI');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [category, setCategory] = useState<string>('Customer Payment');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setType(defaultType);
    if (defaultType === 'PAYMENT_IN') {
      setCategory('Customer Payment');
    } else {
      setCategory('Supplier Payment');
    }
  }, [defaultType, isOpen]);

  useEffect(() => {
    if (!isOpen || !currentPedhi?._id) return;

    api.getCustomers(currentPedhi._id).then((res) => {
      setCustomers(res.customers || []);
      if (preselectedCustomer) {
        setSelectedCustomerId(preselectedCustomer._id);
        setPartyName(preselectedCustomer.name);
      } else if (res.customers?.length > 0 && !selectedCustomerId) {
        setSelectedCustomerId(res.customers[0]._id);
        setPartyName(res.customers[0].name);
      }
    });
  }, [isOpen, currentPedhi, preselectedCustomer]);

  if (!isOpen) return null;

  const handleTypeChange = (newType: 'PAYMENT_IN' | 'PAYMENT_OUT') => {
    setType(newType);
    if (newType === 'PAYMENT_IN') {
      setCategory('Customer Payment');
    } else {
      setCategory('Supplier Payment');
    }
  };

  const handleCustomerChange = (id: string) => {
    setSelectedCustomerId(id);
    const found = customers.find((c) => c._id === id);
    if (found) setPartyName(found.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }

    if (!currentPedhi?._id) {
      setError('No active Pedhi selected');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.createTransaction({
        pedhiId: currentPedhi._id,
        date,
        type,
        amount: parsedAmount,
        customerId: selectedCustomerId || undefined,
        partyName: partyName.trim() || 'General Cash Counter',
        paymentMode,
        referenceNumber: referenceNumber.trim(),
        category,
        notes: notes.trim(),
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCustomer = customers.find((c) => c._id === selectedCustomerId);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <h3 className="font-bold text-slate-100 text-sm sm:text-base">
              Record {type === 'PAYMENT_IN' ? 'Jama (Receipt / Cash In)' : 'Naame (Payment / Cash Out)'}
            </h3>
            <p className="text-xs text-slate-400">Rojmel & Khata Ledger for {currentPedhi?.name}</p>
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

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs overflow-y-auto">
          {/* Jama / Naame Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleTypeChange('PAYMENT_IN')}
              className={`py-2 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                type === 'PAYMENT_IN'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowDownRight className="w-4 h-4 text-slate-950" />
              <span>Jama / Inflow (+)</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('PAYMENT_OUT')}
              className={`py-2 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                type === 'PAYMENT_OUT'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-950/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-white" />
              <span>Naame / Outflow (-)</span>
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Amount (₹) *</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-lg font-bold text-slate-400">₹</span>
              <input
                type="number"
                required
                min="1"
                step="any"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xl font-black text-amber-400 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Customer / Party Select */}
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 space-y-2">
            <label className="block text-slate-300 font-medium">Link to Party / Khata (Optional)</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => handleCustomerChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="">-- Direct Expense / Counter Cash (No Party) --</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.mobile}) - Current Bal: ₹{c.currentBalance}
                </option>
              ))}
            </select>

            {selectedCustomer ? (
              <div className="text-[11px] text-slate-400 pt-1">
                Current Balance:{' '}
                <strong
                  className={selectedCustomer.currentBalance > 0 ? 'text-emerald-400' : 'text-rose-400'}
                >
                  ₹{Math.abs(selectedCustomer.currentBalance).toLocaleString('en-IN')}{' '}
                  {selectedCustomer.currentBalance > 0 ? '(Lena)' : '(Dena)'}
                </strong>
                {amount && Number(amount) > 0 && (
                  <span className="block text-slate-300 mt-0.5">
                    Updated Khata after this transaction:{' '}
                    <strong>
                      ₹
                      {Math.abs(
                        selectedCustomer.currentBalance + (type === 'PAYMENT_IN' ? -Number(amount) : Number(amount))
                      ).toLocaleString('en-IN')}
                    </strong>
                  </span>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-slate-400 text-[10px] mb-0.5">Custom Party / Payee Name</label>
                <input
                  type="text"
                  placeholder="e.g. Karigar Ramesh, Petrol, Shop Rent"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {/* Payment Mode Pills */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Payment Mode</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['UPI', 'Cash', 'Bank Transfer', 'Cheque'] as const).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setPaymentMode(mode)}
                  className={`py-1.5 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
                    paymentMode === mode
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Ref / UTR / Cheque #</label>
              <input
                type="text"
                placeholder="UPI-1234 or Cheque #"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Category / Purpose</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
            >
              {type === 'PAYMENT_IN' ? (
                <>
                  <option value="Customer Payment">Customer Bill Payment</option>
                  <option value="Customer Advance">Advance / Booking Deposit</option>
                  <option value="Counter Cash Sale">Counter Cash Sale</option>
                  <option value="Other Income">Other Business Income</option>
                </>
              ) : (
                <>
                  <option value="Supplier Payment">Supplier / Quarry Payment</option>
                  <option value="Labour / Karigar Wages">Labour / Karigar Wages (Majuri)</option>
                  <option value="Transport / Freight">Transport & Freight (Bhadu)</option>
                  <option value="Shop & Office Expense">Shop / Electricity / Office</option>
                  <option value="Packaging & Tooling">Packaging, Blades & Tooling</option>
                  <option value="Other Expense">Other Expense</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Notes / Description</label>
            <input
              type="text"
              placeholder="e.g. Paid against Bill #101"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
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
              <span>{isSubmitting ? 'Recording...' : 'Save Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
