import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  pedhiId: mongoose.Types.ObjectId;
  date: Date;
  type: 'PAYMENT_IN' | 'PAYMENT_OUT'; // PAYMENT_IN = Jama / Cash Received; PAYMENT_OUT = Naame / Cash Paid
  amount: number;
  customerId?: mongoose.Types.ObjectId;
  partyName: string;
  paymentMode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque';
  referenceNumber?: string;
  invoiceId?: mongoose.Types.ObjectId;
  category: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  pedhiId: { type: Schema.Types.ObjectId, ref: 'Pedhi', required: true, index: true },
  date: { type: Date, default: Date.now, index: true },
  type: { type: String, enum: ['PAYMENT_IN', 'PAYMENT_OUT'], required: true },
  amount: { type: Number, required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  partyName: { type: String, required: true },
  paymentMode: { type: String, enum: ['Cash', 'UPI', 'Bank Transfer', 'Cheque'], default: 'Cash' },
  referenceNumber: { type: String, default: '' },
  invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' },
  category: { type: String, default: 'Customer Payment' }, // e.g. Customer Payment, Supplier Payment, Rent, Labour, Transport, Miscellaneous
  notes: { type: String, default: '' }
}, { timestamps: true });

transactionSchema.index({ pedhiId: 1, date: -1 });

export const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema);
