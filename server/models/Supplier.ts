import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
  pedhiId: mongoose.Types.ObjectId;
  name: string;
  category: 'Stone Quarry' | 'Sevan Timber' | 'Makrana Marble' | 'Karigar / Artisan' | 'Gold & Polish Materials' | 'General';
  mobile: string;
  email?: string;
  city: string;
  address?: string;
  gstNumber?: string;
  openingBalance: number;
  currentBalance: number; // Positive = We owe them (Dena); Negative = They owe us
  materialSupplied: string; // e.g. "Lakha Red Slabs 18mm", "Sevan Wood Logs Grade-A", "24K Gold Leaf", "Makrana Block"
  bankDetails?: {
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const supplierSchema = new Schema<ISupplier>({
  pedhiId: { type: Schema.Types.ObjectId, ref: 'Pedhi', required: true, index: true },
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: [
      'Stone Quarry',
      'Sevan Timber',
      'Makrana Marble',
      'Karigar / Artisan',
      'Gold & Polish Materials',
      'General'
    ],
    default: 'Stone Quarry'
  },
  mobile: { type: String, required: true, trim: true },
  email: { type: String, default: '' },
  city: { type: String, default: 'Rajkot' },
  address: { type: String, default: '' },
  gstNumber: { type: String, default: '' },
  openingBalance: { type: Number, default: 0 },
  currentBalance: { type: Number, default: 0 },
  materialSupplied: { type: String, default: '' },
  bankDetails: {
    bankName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    upiId: { type: String, default: '' }
  },
  notes: { type: String, default: '' }
}, { timestamps: true });

supplierSchema.index({ pedhiId: 1, name: 1 });

export const Supplier = mongoose.models.Supplier || mongoose.model<ISupplier>('Supplier', supplierSchema);
