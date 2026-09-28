import { Router, Request, Response } from 'express';
import { Supplier } from '../models/Supplier.js';
import { Transaction } from '../models/Transaction.js';

const router = Router();

// List Suppliers
router.get('/', async (req: Request, res: Response) => {
  try {
    const { pedhiId, category, search } = req.query;

    let query: any = {};
    if (pedhiId) query.pedhiId = pedhiId;
    if (category && category !== 'All') query.category = category;

    if (search) {
      const regex = new RegExp(String(search), 'i');
      query.$or = [
        { name: regex },
        { mobile: regex },
        { city: regex },
        { materialSupplied: regex }
      ];
    }

    const suppliers = await Supplier.find(query).sort({ updatedAt: -1, name: 1 });
    const totalPayables = suppliers.reduce((sum, s) => sum + (s.currentBalance > 0 ? s.currentBalance : 0), 0);

    res.json({
      success: true,
      suppliers,
      summary: {
        count: suppliers.length,
        totalPayables
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create Supplier / Karigar
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      pedhiId,
      name,
      category,
      mobile,
      email,
      city,
      address,
      gstNumber,
      openingBalance,
      materialSupplied,
      bankDetails,
      notes
    } = req.body;

    if (!pedhiId || !name || !mobile) {
      return res.status(400).json({ success: false, message: 'Pedhi, Name and Mobile are required' });
    }

    const opBal = Number(openingBalance) || 0;

    const supplier = await Supplier.create({
      pedhiId,
      name,
      category: category || 'Stone Quarry',
      mobile,
      email,
      city: city || 'Rajkot',
      address,
      gstNumber: gstNumber ? gstNumber.toUpperCase() : '',
      openingBalance: opBal,
      currentBalance: opBal,
      materialSupplied: materialSupplied || '',
      bankDetails: bankDetails || {},
      notes: notes || ''
    });

    res.status(201).json({ success: true, supplier });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Record Payment to Supplier (Naame / Cash Out)
router.post('/:id/pay', async (req: any, res: Response) => {
  try {
    const { amount, paymentMode, referenceNumber, notes } = req.body;
    const payAmt = Number(amount);
    if (isNaN(payAmt) || payAmt <= 0) {
      return res.status(400).json({ success: false, message: 'Valid positive amount required' });
    }

    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });

    supplier.currentBalance = (supplier.currentBalance || 0) - payAmt;
    await supplier.save();

    await Transaction.create({
      pedhiId: supplier.pedhiId,
      date: new Date(),
      type: 'PAYMENT_OUT',
      amount: payAmt,
      partyName: supplier.name,
      paymentMode: paymentMode || 'UPI',
      referenceNumber: referenceNumber || '',
      category: 'Supplier Payment',
      notes: notes || `Payment to ${supplier.name} for ${supplier.materialSupplied}`
    });

    res.json({
      success: true,
      supplier,
      message: `Payment of ₹${payAmt.toLocaleString('en-IN')} recorded to ${supplier.name}`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Record Purchase from Supplier (increases what we owe them)
router.post('/:id/purchase', async (req: any, res: Response) => {
  try {
    const { amount, description, invoiceNumber } = req.body;
    const billAmt = Number(amount);
    if (isNaN(billAmt) || billAmt <= 0) {
      return res.status(400).json({ success: false, message: 'Valid positive amount required' });
    }

    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });

    supplier.currentBalance = (supplier.currentBalance || 0) + billAmt;
    await supplier.save();

    res.json({
      success: true,
      supplier,
      message: `Raw material purchase of ₹${billAmt.toLocaleString('en-IN')} added to ${supplier.name}'s ledger`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
