import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  pedhiId: mongoose.Types.ObjectId;
  name: string;
  partyType: 'Customer' | 'Vendor' | 'Both';
  mobile: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstNumber?: string;
  panNumber?: string;
  openingBalance: number; // positive = debtor (Lena / You'll receive), negative = creditor (Dena / You'll pay)
  currentBalance: number;
  creditLimit?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>({
  pedhiId: { type: Schema.Types.ObjectId, ref: 'Pedhi', required: true, index: true },
  name: { type: String, required: true, trim: true },
  partyType: { type: String, enum: ['Customer', 'Vendor', 'Both'], default: 'Customer' },
  mobile: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: 'Gujarat' },
  pincode: { type: String, default: '' },
  gstNumber: { type: String, trim: true, uppercase: true, default: '' },
  panNumber: { type: String, trim: true, uppercase: true, default: '' },
  openingBalance: { type: Number, default: 0 },
  currentBalance: { type: Number, default: 0 },
  creditLimit: { type: Number, default: 0 },
  notes: { type: String, default: '' }
}, { timestamps: true });

customerSchema.index({ pedhiId: 1, mobile: 1 });
customerSchema.index({ pedhiId: 1, name: 1 });

export const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', customerSchema);
