import React, { useState, useEffect } from 'react';
import { X, Building2, Save, MapPin, Landmark, Settings } from 'lucide-react';
import { Pedhi } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface PedhiFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedhiToEdit?: Pedhi | null;
  onSuccess: () => void;
}

export const PedhiFormModal: React.FC<PedhiFormModalProps> = ({
  isOpen,
  onClose,
  pedhiToEdit,
  onSuccess,
}) => {
  const { refreshPedhis, updateCurrentPedhiState } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'bank' | 'invoice'>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    businessType: 'Wholesale & Retail',
    tagline: '',
    mobile: '',
    email: '',
    address: '',
    city: 'Rajkot',
    state: 'Gujarat',
    pincode: '360001',
    gstNumber: '',
    panNumber: '',
    bankName: 'State Bank of India',
    accountHolder: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
    upiId: '',
    invoicePrefix: 'GS/',
    invoiceNextNumber: 101,
    termsAndConditions: '1. Goods once sold will not be taken back without notice.\n2. Subject to local jurisdiction.',
  });

  useEffect(() => {
    if (pedhiToEdit) {
      setFormData({
        name: pedhiToEdit.name || '',
        businessType: pedhiToEdit.businessType || 'Wholesale & Retail',
        tagline: pedhiToEdit.tagline || '',
        mobile: pedhiToEdit.contactDetails?.mobile || '',
        email: pedhiToEdit.contactDetails?.email || '',
        address: pedhiToEdit.contactDetails?.address || '',
        city: pedhiToEdit.contactDetails?.city || 'Rajkot',
        state: pedhiToEdit.contactDetails?.state || 'Gujarat',
        pincode: pedhiToEdit.contactDetails?.pincode || '',
        gstNumber: pedhiToEdit.contactDetails?.gstNumber || '',
        panNumber: pedhiToEdit.contactDetails?.panNumber || '',
        bankName: pedhiToEdit.bankDetails?.bankName || 'State Bank of India',
        accountHolder: pedhiToEdit.bankDetails?.accountHolder || '',
        accountNumber: pedhiToEdit.bankDetails?.accountNumber || '',
        ifscCode: pedhiToEdit.bankDetails?.ifscCode || '',
        branch: pedhiToEdit.bankDetails?.branch || '',
        upiId: pedhiToEdit.bankDetails?.upiId || '',
        invoicePrefix: pedhiToEdit.settings?.invoicePrefix || 'GS/',
        invoiceNextNumber: pedhiToEdit.settings?.invoiceNextNumber || 101,
        termsAndConditions: pedhiToEdit.settings?.termsAndConditions || '',
      });
    } else {
      setFormData({
        name: '',
        businessType: 'Wholesale & Retail',
        tagline: '',
        mobile: '',
        email: '',
        address: '',
        city: 'Rajkot',
        state: 'Gujarat',
        pincode: '360001',
        gstNumber: '',
        panNumber: '',
        bankName: 'State Bank of India',
        accountHolder: '',
        accountNumber: '',
        ifscCode: '',
        branch: '',
        upiId: '',
        invoicePrefix: 'GS/',
        invoiceNextNumber: 101,
        termsAndConditions: '1. Goods once sold will not be taken back without notice.\n2. Subject to local jurisdiction.',
      });
    }
    setError(null);
  }, [pedhiToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Pedhi name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      name: formData.name.trim(),
      businessType: formData.businessType,
      tagline: formData.tagline,
      contactDetails: {
        mobile: formData.mobile,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        gstNumber: formData.gstNumber.trim().toUpperCase(),
        panNumber: formData.panNumber.trim().toUpperCase(),
      },
      bankDetails: {
        bankName: formData.bankName,
        accountHolder: formData.accountHolder || formData.name,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode.trim().toUpperCase(),
        branch: formData.branch,
        upiId: formData.upiId,
      },
      settings: {
        currency: 'INR',
        dateFormat: 'DD/MM/YYYY',
        invoicePrefix: formData.invoicePrefix.trim(),
        invoiceNextNumber: Number(formData.invoiceNextNumber) || 101,
        stateCode: '24',
        termsAndConditions: formData.termsAndConditions,
      },
    };

    try {
      if (pedhiToEdit) {
        const res = await api.updatePedhi(pedhiToEdit._id, payload);
        updateCurrentPedhiState(res.pedhi);
      } else {
        await api.createPedhi(payload);
      }
      await refreshPedhis();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save Pedhi details');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                {pedhiToEdit ? 'Edit Pedhi Settings' : 'Create New Business Pedhi'}
              </h3>
              <p className="text-xs text-slate-400">Configure firm profile, GSTIN & bank details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === 'general'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Profile & Address</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`py-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === 'bank'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Bank & UPI</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('invoice')}
            className={`py-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === 'invoice'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Invoice & Terms</span>
          </button>
        </div>

        {error && (
          <div className="mx-4 mt-3 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {activeTab === 'general' && (
            <>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Pedhi / Firm Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Girnar Shilp - Showroom & Carvings"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Business Type</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Temple Architecture & Artifacts">Temple Arts & Artifacts</option>
                    <option value="Slab Cutting & Wholesale Tiles">Stone & Slab Cutting</option>
                    <option value="Wholesale & Retail">Wholesale & Retail</option>
                    <option value="Manufacturing & Works">Manufacturing & Works</option>
                    <option value="General Trading">General Trading</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Firm Tagline / Specialty</label>
                <input
                  type="text"
                  placeholder="e.g. Master Craftsmen in Temple Shikhara & Marble"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    placeholder="24AAACG1234F1Z8"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono uppercase placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">PAN Number</label>
                  <input
                    type="text"
                    placeholder="AAACG1234F"
                    value={formData.panNumber}
                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono uppercase placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Street Address</label>
                <textarea
                  rows={2}
                  placeholder="Plot No., Road, Industrial Area"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'bank' && (
            <>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Bank Name</label>
                <input
                  type="text"
                  placeholder="State Bank of India / HDFC Bank"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    placeholder="Pedhi / Proprietor Name"
                    value={formData.accountHolder}
                    onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 389012345678"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">IFSC Code</label>
                  <input
                    type="text"
                    placeholder="SBIN0001234"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Branch Name</label>
                  <input
                    type="text"
                    placeholder="Aji GIDC Rajkot"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">UPI ID for Quick Payment</label>
                <input
                  type="text"
                  placeholder="e.g. girnarshilp@sbi"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">This will be printed on customer invoices for instant QR payment.</p>
              </div>
            </>
          )}

          {activeTab === 'invoice' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Invoice Prefix</label>
                  <input
                    type="text"
                    placeholder="e.g. GS/RJK/"
                    value={formData.invoicePrefix}
                    onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Next Bill Number</label>
                  <input
                    type="number"
                    value={formData.invoiceNextNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNextNumber: Number(e.target.value) })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Invoice Terms & Conditions</label>
                <textarea
                  rows={4}
                  value={formData.termsAndConditions}
                  onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </>
          )}

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
              <span>{isSubmitting ? 'Saving...' : pedhiToEdit ? 'Save Changes' : 'Create Pedhi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
