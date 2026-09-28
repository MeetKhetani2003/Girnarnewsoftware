import {
  Pedhi,
  User,
  Customer,
  Product,
  Invoice,
  Transaction,
  Order,
  Supplier,
  StockTransfer,
  DashboardStats,
  LedgerStatementEntry,
} from '../types/index.ts';

const TOKEN_KEY = 'girnar_auth_token';
const ACTIVE_PEDHI_KEY = 'girnar_active_pedhi_id';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getStoredActivePedhiId(): string | null {
  return localStorage.getItem(ACTIVE_PEDHI_KEY);
}

export function setStoredActivePedhiId(pedhiId: string) {
  localStorage.setItem(ACTIVE_PEDHI_KEY, pedhiId);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  // Auth
  async login(mobile: string, password: string) {
    const res = await request<{
      success: boolean;
      token: string;
      user: User;
      pedhis: Pedhi[];
      currentPedhi: Pedhi;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ mobile, password }),
    });
    setStoredToken(res.token);
    if (res.currentPedhi?._id) {
      setStoredActivePedhiId(res.currentPedhi._id);
    }
    return res;
  },

  async demoLogin() {
    const res = await request<{
      success: boolean;
      token: string;
      user: User;
      pedhis: Pedhi[];
      currentPedhi: Pedhi;
    }>('/auth/demo-login', {
      method: 'POST',
    });
    setStoredToken(res.token);
    if (res.currentPedhi?._id) {
      setStoredActivePedhiId(res.currentPedhi._id);
    }
    return res;
  },

  async register(payload: {
    name: string;
    mobile: string;
    email?: string;
    password: string;
    orgName?: string;
    pedhiName?: string;
    businessType?: string;
  }) {
    const res = await request<{
      success: boolean;
      token: string;
      user: User;
      currentPedhi: Pedhi;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setStoredToken(res.token);
    if (res.currentPedhi?._id) {
      setStoredActivePedhiId(res.currentPedhi._id);
    }
    return res;
  },

  async getMe() {
    return request<{ success: boolean; user: User; pedhis: Pedhi[] }>('/auth/me');
  },

  // Pedhis
  async getPedhis() {
    return request<{ success: boolean; pedhis: Pedhi[] }>('/pedhis');
  },

  async getPedhi(id: string) {
    return request<{ success: boolean; pedhi: Pedhi }>(`/pedhis/${id}`);
  },

  async createPedhi(payload: Partial<Pedhi>) {
    return request<{ success: boolean; pedhi: Pedhi }>('/pedhis', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updatePedhi(id: string, payload: Partial<Pedhi>) {
    return request<{ success: boolean; pedhi: Pedhi }>(`/pedhis/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // Customers
  async getCustomers(pedhiId: string, params?: { search?: string; filter?: string }) {
    const q = new URLSearchParams({ pedhiId });
    if (params?.search) q.append('search', params.search);
    if (params?.filter) q.append('filter', params.filter);
    return request<{ success: boolean; customers: Customer[] }>(`/customers?${q.toString()}`);
  },

  async getCustomerDetails(id: string) {
    return request<{
      success: boolean;
      customer: Customer;
      statement: LedgerStatementEntry[];
      invoices: Invoice[];
      transactions: Transaction[];
    }>(`/customers/${id}`);
  },

  async createCustomer(payload: Partial<Customer>) {
    return request<{ success: boolean; customer: Customer }>('/customers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateCustomer(id: string, payload: Partial<Customer>) {
    return request<{ success: boolean; customer: Customer }>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteCustomer(id: string) {
    return request<{ success: boolean; message: string }>(`/customers/${id}`, {
      method: 'DELETE',
    });
  },

  // Products
  async getProducts(pedhiId: string, params?: { category?: string; search?: string; lowStockOnly?: boolean }) {
    const q = new URLSearchParams({ pedhiId });
    if (params?.category) q.append('category', params.category);
    if (params?.search) q.append('search', params.search);
    if (params?.lowStockOnly) q.append('lowStockOnly', 'true');
    return request<{ success: boolean; products: Product[]; categories: string[] }>(`/products?${q.toString()}`);
  },

  async createProduct(payload: Partial<Product>) {
    return request<{ success: boolean; product: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateProduct(id: string, payload: Partial<Product>) {
    return request<{ success: boolean; product: Product }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async adjustStock(id: string, adjustment: number, reason?: string) {
    return request<{ success: boolean; product: Product; message: string }>(`/products/${id}/adjust-stock`, {
      method: 'POST',
      body: JSON.stringify({ adjustment, reason }),
    });
  },

  async deleteProduct(id: string) {
    return request<{ success: boolean; message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Invoices
  async getInvoices(pedhiId: string, params?: { status?: string; search?: string; startDate?: string; endDate?: string }) {
    const q = new URLSearchParams({ pedhiId });
    if (params?.status) q.append('status', params.status);
    if (params?.search) q.append('search', params.search);
    if (params?.startDate) q.append('startDate', params.startDate);
    if (params?.endDate) q.append('endDate', params.endDate);
    return request<{
      success: boolean;
      invoices: Invoice[];
      summary: { count: number; totalAmount: number; totalDue: number };
    }>(`/invoices?${q.toString()}`);
  },

  async getNextInvoiceNumber(pedhiId: string) {
    return request<{ success: boolean; prefix: string; nextSeq: number; invoiceNumber: string }>(
      `/invoices/next-number/${pedhiId}`
    );
  },

  async getInvoice(id: string) {
    return request<{ success: boolean; invoice: Invoice; pedhi: Pedhi; customer: Customer }>(`/invoices/${id}`);
  },

  async createInvoice(payload: any) {
    return request<{ success: boolean; invoice: Invoice; message: string }>('/invoices', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async recordInvoicePayment(id: string, payload: { amount: number; paymentMode: string; referenceNumber?: string; notes?: string }) {
    return request<{ success: boolean; invoice: Invoice; message: string }>(`/invoices/${id}/record-payment`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Transactions (Rojmel)
  async getTransactions(pedhiId: string, params?: { type?: string; paymentMode?: string; date?: string; startDate?: string; endDate?: string }) {
    const q = new URLSearchParams({ pedhiId });
    if (params?.type) q.append('type', params.type);
    if (params?.paymentMode) q.append('paymentMode', params.paymentMode);
    if (params?.date) q.append('date', params.date);
    if (params?.startDate) q.append('startDate', params.startDate);
    if (params?.endDate) q.append('endDate', params.endDate);
    return request<{
      success: boolean;
      transactions: Transaction[];
      summary: { count: number; totalIn: number; totalOut: number; netBalance: number };
    }>(`/transactions?${q.toString()}`);
  },

  async createTransaction(payload: Partial<Transaction>) {
    return request<{ success: boolean; transaction: Transaction; message: string }>('/transactions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async deleteTransaction(id: string) {
    return request<{ success: boolean; message: string }>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },

  // Orders Management (Custom Mandir, Murti & Takti Bookings)
  async getOrders(pedhiId: string, params?: { status?: string; productType?: string; search?: string }) {
    const q = new URLSearchParams({ pedhiId });
    if (params?.status) q.append('status', params.status);
    if (params?.productType) q.append('productType', params.productType);
    if (params?.search) q.append('search', params.search);
    return request<{
      success: boolean;
      orders: Order[];
      summary: { totalOrdersCount: number; totalOrderValue: number; totalPendingAdvance: number };
    }>(`/orders?${q.toString()}`);
  },

  async getNextOrderNumber(pedhiId: string) {
    return request<{ success: boolean; orderNumber: string }>(`/orders/next-number/${pedhiId}`);
  },

  async createOrder(payload: any) {
    return request<{ success: boolean; order: Order; message: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateOrderStatus(id: string, status: string, assignedKarigar?: string, notes?: string) {
    return request<{ success: boolean; order: Order; message: string }>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, assignedKarigar, notes }),
    });
  },

  async convertOrderToInvoice(id: string) {
    return request<{ success: boolean; invoice: Invoice; order: Order; message: string }>(
      `/orders/${id}/convert-to-invoice`,
      { method: 'POST' }
    );
  },

  // Suppliers & Karigars
  async getSuppliers(pedhiId: string, params?: { category?: string; search?: string }) {
    const q = new URLSearchParams({ pedhiId });
    if (params?.category) q.append('category', params.category);
    if (params?.search) q.append('search', params.search);
    return request<{
      success: boolean;
      suppliers: Supplier[];
      summary: { count: number; totalPayables: number };
    }>(`/suppliers?${q.toString()}`);
  },

  async createSupplier(payload: Partial<Supplier>) {
    return request<{ success: boolean; supplier: Supplier }>('/suppliers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async recordSupplierPayment(id: string, payload: { amount: number; paymentMode?: string; referenceNumber?: string; notes?: string }) {
    return request<{ success: boolean; supplier: Supplier; message: string }>(`/suppliers/${id}/pay`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async recordSupplierPurchase(id: string, payload: { amount: number; description?: string; invoiceNumber?: string }) {
    return request<{ success: boolean; supplier: Supplier; message: string }>(`/suppliers/${id}/purchase`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Stock Transfers between Pedhis
  async getStockTransfers(pedhiId?: string) {
    const q = pedhiId ? `?pedhiId=${pedhiId}` : '';
    return request<{ success: boolean; transfers: StockTransfer[] }>(`/transfers${q}`);
  },

  async createStockTransfer(payload: {
    fromPedhiId: string;
    toPedhiId: string;
    productId: string;
    quantity: number;
    vehicleNumber?: string;
    notes?: string;
  }) {
    return request<{ success: boolean; transfer: StockTransfer; message: string }>('/transfers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Dashboard
  async getDashboardStats(pedhiId: string) {
    return request<{
      success: boolean;
      currentPedhi: Pedhi;
      stats: DashboardStats;
      lowStockItems: Product[];
      recentInvoices: Invoice[];
      recentTransactions: Transaction[];
      dbStatus: { state: string; isConnected: boolean; host: string };
    }>(`/dashboard/stats?pedhiId=${pedhiId}`);
  },

  // Reset & Seed
  async resetAndSeed() {
    return request<{ success: boolean; message: string }>('/seed/reset-and-seed', {
      method: 'POST',
    });
  },
};
