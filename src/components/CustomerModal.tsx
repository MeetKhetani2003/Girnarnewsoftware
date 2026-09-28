import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Phone, MapPin, ReceiptText } from 'lucide-react';
import { Customer } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerToEdit?: Customer | null;
  onSuccess: (customer?: Customer) => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  customerToEdit,
  onSuccess,
}) => {
  const { currentPedhi } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    partyType: 'Customer' as 'Customer' | 'Vendor' | 'Both',
    mobile: '',
    email: '',
    address: '',
    city: 'Rajkot',
    state: 'Gujarat',
    pincode: '',
    gstNumber: '',
    panNumber: '',
    openingBalance: '0',
    balanceType: 'receive', // 'receive' (Lena) or 'pay' (Dena)
    creditLimit: '0',
    notes: '',
  });

  useEffect(() => {
    if (customerToEdit) {
      const op = customerToEdit.openingBalance || 0;
      setFormData({
        name: customerToEdit.name || '',
        partyType: customerToEdit.partyType || 'Customer',
        mobile: customerToEdit.mobile || '',
        email: customerToEdit.email || '',
        address: customerToEdit.address || '',
        city: customerToEdit.city || 'Rajkot',
        state: customerToEdit.state || 'Gujarat',
        pincode: customerToEdit.pincode || '',
        gstNumber: customerToEdit.gstNumber || '',
        panNumber: customerToEdit.panNumber || '',
        openingBalance: Math.abs(op).toString(),
        balanceType: op < 0 ? 'pay' : 'receive',
        creditLimit: (customerToEdit.creditLimit || 0).toString(),
        notes: customerToEdit.notes || '',
      });
    } else {
      setFormData({
        name: '',
        partyType: 'Customer',
        mobile: '',
        email: '',
        address: '',
        city: currentPedhi?.contactDetails?.city || 'Rajkot',
        state: currentPedhi?.contactDetails?.state || 'Gujarat',
        pincode: '',
        gstNumber: '',
        panNumber: '',
        openingBalance: '0',
        balanceType: 'receive',
        creditLimit: '0',
        notes: '',
      });
    }
    setError(null);
  }, [customerToEdit, isOpen, currentPedhi]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim()) {
      setError('Party name and mobile number are required');
      return;
    }

    if (!currentPedhi?._id) {
      setError('No active Pedhi selected');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const absBalance = Math.abs(Number(formData.openingBalance) || 0);
    const finalOpeningBalance = formData.balanceType === 'pay' ? -absBalance : absBalance;

    const payload: Partial<Customer> = {
      pedhiId: currentPedhi._id,
      name: formData.name.trim(),
      partyType: formData.partyType,
      mobile: formData.mobile.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
      gstNumber: formData.gstNumber.trim().toUpperCase(),
      panNumber: formData.panNumber.trim().toUpperCase(),
      openingBalance: finalOpeningBalance,
      creditLimit: Number(formData.creditLimit) || 0,
      notes: formData.notes.trim(),
    };

    try {
      if (customerToEdit) {
        const res = await api.updateCustomer(customerToEdit._id, payload);
        onSuccess(res.customer);
      } else {
        const res = await api.createCustomer(payload);
        onSuccess(res.customer);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save party');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                {customerToEdit ? 'Edit Party (Khata)' : 'Add New Party (Customer / Vendor)'}
              </h3>
              <p className="text-xs text-slate-400">Manage account ledger for {currentPedhi?.name}</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {/* Party Type Radio */}
          <div className="flex items-center space-x-2 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
            {(['Customer', 'Vendor', 'Both'] as const).map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setFormData({ ...formData, partyType: type })}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  formData.partyType === type
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Party / Business Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Somnath Mandir Trust / Patel Builders"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Mobile Number *</label>
              <input
                type="tel"
                required
                placeholder="10-digit mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Email (Optional)</label>
              <input
                type="email"
                placeholder="party@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Opening Balance with Lena / Dena toggle */}
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/80 space-y-2">
            <label className="block text-slate-300 font-medium">Opening Balance (Khata)</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.openingBalance}
                  onChange={(e) => setFormData({ ...formData, openingBalance: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, balanceType: 'receive' })}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    formData.balanceType === 'receive'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Party owes you money (Receivable)"
                >
                  Lena (To Receive)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, balanceType: 'pay' })}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    formData.balanceType === 'pay'
                      ? 'bg-rose-500 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="You owe party money (Payable)"
                >
                  Dena (To Pay)
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">GSTIN Number</label>
              <input
                type="text"
                placeholder="24AAAAA0000A1Z5"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono uppercase placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Credit Limit (₹)</label>
              <input
                type="number"
                placeholder="e.g. 200000"
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Billing Address & City</label>
            <input
              type="text"
              placeholder="e.g. Near Ring Road, Rajkot"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Notes / Remarks</label>
            <textarea
              rows={2}
              placeholder="e.g. Prefers RTGS transfer, reliable client"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
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
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : customerToEdit ? 'Save Changes' : 'Add Party'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
