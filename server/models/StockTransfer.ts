import mongoose, { Schema, Document } from 'mongoose';

export interface IStockTransfer extends Document {
  fromPedhiId: mongoose.Types.ObjectId;
  fromPedhiName: string;
  toPedhiId: mongoose.Types.ObjectId;
  toPedhiName: string;
  productId: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
  unit: string;
  productType: string;
  transferNumber: string;
  status: 'In Transit' | 'Received' | 'Cancelled';
  vehicleNumber?: string;
  transferDate: Date;
  receivedDate?: Date;
  notes?: string;
  createdAt: Date;
}

const stockTransferSchema = new Schema<IStockTransfer>({
  fromPedhiId: { type: Schema.Types.ObjectId, ref: 'Pedhi', required: true, index: true },
  fromPedhiName: { type: String, required: true },
  toPedhiId: { type: Schema.Types.ObjectId, ref: 'Pedhi', required: true, index: true },
  toPedhiName: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'Pcs' },
  productType: { type: String, default: 'general' },
  transferNumber: { type: String, required: true },
  status: { type: String, enum: ['In Transit', 'Received', 'Cancelled'], default: 'Received' },
  vehicleNumber: { type: String, default: '' },
  transferDate: { type: Date, default: Date.now },
  receivedDate: { type: Date, default: Date.now },
  notes: { type: String, default: '' }
}, { timestamps: true });

export const StockTransfer = mongoose.models.StockTransfer || mongoose.model<IStockTransfer>('StockTransfer', stockTransferSchema);
