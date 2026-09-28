import mongoose, { Schema, Document } from 'mongoose';

export interface IPedhi extends Document {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  businessType: string;
  tagline?: string;
  contactDetails: {
    mobile?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    gstNumber?: string;
    panNumber?: string;
  };
  bankDetails?: {
    bankName?: string;
    accountHolder?: string;
    accountNumber?: string;
    ifscCode?: string;
    branch?: string;
    upiId?: string;
  };
  settings: {
    currency: string;
    dateFormat: string;
    invoicePrefix: string;
    invoiceNextNumber: number;
    stateCode: string;
    termsAndConditions?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const pedhiSchema = new Schema<IPedhi>({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  name: { type: String, required: true, trim: true },
  businessType: { type: String, required: true, default: 'Wholesale & Retail' },
  tagline: { type: String, trim: true },
  contactDetails: {
    mobile: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: 'Rajkot' },
    state: { type: String, default: 'Gujarat' },
    pincode: { type: String, default: '360001' },
    gstNumber: { type: String, default: '' },
    panNumber: { type: String, default: '' }
  },
  bankDetails: {
    bankName: { type: String, default: 'State Bank of India' },
    accountHolder: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    branch: { type: String, default: '' },
    upiId: { type: String, default: '' }
  },
  settings: {
    currency: { type: String, default: 'INR' },
    dateFormat: { type: String, default: 'DD/MM/YYYY' },
    invoicePrefix: { type: String, default: 'GS/' },
    invoiceNextNumber: { type: Number, default: 101 },
    stateCode: { type: String, default: '24' }, // 24 = Gujarat
    termsAndConditions: { type: String, default: '1. Goods once sold will not be taken back without prior notice.\n2. Subject to Rajkot jurisdiction.' }
  }
}, { timestamps: true });

export const Pedhi = mongoose.models.Pedhi || mongoose.model<IPedhi>('Pedhi', pedhiSchema);
