import React, { useState, useEffect } from 'react';
import { X, Share2, Printer, Plus, Phone, Calendar, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Customer, LedgerStatementEntry, Invoice } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface LedgerStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string | null;
  onOpenPayment: (customer: Customer, type: 'PAYMENT_IN' | 'PAYMENT_OUT') => void;
  onOpenInvoiceView: (invoice: Invoice) => void;
}

export const LedgerStatementModal: React.FC<LedgerStatementModalProps> = ({
  isOpen,
  onClose,
  customerId,
  onOpenPayment,
  onOpenInvoiceView,
}) => {
  const { currentPedhi } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [statement, setStatement] = useState<LedgerStatementEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    if (!customerId) return;
    setIsLoading(true);
    try {
      const res = await api.getCustomerDetails(customerId);
      setCustomer(res.customer);
      setStatement(res.statement || []);
    } catch (err) {
      console.error('Failed to load ledger statement:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && customerId) {
      loadData();
    }
  }, [isOpen, customerId]);

  if (!isOpen) return null;

  const handleShareWhatsApp = () => {
    if (!customer) return;
    const bal = customer.currentBalance;
    const isLena = bal > 0;

    let text = `*Khata Account Statement*\n` +
      `Pedhi: ${currentPedhi?.name}\n` +
      `Party: ${customer.name}\n` +
      `Date: ${new Date().toLocaleDateString('en-IN')}\n\n`;

    if (bal === 0) {
      text += `Your account with us is completely *Settled (Nil Balance)*.\n`;
    } else if (isLena) {
      text += `Current Outstanding Balance to pay us: *₹${bal.toLocaleString('en-IN')}*\n` +
        `Kindly arrange the payment at your earliest convenience.\n` +
        (currentPedhi?.bankDetails?.upiId ? `Pay via UPI: ${currentPedhi.bankDetails.upiId}\n` : '') +
        (currentPedhi?.bankDetails?.accountNumber ? `A/C: ${currentPedhi.bankDetails.accountNumber} (IFSC: ${currentPedhi.bankDetails.ifscCode})\n` : '');
    } else {
      text += `We have an outstanding credit in your favour of: *₹${Math.abs(bal).toLocaleString('en-IN')}*\n`;
    }

    text += `\nThank you for your valued business!\n-${currentPedhi?.name}`;

    const encoded = encodeURIComponent(text);
    const mobileClean = customer.mobile.replace(/[^0-9]/g, '');
    const url = mobileClean.length >= 10
      ? `https://wa.me/91${mobileClean.slice(-10)}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-10 print:hidden">
          <div className="flex items-center space-x-2">
            <div>
              <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                Khata Statement: {customer?.name || 'Party Ledger'}
              </h3>
              <p className="text-xs text-slate-400">{customer?.mobile} • {customer?.city || 'Gujarat'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp Reminder</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
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

        {/* Customer Balance Summary Bar */}
        {customer && (
          <div className="bg-slate-800/80 px-5 py-3 border-b border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Net Khata Balance:</span>
              <div className="flex items-center space-x-2 mt-0.5">
                <span
                  className={`text-lg font-black font-mono ${
                    customer.currentBalance > 0
                      ? 'text-emerald-400'
                      : customer.currentBalance < 0
                      ? 'text-rose-400'
                      : 'text-slate-200'
                  }`}
                >
                  ₹{Math.abs(customer.currentBalance).toLocaleString('en-IN')}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    customer.currentBalance > 0
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : customer.currentBalance < 0
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {customer.currentBalance > 0
                    ? "You'll Receive (Lena)"
                    : customer.currentBalance < 0
                    ? "You'll Pay (Dena)"
                    : 'Settled'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenPayment(customer, 'PAYMENT_IN');
                }}
                className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1 cursor-pointer"
              >
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>+ Jama (Received)</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenPayment(customer, 'PAYMENT_OUT');
                }}
                className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1 cursor-pointer"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+ Naame (Paid)</span>
              </button>
            </div>
          </div>
        )}

        {/* Ledger Entries List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400">Loading ledger statement...</div>
          ) : statement.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No transactions or bills yet for this party.</div>
          ) : (
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-800/90 text-slate-300 font-semibold border-b border-slate-700">
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Particulars / Ref</th>
                    <th className="p-2.5 text-right text-rose-400">Debit (Lena +)</th>
                    <th className="p-2.5 text-right text-emerald-400">Credit (Jama -)</th>
                    <th className="p-2.5 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {statement.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-2.5 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(entry.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="p-2.5">
                        <span className="font-semibold text-slate-200 block">{entry.description}</span>
                        {entry.notes && <span className="text-[10px] text-slate-400">{entry.notes}</span>}
                      </td>
                      <td className="p-2.5 text-right font-mono text-rose-300">
                        {entry.debit > 0 ? `₹${entry.debit.toLocaleString('en-IN')}` : '-'}
                      </td>
                      <td className="p-2.5 text-right font-mono text-emerald-300">
                        {entry.credit > 0 ? `₹${entry.credit.toLocaleString('en-IN')}` : '-'}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-200">
                        ₹{Math.abs(entry.runningBalance).toLocaleString('en-IN')}{' '}
                        <span className="text-[10px] text-slate-400">
                          {entry.runningBalance > 0 ? 'Dr' : entry.runningBalance < 0 ? 'Cr' : ''}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
