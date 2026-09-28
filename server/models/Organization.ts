import mongoose, { Schema, Document } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  code?: string;
  status: 'active' | 'suspended';
  createdAt: Date;
}

const organizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true, trim: true },
  code: { type: String, trim: true },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

export const Organization = mongoose.models.Organization || mongoose.model<IOrganization>('Organization', organizationSchema);
