import express from 'express';
import cors from 'cors';
import { connectDB, getDatabaseStatus } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import pedhiRoutes from './routes/pedhiRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import productRoutes from './routes/productRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import stockTransferRoutes from './routes/stockTransferRoutes.js';
import seedRoutes, { runInitialSeedIfNeeded } from './routes/seedRoutes.js';

export const apiApp = express();

apiApp.use(cors());
apiApp.use(express.json());
apiApp.use(express.urlencoded({ extended: true }));

// Health Check
apiApp.get('/health', (req, res) => {
  res.status(200).json({
    status: 'active',
    message: 'Girnar Shilp Multi-Pedhi API server is running',
    database: getDatabaseStatus()
  });
});

// Mount Routes
apiApp.use('/auth', authRoutes);
apiApp.use('/pedhis', pedhiRoutes);
apiApp.use('/customers', customerRoutes);
apiApp.use('/products', productRoutes);
apiApp.use('/invoices', invoiceRoutes);
apiApp.use('/transactions', transactionRoutes);
apiApp.use('/orders', orderRoutes);
apiApp.use('/suppliers', supplierRoutes);
apiApp.use('/transfers', stockTransferRoutes);
apiApp.use('/dashboard', dashboardRoutes);
apiApp.use('/seed', seedRoutes);

// Connect DB & run initial seed check
connectDB().then(async (connected) => {
  if (connected) {
    await runInitialSeedIfNeeded();
  }
}).catch((err) => {
  console.error('[Database Init Error]:', err);
});

// Error handling middleware
apiApp.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[API Error]:', err);
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default apiApp;
