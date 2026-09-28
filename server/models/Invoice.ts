import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceItem {
  productId?: mongoose.Types.ObjectId;
  name: string;
  category?: string;
  unit: string;
  quantity: number;
  rate: number;
  discountPercent?: number;
  taxableAmount: number;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  total: number;
}

export interface IInvoice extends Document {
  pedhiId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  date: Date;
  dueDate?: Date;
  customerId: mongoose.Types.ObjectId;
  customerName: string;
  customerMobile?: string;
  customerAddress?: string;
  customerGst?: string;
  isInterstate: boolean;
  items: IInvoiceItem[];
  subtotal: number;
  discountTotal: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  roundOff: number;
  grandTotal: number;
  paymentMode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Credit';
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial';
  amountPaid: number;
  balanceDue: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceItemSchema = new Schema<IInvoiceItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  unit: { type: String, default: 'Pcs' },
  quantity: { type: Number, required: true, default: 1 },
  rate: { type: Number, required: true, default: 0 },
  discountPercent: { type: Number, default: 0 },
  taxableAmount: { type: Number, default: 0 },
  gstRate: { type: Number, default: 18 },
  cgstAmount: { type: Number, default: 0 },
  sgstAmount: { type: Number, default: 0 },
  igstAmount: { type: Number, default: 0 },
  total: { type: Number, required: true, default: 0 }
}, { _id: false });

const invoiceSchema = new Schema<IInvoice>({
  pedhiId: { type: Schema.Types.ObjectId, ref: 'Pedhi', required: true, index: true },
  invoiceNumber: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now, index: true },
  dueDate: { type: Date },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
  customerName: { type: String, required: true },
  customerMobile: { type: String, default: '' },
  customerAddress: { type: String, default: '' },
  customerGst: { type: String, default: '' },
  isInterstate: { type: Boolean, default: false },
  items: [invoiceItemSchema],
  subtotal: { type: Number, required: true, default: 0 },
  discountTotal: { type: Number, default: 0 },
  totalCgst: { type: Number, default: 0 },
  totalSgst: { type: Number, default: 0 },
  totalIgst: { type: Number, default: 0 },
  roundOff: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true, default: 0 },
  paymentMode: {
    type: String,
    enum: ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Credit'],
    default: 'Credit'
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Partial'],
    default: 'Unpaid'
  },
  amountPaid: { type: Number, default: 0 },
  balanceDue: { type: Number, default: 0 },
  notes: { type: String, default: '' }
}, { timestamps: true });

invoiceSchema.index({ pedhiId: 1, invoiceNumber: 1 });

export const Invoice = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', invoiceSchema);
