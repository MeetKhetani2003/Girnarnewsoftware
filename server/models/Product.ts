import mongoose, { Schema, Document } from 'mongoose';

export type ProductType = 'takti' | 'mandir' | 'murti' | 'general';

export interface IProduct extends Document {
  pedhiId: mongoose.Types.ObjectId;
  name: string;
  productType: ProductType; // 'takti' | 'mandir' | 'murti' | 'general'
  category: string;
  unit: string; // SqFt for takti, Pcs for Mandir & Murti
  
  // 1. Takti specific specs (Granite / Marble / Lakha Red Stone)
  taktiSpecs?: {
    stoneType: string; // 'Lakha Red Stone', 'Black Jet Granite', 'Makrana White Marble', 'Ambaji Marble', 'Jhansi Red'
    lengthInches?: number;
    widthInches?: number;
    totalSqFt?: number;
    thickness?: string; // '15mm', '18mm', '25mm', '30mm', '2 Inch'
    workType?: string; // 'Deep CNC Engraving', 'Gold Leaf Inscription', 'Photo Etching', 'Chamfered Border'
    engravingTextSample?: string;
  };

  // 2. Mandir specific specs (Marble Mandir & Sevan Wooden Mandir)
  mandirSpecs?: {
    material: string; // 'Pure Sevan Wood', 'Makrana White Marble', 'Ambaji Marble', 'Teak Wood'
    widthInches?: number;
    depthInches?: number;
    heightInches?: number;
    dimensionDisplay?: string; // e.g. "36W x 21D x 60H inches"
    shikharaType?: string; // '3 Shikhara', 'Single Gopuram', 'Step Dome', 'Flat Top'
    carvingLevel?: string; // 'Heavy Hand Carved', 'Medium Carving', 'Modern Minimalist'
    hasDrawers?: boolean;
    hasDiyaTray?: boolean;
    polishFinish?: string; // 'Natural Sevan Polish', 'High Gloss PU', 'Matte Teak', 'Pure White Buff'
  };

  // 3. Bhagwan Murti specific specs (Marble Murtis)
  murtiSpecs?: {
    deity: string; // 'Radha Krishna', 'Ganeshji', 'Shiv Parivar', 'Ram Darbar', 'Hanumanji', 'Jain Tirthankara', 'Maa Ambaji', 'Lakshmi Narayan'
    heightInches: number; // e.g. 9, 12, 15, 18, 21, 24, 30, 36, 48
    marbleGrade: string; // 'Makrana Super White (Grade A)', 'Ambaji Marble', 'Vietnam White Marble', 'Black Marble'
    posture?: string; // 'Standing', 'Padmasana', 'Simhasana', 'Chowki'
    shringarWork?: string; // '24K Gold Leaf Work (Vark)', 'Multicolor Minakari Painting', 'Natural Plain Polish', 'Antique Gold Accent'
    nayanType?: string; // 'Amrut Nayan Hand Carved', 'Glass Eyes', 'Painted Nayan'
  };

  hsnCode: string;
  sellingPrice: number; // For takti: rate per SqFt; for Mandir/Murti: rate per piece
  purchasePrice: number;
  currentStock: number;
  minStockAlert: number;
  gstRate: number;
  sku?: string;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  pedhiId: { type: Schema.Types.ObjectId, ref: 'Pedhi', required: true, index: true },
  name: { type: String, required: true, trim: true },
  productType: {
    type: String,
    enum: ['takti', 'mandir', 'murti', 'general'],
    default: 'general',
    index: true
  },
  category: { type: String, default: 'General' },
  unit: { type: String, default: 'Pcs' },

  taktiSpecs: {
    stoneType: { type: String, default: 'Lakha Red Stone' },
    lengthInches: { type: Number, default: 0 },
    widthInches: { type: Number, default: 0 },
    totalSqFt: { type: Number, default: 0 },
    thickness: { type: String, default: '18mm' },
    workType: { type: String, default: 'Deep Engraving & Gold Filling' },
    engravingTextSample: { type: String, default: '' }
  },

  mandirSpecs: {
    material: { type: String, default: 'Pure Sevan Wood' },
    widthInches: { type: Number, default: 0 },
    depthInches: { type: Number, default: 0 },
    heightInches: { type: Number, default: 0 },
    dimensionDisplay: { type: String, default: '' },
    shikharaType: { type: String, default: '3 Shikhara' },
    carvingLevel: { type: String, default: 'Heavy Hand Carved' },
    hasDrawers: { type: Boolean, default: true },
    hasDiyaTray: { type: Boolean, default: true },
    polishFinish: { type: String, default: 'Natural Sevan Polish' }
  },

  murtiSpecs: {
    deity: { type: String, default: 'Radha Krishna' },
    heightInches: { type: Number, default: 18 },
    marbleGrade: { type: String, default: 'Makrana Super White (Grade A)' },
    posture: { type: String, default: 'Standing' },
    shringarWork: { type: String, default: '24K Gold Leaf Work (Vark)' },
    nayanType: { type: String, default: 'Amrut Nayan Hand Carved' }
  },

  hsnCode: { type: String, default: '6802' },
  sellingPrice: { type: Number, required: true, default: 0 },
  purchasePrice: { type: Number, default: 0 },
  currentStock: { type: Number, default: 0 },
  minStockAlert: { type: Number, default: 3 },
  gstRate: { type: Number, default: 12 },
  sku: { type: String, trim: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' }
}, { timestamps: true });

productSchema.index({ pedhiId: 1, productType: 1 });
productSchema.index({ pedhiId: 1, name: 1 });

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
