import React, { useState } from 'react';
import { X, Printer, Share2, DollarSign, Building2, CheckCircle, Clock } from 'lucide-react';
import { Invoice, Pedhi } from '../types/index.ts';
import { api } from '../services/api.ts';

interface InvoiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  pedhi: Pedhi | null;
  onPaymentRecorded?: () => void;
}

export const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({
  isOpen,
  onClose,
  invoice,
  pedhi,
  onPaymentRecorded,
}) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [refNum, setRefNum] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `*Tax Invoice from ${pedhi?.name || 'Girnar Shilp'}*\n` +
      `Bill No: ${invoice.invoiceNumber}\n` +
      `Date: ${new Date(invoice.date).toLocaleDateString('en-IN')}\n` +
      `Bill Amount: ₹${invoice.grandTotal.toLocaleString('en-IN')}\n` +
      `Paid: ₹${invoice.amountPaid.toLocaleString('en-IN')}\n` +
      `*Balance Due: ₹${invoice.balanceDue.toLocaleString('en-IN')}*\n` +
      (pedhi?.bankDetails?.upiId ? `Pay via UPI: ${pedhi.bankDetails.upiId}\n` : '') +
      `Thank you for your business!`;

    const encoded = encodeURIComponent(text);
    const mobileClean = invoice.customerMobile?.replace(/[^0-9]/g, '');
    const url = mobileClean && mobileClean.length >= 10
      ? `https://wa.me/91${mobileClean.slice(-10)}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    
    window.open(url, '_blank');
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(payAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsProcessing(true);
    try {
      await api.recordInvoicePayment(invoice._id, {
        amount,
        paymentMode,
        referenceNumber: refNum,
      });
      invoice.amountPaid += amount;
      invoice.balanceDue = Math.max(0, invoice.grandTotal - invoice.amountPaid);
      invoice.paymentStatus = invoice.balanceDue === 0 ? 'Paid' : 'Partial';
      setShowPaymentForm(false);
      setPayAmount('');
      if (onPaymentRecorded) onPaymentRecorded();
    } catch (err: any) {
      alert(err.message || 'Payment recording failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Action Bar */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-10 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-100 text-sm">Invoice #{invoice.invoiceNumber}</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                invoice.paymentStatus === 'Paid'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : invoice.paymentStatus === 'Partial'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {invoice.paymentStatus.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {invoice.balanceDue > 0 && (
              <button
                onClick={() => {
                  setPayAmount(invoice.balanceDue.toString());
                  setShowPaymentForm(true);
                }}
                className="flex items-center space-x-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Record</span> Payment
              </button>
            )}
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Payment Form Drawer (if opened) */}
        {showPaymentForm && (
          <form
            onSubmit={handleRecordPayment}
            className="bg-slate-800 p-4 border-b border-slate-700 flex flex-wrap items-center gap-3 text-xs"
          >
            <span className="font-bold text-slate-200">Record Payment:</span>
            <input
              type="number"
              required
              max={invoice.balanceDue}
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              placeholder="Amount"
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold w-28 focus:outline-none focus:border-amber-500"
            />
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
            >
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
            <input
              type="text"
              placeholder="UTR / Ref No"
              value={refNum}
              onChange={(e) => setRefNum(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 flex-1 min-w-[120px] focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={isProcessing}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? 'Saving...' : 'Confirm'}
            </button>
            <button
              type="button"
              onClick={() => setShowPaymentForm(false)}
              className="text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white text-slate-900 text-xs">
          {/* Top Firm Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center text-sm">
                    GS
                  </div>
                  <h1 className="text-xl font-black text-slate-950 tracking-tight uppercase">
                    {pedhi?.name || 'Girnar Shilp'}
                  </h1>
                </div>
                {pedhi?.tagline && <p className="text-xs text-slate-600 font-medium">{pedhi.tagline}</p>}
                <p className="text-[11px] text-slate-600 max-w-md">
                  {pedhi?.contactDetails?.address}, {pedhi?.contactDetails?.city}, {pedhi?.contactDetails?.state} -{' '}
                  {pedhi?.contactDetails?.pincode}
                </p>
                <div className="flex flex-wrap gap-x-3 text-[11px] font-semibold text-slate-800 pt-1">
                  {pedhi?.contactDetails?.mobile && <span>Ph: {pedhi.contactDetails.mobile}</span>}
                  {pedhi?.contactDetails?.email && <span>Email: {pedhi.contactDetails.email}</span>}
                  {pedhi?.contactDetails?.gstNumber && (
                    <span className="font-mono">GSTIN: {pedhi.contactDetails.gstNumber}</span>
                  )}
                  {pedhi?.contactDetails?.panNumber && (
                    <span className="font-mono">PAN: {pedhi.contactDetails.panNumber}</span>
                  )}
                </div>
              </div>

              {/* Tax Invoice Badge */}
              <div className="text-right sm:text-right bg-slate-100 p-3 rounded-lg border border-slate-200 min-w-[190px]">
                <div className="font-black text-slate-800 text-base tracking-wider uppercase border-b border-slate-300 pb-1 mb-1.5">
                  TAX INVOICE
                </div>
                <div className="space-y-0.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Invoice No:</span>
                    <strong className="font-mono text-slate-900">{invoice.invoiceNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date:</span>
                    <strong>{new Date(invoice.date).toLocaleDateString('en-IN')}</strong>
                  </div>
                  {invoice.dueDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Due Date:</span>
                      <strong>{new Date(invoice.dueDate).toLocaleDateString('en-IN')}</strong>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mode:</span>
                    <strong>{invoice.paymentMode}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bill To & Dispatch Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Bill To (Buyer):</span>
              <h3 className="font-bold text-slate-900 text-sm mt-0.5">{invoice.customerName}</h3>
              {invoice.customerAddress && <p className="text-slate-600 mt-0.5">{invoice.customerAddress}</p>}
              <div className="mt-1 space-y-0.5 text-[11px]">
                {invoice.customerMobile && (
                  <p>
                    <span className="text-slate-500">Mobile:</span> {invoice.customerMobile}
                  </p>
                )}
                <p>
                  <span className="text-slate-500">GSTIN:</span>{' '}
                  <strong className="font-mono">{invoice.customerGst || 'URP / Consumer'}</strong>
                </p>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Supply & Place of Delivery:
              </span>
              <div className="mt-1 space-y-0.5 text-[11px]">
                <p>
                  <span className="text-slate-500">Place of Supply:</span>{' '}
                  <strong>{invoice.isInterstate ? 'Interstate (Out of State)' : 'Intrastate (Gujarat - 24)'}</strong>
                </p>
                {invoice.notes && (
                  <p>
                    <span className="text-slate-500">Notes / Transport:</span> {invoice.notes}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full border-collapse mb-4 text-[11px]">
            <thead>
              <tr className="bg-slate-800 text-white font-semibold">
                <th className="p-2 text-left w-8">#</th>
                <th className="p-2 text-left">Item Description</th>
                <th className="p-2 text-right w-16">Qty</th>
                <th className="p-2 text-right w-20">Rate (₹)</th>
                <th className="p-2 text-right w-20">Taxable (₹)</th>
                <th className="p-2 text-right w-16">GST</th>
                <th className="p-2 text-right w-24">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 border-b border-slate-300">
              {invoice.items.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="p-2 text-slate-500">{idx + 1}</td>
                  <td className="p-2">
                    <strong className="text-slate-900 block">{item.name}</strong>
                    {item.category && <span className="text-[10px] text-slate-500">{item.category}</span>}
                  </td>
                  <td className="p-2 text-right font-semibold">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="p-2 text-right font-mono">₹{item.rate.toLocaleString('en-IN')}</td>
                  <td className="p-2 text-right font-mono">₹{item.taxableAmount.toFixed(2)}</td>
                  <td className="p-2 text-right">
                    <span className="text-[10px] font-semibold bg-slate-200 px-1 py-0.5 rounded">
                      {item.gstRate}%
                    </span>
                  </td>
                  <td className="p-2 text-right font-bold font-mono">₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Bottom Totals and Bank Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Bank details and UPI QR info */}
            <div className="border border-slate-200 p-3 rounded-lg bg-slate-50 text-[11px] space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Bank Details for NEFT / RTGS:
              </span>
              <p>
                Bank: <strong>{pedhi?.bankDetails?.bankName || 'State Bank of India'}</strong>
              </p>
              <p>
                Account Holder: <strong>{pedhi?.bankDetails?.accountHolder || pedhi?.name}</strong>
              </p>
              <p>
                Account No:{' '}
                <strong className="font-mono text-slate-900">
                  {pedhi?.bankDetails?.accountNumber || '389012345678'}
                </strong>
              </p>
              <p>
                IFSC Code:{' '}
                <strong className="font-mono text-slate-900">{pedhi?.bankDetails?.ifscCode || 'SBIN0001234'}</strong>
              </p>
              {pedhi?.bankDetails?.upiId && (
                <p className="pt-1 border-t border-slate-200 text-amber-800 font-semibold">
                  UPI ID: <span className="font-mono">{pedhi.bankDetails.upiId}</span>
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1 text-slate-700 text-xs">
              <div className="flex justify-between py-0.5">
                <span>Taxable Amount:</span>
                <span className="font-mono font-medium">₹{invoice.subtotal.toFixed(2)}</span>
              </div>
              {!invoice.isInterstate ? (
                <>
                  <div className="flex justify-between py-0.5 text-slate-600">
                    <span>CGST Total:</span>
                    <span className="font-mono">₹{invoice.totalCgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-0.5 text-slate-600">
                    <span>SGST Total:</span>
                    <span className="font-mono">₹{invoice.totalSgst.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between py-0.5 text-slate-600">
                  <span>IGST Total:</span>
                  <span className="font-mono">₹{invoice.totalIgst.toFixed(2)}</span>
                </div>
              )}
              {invoice.roundOff !== 0 && (
                <div className="flex justify-between py-0.5 text-slate-500">
                  <span>Round Off:</span>
                  <span className="font-mono">{invoice.roundOff > 0 ? `+₹${invoice.roundOff}` : `-₹${Math.abs(invoice.roundOff)}`}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 text-sm font-black text-slate-950 border-t-2 border-slate-900">
                <span>Invoice Total:</span>
                <span className="font-mono text-base">₹{invoice.grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-0.5 text-emerald-700 font-semibold">
                <span>Amount Paid:</span>
                <span className="font-mono">₹{invoice.amountPaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 text-rose-700 font-bold border-t border-slate-300">
                <span>Balance Due:</span>
                <span className="font-mono">₹{invoice.balanceDue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Terms & Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-300 text-[10px]">
            <div>
              <span className="font-bold text-slate-700 block mb-1">Terms & Conditions:</span>
              <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                {pedhi?.settings?.termsAndConditions ||
                  '1. Goods once sold will not be taken back.\n2. Subject to local jurisdiction.'}
              </p>
            </div>
            <div className="text-right flex flex-col justify-end items-end pt-6 sm:pt-0">
              <span className="font-bold text-slate-800 uppercase block mb-8">For, {pedhi?.name || 'Girnar Shilp'}</span>
              <div className="border-t border-slate-400 w-44 text-center pt-1 text-slate-600">
                Authorized Signatory
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
