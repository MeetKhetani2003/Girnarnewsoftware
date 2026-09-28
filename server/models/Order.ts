import mongoose, { Schema, Document } from 'mongoose';

export type OrderStatus =
  | 'Booked'
  | 'Material Assigned'
  | 'Carving & Carpentry'
  | 'Shringar & Polish'
  | 'Ready for Dispatch'
  | 'Delivered'
  | 'Cancelled';

export interface IOrder extends Document {
  pedhiId: mongoose.Types.ObjectId;
  orderNumber: string;
  orderId?: string;
  orderDate: Date;
  deliveryDate: Date;
  customerId: mongoose.Types.ObjectId;
  customerName: string;
  customerMobile: string;
  productType: 'takti' | 'mandir' | 'murti' | 'custom';
  title: string;
  specsSummary: string; // e.g. "48x24 Lakha Red Granite Takti" or "60x36x72 Sevan Wooden Mandir" or "24 Inch Makrana Radha Krishna"
  
  // Custom specification details
  customDetails: {
    stoneOrWoodType?: string;
    dimensionsText?: string;
    calculatedSqFt?: number;
    heightInches?: number;
    shikharaOrDome?: string;
    deityName?: string;
    goldWorkOrFinish?: string;
    engravingText?: string; // Donor / Inscription text for takti
  };

  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  // Factory costing & profit fields
  costPerSqFt?: number;
  labourCostPerSqFt?: number;
  totalCost?: number;
  estimatedProfit?: number;
  profitMarginPercent?: number;
  supplierName?: string;
  status: OrderStatus;
  assignedKarigar?: string;
  invoiceId?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  pedhiId: { type: Schema.Types.ObjectId, ref: 'Pedhi', required: true, index: true },
  orderNumber: { type: String, required: true },
  orderId: { type: String, default: function(this: any) { return this.orderNumber; } },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date, required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
  customerName: { type: String, required: true },
  customerMobile: { type: String, required: true },
  productType: {
    type: String,
    enum: ['takti', 'mandir', 'murti', 'custom'],
    default: 'mandir',
    index: true
  },
  title: { type: String, required: true },
  specsSummary: { type: String, default: '' },
  customDetails: {
    stoneOrWoodType: { type: String, default: '' },
    dimensionsText: { type: String, default: '' },
    calculatedSqFt: { type: Number, default: 0 },
    heightInches: { type: Number, default: 0 },
    shikharaOrDome: { type: String, default: '' },
    deityName: { type: String, default: '' },
    goldWorkOrFinish: { type: String, default: '' },
    engravingText: { type: String, default: '' }
  },
  totalAmount: { type: Number, required: true, default: 0 },
  advancePaid: { type: Number, default: 0 },
  balanceDue: { type: Number, default: 0 },
  costPerSqFt: { type: Number, default: 0 },
  labourCostPerSqFt: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
  estimatedProfit: { type: Number, default: 0 },
  profitMarginPercent: { type: Number, default: 0 },
  supplierName: { type: String, default: '' },
  status: {
    type: String,
    enum: [
      'Booked',
      'Material Assigned',
      'Carving & Carpentry',
      'Shringar & Polish',
      'Ready for Dispatch',
      'Delivered',
      'Cancelled'
    ],
    default: 'Booked',
    index: true
  },
  assignedKarigar: { type: String, default: '' },
  invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' },
  notes: { type: String, default: '' }
}, { timestamps: true });

orderSchema.index({ pedhiId: 1, orderNumber: 1 });

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
