export type ProductType = 'takti' | 'mandir' | 'murti' | 'general';

export interface TaktiSpecs {
  stoneType: string; // 'Lakha Red Stone', 'Black Jet Granite', 'Makrana White Marble', 'Ambaji Marble', 'Jhansi Red'
  lengthInches?: number;
  widthInches?: number;
  totalSqFt?: number;
  thickness?: string;
  workType?: string;
  engravingTextSample?: string;
}

export interface MandirSpecs {
  material: string; // 'Pure Sevan Wood', 'Makrana White Marble', 'Ambaji Marble', 'Teak Wood'
  widthInches?: number;
  depthInches?: number;
  heightInches?: number;
  dimensionDisplay?: string;
  shikharaType?: string;
  carvingLevel?: string;
  hasDrawers?: boolean;
  hasDiyaTray?: boolean;
  polishFinish?: string;
}

export interface MurtiSpecs {
  deity: string;
  heightInches: number; // e.g. 9, 12, 15, 18, 21, 24, 30, 36
  marbleGrade: string; // 'Makrana Super White (Grade A)', 'Ambaji Marble', 'Vietnam White Marble'
  posture?: string;
  shringarWork?: string; // '24K Gold Leaf Work (Vark)', 'Minakari Painting', 'Plain Polish'
  nayanType?: string;
}

export interface Product {
  _id: string;
  pedhiId: string;
  name: string;
  productType: ProductType;
  category: string;
  unit: string; // SqFt for takti, Pcs for Mandir & Murti
  taktiSpecs?: TaktiSpecs;
  mandirSpecs?: MandirSpecs;
  murtiSpecs?: MurtiSpecs;
  hsnCode: string;
  sellingPrice: number;
  purchasePrice: number;
  currentStock: number;
  minStockAlert: number;
  gstRate: number;
  sku?: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type OrderStatus =
  | 'Booked'
  | 'Material Assigned'
  | 'Carving & Carpentry'
  | 'Shringar & Polish'
  | 'Ready for Dispatch'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  _id: string;
  pedhiId: string;
  orderNumber: string;
  orderDate: string;
  deliveryDate: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  productType: 'takti' | 'mandir' | 'murti' | 'custom';
  title: string;
  specsSummary: string;
  customDetails: {
    stoneOrWoodType?: string;
    dimensionsText?: string;
    calculatedSqFt?: number;
    heightInches?: number;
    shikharaOrDome?: string;
    deityName?: string;
    goldWorkOrFinish?: string;
    engravingText?: string;
  };
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  costPerSqFt?: number;
  labourCostPerSqFt?: number;
  totalCost?: number;
  estimatedProfit?: number;
  profitMarginPercent?: number;
  supplierName?: string;
  status: OrderStatus;
  assignedKarigar?: string;
  invoiceId?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Supplier {
  _id: string;
  pedhiId: string;
  name: string;
  category: 'Stone Quarry' | 'Sevan Timber' | 'Makrana Marble' | 'Karigar / Artisan' | 'Gold & Polish Materials' | 'General';
  mobile: string;
  email?: string;
  city: string;
  address?: string;
  gstNumber?: string;
  openingBalance: number;
  currentBalance: number;
  materialSupplied: string;
  bankDetails?: {
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
  };
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockTransfer {
  _id: string;
  fromPedhiId: string;
  fromPedhiName: string;
  toPedhiId: string;
  toPedhiName: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  productType: string;
  transferNumber: string;
  status: 'In Transit' | 'Received' | 'Cancelled';
  vehicleNumber?: string;
  transferDate: string;
  receivedDate?: string;
  notes?: string;
  createdAt?: string;
}

export interface Pedhi {
  _id: string;
  organizationId: string;
  name: string;
  businessType: string;
  tagline?: string;
  contactDetails?: {
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
  settings?: {
    currency?: string;
    dateFormat?: string;
    invoicePrefix?: string;
    invoiceNextNumber?: number;
    stateCode?: string;
    termsAndConditions?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface UserRoleInPedhi {
  pedhiId: string;
  role: 'Super Admin' | 'Pedhi Admin' | 'Manager' | 'Staff' | 'Sales User' | 'Inventory User';
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  mobile: string;
  email?: string;
  organizationId: string;
  pedhis: UserRoleInPedhi[];
}

export interface Customer {
  _id: string;
  pedhiId: string;
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
  openingBalance: number;
  currentBalance: number;
  creditLimit?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  productId?: string;
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

export interface Invoice {
  _id: string;
  pedhiId: string;
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  customerId: string;
  customerName: string;
  customerMobile?: string;
  customerAddress?: string;
  customerGst?: string;
  isInterstate: boolean;
  items: InvoiceItem[];
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
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  _id: string;
  pedhiId: string;
  date: string;
  type: 'PAYMENT_IN' | 'PAYMENT_OUT';
  amount: number;
  customerId?: string;
  partyName: string;
  paymentMode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque';
  referenceNumber?: string;
  invoiceId?: string;
  category: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  todaySales: number;
  todayCollected: number;
  monthSales: number;
  totalReceivables: number;
  totalPayables: number;
  totalCustomers: number;
  lowStockCount: number;
}

export interface LedgerStatementEntry {
  id?: string;
  date: string;
  type: string;
  description: string;
  debit: number;
  credit: number;
  runningBalance: number;
  reference?: string;
  status?: string;
  notes?: string;
}
