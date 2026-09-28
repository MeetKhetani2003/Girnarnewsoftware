import { Router, Request, Response } from 'express';
import { Transaction } from '../models/Transaction.js';
import { Customer } from '../models/Customer.js';

const router = Router();

// List transactions (Rojmel / Daybook)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { pedhiId, type, paymentMode, date, startDate, endDate } = req.query;

    let query: any = {};
    if (pedhiId) {
      query.pedhiId = pedhiId;
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    if (paymentMode && paymentMode !== 'All') {
      query.paymentMode = paymentMode;
    }

    if (date) {
      const d = new Date(String(date));
      d.setHours(0, 0, 0, 0);
      const nextDay = new Date(d);
      nextDay.setDate(d.getDate() + 1);
      query.date = { $gte: d, $lt: nextDay };
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(String(startDate));
      if (endDate) {
        const end = new Date(String(endDate));
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const transactions = await Transaction.find(query).sort({ date: -1, createdAt: -1 });

    // Calculate totals
    let totalIn = 0;
    let totalOut = 0;

    transactions.forEach(t => {
      if (t.type === 'PAYMENT_IN') totalIn += t.amount;
      if (t.type === 'PAYMENT_OUT') totalOut += t.amount;
    });

    res.json({
      success: true,
      transactions,
      summary: {
        count: transactions.length,
        totalIn, // Jama
        totalOut, // Naame
        netBalance: totalIn - totalOut
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new Transaction (Jama / Naame entry)
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      pedhiId,
      date,
      type,
      amount,
      customerId,
      partyName,
      paymentMode,
      referenceNumber,
      category,
      notes
    } = req.body;

    const txAmount = Number(amount);
    if (!pedhiId || !type || isNaN(txAmount) || txAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Pedhi, valid positive amount, and type are required' });
    }

    let finalPartyName = partyName || 'Cash Counter';
    let customer = null;

    if (customerId) {
      customer = await Customer.findById(customerId);
      if (customer) {
        finalPartyName = customer.name;
        // Update customer balance:
        // PAYMENT_IN (Customer paid us) => reduces their debt (balance decreases)
        // PAYMENT_OUT (We paid vendor/customer) => reduces what we owe (balance increases towards 0)
        if (type === 'PAYMENT_IN') {
          customer.currentBalance = (customer.currentBalance || 0) - txAmount;
        } else {
          customer.currentBalance = (customer.currentBalance || 0) + txAmount;
        }
        await customer.save();
      }
    }

    const transaction = await Transaction.create({
      pedhiId,
      date: date ? new Date(date) : new Date(),
      type,
      amount: txAmount,
      customerId: customerId || undefined,
      partyName: finalPartyName,
      paymentMode: paymentMode || 'Cash',
      referenceNumber: referenceNumber || '',
      category: category || (type === 'PAYMENT_IN' ? 'Customer Payment' : 'Business Expense'),
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      transaction,
      customer,
      message: `${type === 'PAYMENT_IN' ? 'Jama (Receipt)' : 'Naame (Payment)'} of ₹${txAmount.toLocaleString('en-IN')} recorded`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete Transaction (and optionally reverse balance)
router.delete('/:id', async (req: any, res: Response) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Reverse party balance if attached
    if (tx.customerId) {
      const customer = await Customer.findById(tx.customerId);
      if (customer) {
        if (tx.type === 'PAYMENT_IN') {
          customer.currentBalance = (customer.currentBalance || 0) + tx.amount;
        } else {
          customer.currentBalance = (customer.currentBalance || 0) - tx.amount;
        }
        await customer.save();
      }
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Transaction deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
