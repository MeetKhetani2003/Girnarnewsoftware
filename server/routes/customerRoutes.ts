import { Router, Request, Response } from 'express';
import { Customer } from '../models/Customer.js';
import { Invoice } from '../models/Invoice.js';
import { Transaction } from '../models/Transaction.js';

const router = Router();

// List customers/vendors for a Pedhi
router.get('/', async (req: Request, res: Response) => {
  try {
    const { pedhiId, search, filter } = req.query;

    let query: any = {};
    if (pedhiId) {
      query.pedhiId = pedhiId;
    }

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      query.$or = [
        { name: searchRegex },
        { mobile: searchRegex },
        { city: searchRegex },
        { gstNumber: searchRegex }
      ];
    }

    if (filter === 'to_receive') {
      query.currentBalance = { $gt: 0 };
    } else if (filter === 'to_pay') {
      query.currentBalance = { $lt: 0 };
    } else if (filter === 'settled') {
      query.currentBalance = 0;
    }

    const customers = await Customer.find(query).sort({ updatedAt: -1, name: 1 });
    res.json({ success: true, customers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single customer and their full ledger statement
router.get('/:id', async (req: any, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Party not found' });
    }

    // Fetch related invoices and transactions
    const [invoices, transactions] = await Promise.all([
      Invoice.find({ customerId: customer._id }).sort({ date: 1 }),
      Transaction.find({ customerId: customer._id }).sort({ date: 1 })
    ]);

    // Build chronological ledger statement
    const ledgerEntries: any[] = [];

    // Opening balance entry if non-zero
    if (customer.openingBalance !== 0) {
      ledgerEntries.push({
        date: customer.createdAt,
        type: 'OPENING_BALANCE',
        description: 'Opening Balance',
        debit: customer.openingBalance > 0 ? customer.openingBalance : 0, // Debit = Party owes us (Lena)
        credit: customer.openingBalance < 0 ? Math.abs(customer.openingBalance) : 0, // Credit = We owe party (Dena)
        reference: 'Initial',
      });
    }

    invoices.forEach(inv => {
      ledgerEntries.push({
        id: inv._id,
        date: inv.date,
        type: 'INVOICE',
        description: `Sale Bill #${inv.invoiceNumber}`,
        debit: inv.grandTotal, // Sale increases receivable
        credit: 0,
        reference: inv.invoiceNumber,
        status: inv.paymentStatus,
        raw: inv
      });
    });

    transactions.forEach(tx => {
      const isPaymentIn = tx.type === 'PAYMENT_IN'; // Jama from customer
      ledgerEntries.push({
        id: tx._id,
        date: tx.date,
        type: tx.type,
        description: isPaymentIn ? `Payment Received (${tx.paymentMode})` : `Payment Made (${tx.paymentMode})`,
        debit: isPaymentIn ? 0 : tx.amount, // Payment Out increases debit if customer
        credit: isPaymentIn ? tx.amount : 0, // Payment In reduces receivable
        reference: tx.referenceNumber || 'Cash/UPI',
        category: tx.category,
        notes: tx.notes
      });
    });

    // Sort by date ascending
    ledgerEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate running balance
    let running = 0;
    const computedEntries = ledgerEntries.map(entry => {
      running = running + (entry.debit || 0) - (entry.credit || 0);
      return {
        ...entry,
        runningBalance: running
      };
    });

    res.json({
      success: true,
      customer,
      statement: computedEntries,
      invoices,
      transactions
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create Customer / Vendor
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      pedhiId,
      name,
      partyType,
      mobile,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      gstNumber,
      panNumber,
      openingBalance,
      creditLimit,
      notes
    } = req.body;

    if (!pedhiId || !name || !mobile) {
      return res.status(400).json({ success: false, message: 'Pedhi, party name, and mobile are required' });
    }

    const opBal = Number(openingBalance) || 0;

    const customer = await Customer.create({
      pedhiId,
      name,
      partyType: partyType || 'Customer',
      mobile,
      phone,
      email,
      address,
      city: city || 'Rajkot',
      state: state || 'Gujarat',
      pincode,
      gstNumber: gstNumber ? gstNumber.toUpperCase() : '',
      panNumber: panNumber ? panNumber.toUpperCase() : '',
      openingBalance: opBal,
      currentBalance: opBal,
      creditLimit: Number(creditLimit) || 0,
      notes
    });

    res.status(201).json({ success: true, customer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Customer
router.put('/:id', async (req: any, res: Response) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Party not found' });
    }
    res.json({ success: true, customer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete Customer
router.delete('/:id', async (req: any, res: Response) => {
  try {
    const invoiceCount = await Invoice.countDocuments({ customerId: req.params.id });
    if (invoiceCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete party with existing invoices. Settle bills or archive instead.'
      });
    }
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Party deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
