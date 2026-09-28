import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserPedhi {
  pedhiId: mongoose.Types.ObjectId;
  role: 'Super Admin' | 'Pedhi Admin' | 'Manager' | 'Staff' | 'Sales User' | 'Inventory User';
}

export interface IUser extends Document {
  name: string;
  mobile: string;
  email?: string;
  password: string;
  organizationId: mongoose.Types.ObjectId;
  pedhis: IUserPedhi[];
  status: 'active' | 'inactive';
  comparePassword(candidate: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true, index: true },
  email: { type: String, trim: true, lowercase: true },
  password: { type: String, required: true },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  pedhis: [{
    pedhiId: { type: Schema.Types.ObjectId, ref: 'Pedhi' },
    role: {
      type: String,
      enum: ['Super Admin', 'Pedhi Admin', 'Manager', 'Staff', 'Sales User', 'Inventory User'],
      default: 'Pedhi Admin'
    }
  }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
