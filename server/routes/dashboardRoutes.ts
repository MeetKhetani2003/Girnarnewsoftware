import { Router, Request, Response } from 'express';
import { Pedhi } from '../models/Pedhi.js';
import { Customer } from '../models/Customer.js';
import { Product } from '../models/Product.js';
import { Invoice } from '../models/Invoice.js';
import { Transaction } from '../models/Transaction.js';
import { getDatabaseStatus } from '../config/database.js';

const router = Router();

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { pedhiId } = req.query;
    const query = pedhiId ? { pedhiId } : {};

    // Date bounds for today and this month
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);

    const [
      pedhi,
      todayInvoices,
      monthInvoices,
      allCustomers,
      lowStockProducts,
      recentInvoices,
      recentTransactions
    ] = await Promise.all([
      pedhiId ? Pedhi.findById(pedhiId) : Pedhi.findOne({}),
      Invoice.find({ ...query, date: { $gte: startOfToday } }),
      Invoice.find({ ...query, date: { $gte: startOfMonth } }),
      Customer.find(query),
      Product.find({ ...query, $expr: { $lte: ['$currentStock', '$minStockAlert'] } }).limit(5),
      Invoice.find(query).sort({ date: -1 }).limit(5),
      Transaction.find(query).sort({ date: -1 }).limit(5)
    ]);

    // Calculate metrics
    const todaySales = todayInvoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0);
    const todayCollected = todayInvoices.reduce((sum, i) => sum + (i.amountPaid || 0), 0);

    const monthSales = monthInvoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0);

    let totalReceivables = 0; // Lena (Party owes us)
    let totalPayables = 0; // Dena (We owe party)

    allCustomers.forEach(c => {
      const bal = c.currentBalance || 0;
      if (bal > 0) totalReceivables += bal;
      else if (bal < 0) totalPayables += Math.abs(bal);
    });

    const dbStatus = getDatabaseStatus();

    res.json({
      success: true,
      currentPedhi: pedhi,
      stats: {
        todaySales,
        todayCollected,
        monthSales,
        totalReceivables,
        totalPayables,
        totalCustomers: allCustomers.length,
        lowStockCount: lowStockProducts.length
      },
      lowStockItems: lowStockProducts,
      recentInvoices,
      recentTransactions,
      dbStatus
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
