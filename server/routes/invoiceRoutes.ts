import { Router, Request, Response } from 'express';
import { Invoice } from '../models/Invoice.js';
import { Pedhi } from '../models/Pedhi.js';
import { Customer } from '../models/Customer.js';
import { Product } from '../models/Product.js';
import { Transaction } from '../models/Transaction.js';

const router = Router();

// List Invoices
router.get('/', async (req: Request, res: Response) => {
  try {
    const { pedhiId, status, search, startDate, endDate } = req.query;

    let query: any = {};
    if (pedhiId) {
      query.pedhiId = pedhiId;
    }

    if (status && status !== 'All') {
      query.paymentStatus = status;
    }

    if (search) {
      const regex = new RegExp(String(search), 'i');
      query.$or = [
        { invoiceNumber: regex },
        { customerName: regex },
        { customerMobile: regex }
      ];
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(String(startDate));
      if (endDate) {
        const end = new Date(String(endDate));
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const invoices = await Invoice.find(query).sort({ date: -1, createdAt: -1 });

    // Summary counts
    const totalAmount = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const totalDue = invoices.reduce((sum, inv) => sum + (inv.balanceDue || 0), 0);

    res.json({
      success: true,
      invoices,
      summary: {
        count: invoices.length,
        totalAmount,
        totalDue
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Next Invoice Number for Pedhi
router.get('/next-number/:pedhiId', async (req: any, res: Response) => {
  try {
    const pedhi = await Pedhi.findById(req.params.pedhiId);
    if (!pedhi) {
      return res.status(404).json({ success: false, message: 'Pedhi not found' });
    }

    const prefix = pedhi.settings?.invoicePrefix || 'GS/';
    const nextSeq = pedhi.settings?.invoiceNextNumber || 101;
    const invoiceNumber = `${prefix}${nextSeq}`;

    res.json({
      success: true,
      prefix,
      nextSeq,
      invoiceNumber
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single Invoice with full pedhi & party details
router.get('/:id', async (req: any, res: Response) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const [pedhi, customer] = await Promise.all([
      Pedhi.findById(invoice.pedhiId),
      Customer.findById(invoice.customerId)
    ]);

    res.json({
      success: true,
      invoice,
      pedhi,
      customer
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create Invoice
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      pedhiId,
      customerId,
      invoiceNumber,
      date,
      dueDate,
      items,
      discountTotal,
      isInterstate,
      paymentMode,
      amountPaid,
      notes
    } = req.body;

    if (!pedhiId || !customerId || !items || !items.length) {
      return res.status(400).json({ success: false, message: 'Pedhi, party, and at least one item are required' });
    }

    const [pedhi, customer] = await Promise.all([
      Pedhi.findById(pedhiId),
      Customer.findById(customerId)
    ]);

    if (!pedhi) return res.status(404).json({ success: false, message: 'Pedhi not found' });
    if (!customer) return res.status(404).json({ success: false, message: 'Party not found' });

    // Calculate item taxes and totals
    let calculatedSubtotal = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;

    const processedItems = items.map((it: any) => {
      const qty = Number(it.quantity) || 1;
      const rate = Number(it.rate) || 0;
      const discPercent = Number(it.discountPercent) || 0;
      const gross = qty * rate;
      const discount = (gross * discPercent) / 100;
      const taxable = gross - discount;
      calculatedSubtotal += taxable;

      const gstRate = Number(it.gstRate) || 0;
      let cgst = 0;
      let sgst = 0;
      let igst = 0;

      if (isInterstate) {
        igst = (taxable * gstRate) / 100;
        totalIgst += igst;
      } else {
        cgst = (taxable * (gstRate / 2)) / 100;
        sgst = (taxable * (gstRate / 2)) / 100;
        totalCgst += cgst;
        totalSgst += sgst;
      }

      const total = taxable + cgst + sgst + igst;

      return {
        productId: it.productId || null,
        name: it.name,
        category: it.category || 'General',
        unit: it.unit || 'Pcs',
        quantity: qty,
        rate: rate,
        discountPercent: discPercent,
        taxableAmount: taxable,
        gstRate: gstRate,
        cgstAmount: cgst,
        sgstAmount: sgst,
        igstAmount: igst,
        total: total
      };
    });

    const discTotal = Number(discountTotal) || 0;
    const rawGrandTotal = calculatedSubtotal - discTotal + totalCgst + totalSgst + totalIgst;
    const roundedGrandTotal = Math.round(rawGrandTotal);
    const roundOff = Number((roundedGrandTotal - rawGrandTotal).toFixed(2));

    const paid = Number(amountPaid) || 0;
    const balanceDue = Math.max(0, roundedGrandTotal - paid);

    let paymentStatus: 'Paid' | 'Unpaid' | 'Partial' = 'Unpaid';
    if (paid >= roundedGrandTotal) {
      paymentStatus = 'Paid';
    } else if (paid > 0) {
      paymentStatus = 'Partial';
    }

    // Determine final invoice number
    let finalInvNum = invoiceNumber;
    if (!finalInvNum) {
      const prefix = pedhi.settings?.invoicePrefix || 'GS/';
      const seq = pedhi.settings?.invoiceNextNumber || 101;
      finalInvNum = `${prefix}${seq}`;
    }

    // Create Invoice
    const invoice = await Invoice.create({
      pedhiId,
      invoiceNumber: finalInvNum,
      date: date ? new Date(date) : new Date(),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      customerId: customer._id,
      customerName: customer.name,
      customerMobile: customer.mobile,
      customerAddress: customer.address ? `${customer.address}, ${customer.city}` : customer.city,
      customerGst: customer.gstNumber,
      isInterstate: !!isInterstate,
      items: processedItems,
      subtotal: calculatedSubtotal,
      discountTotal: discTotal,
      totalCgst,
      totalSgst,
      totalIgst,
      roundOff,
      grandTotal: roundedGrandTotal,
      paymentMode: paymentMode || (balanceDue === 0 ? 'Cash' : 'Credit'),
      paymentStatus,
      amountPaid: paid,
      balanceDue,
      notes: notes || ''
    });

    // 1. Advance pedhi next invoice sequence
    if (pedhi.settings) {
      pedhi.settings.invoiceNextNumber = (pedhi.settings.invoiceNextNumber || 101) + 1;
      pedhi.markModified('settings');
      await pedhi.save();
    }

    // 2. Adjust customer balance (They owe balanceDue)
    customer.currentBalance = (customer.currentBalance || 0) + balanceDue;
    await customer.save();

    // 3. Deduct product stock for items with productId
    for (const item of processedItems) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { currentStock: -item.quantity }
        });
      }
    }

    // 4. If any payment was made immediately, log Rojmel transaction
    if (paid > 0) {
      await Transaction.create({
        pedhiId,
        date: invoice.date,
        type: 'PAYMENT_IN',
        amount: paid,
        customerId: customer._id,
        partyName: customer.name,
        paymentMode: paymentMode === 'Credit' ? 'Cash' : paymentMode,
        referenceNumber: invoice.invoiceNumber,
        invoiceId: invoice._id,
        category: 'Sales Invoice Settlement',
        notes: `Immediate payment received for Bill #${invoice.invoiceNumber}`
      });
    }

    res.status(201).json({
      success: true,
      invoice,
      message: `Invoice #${invoice.invoiceNumber} created successfully`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Record payment for existing invoice
router.post('/:id/record-payment', async (req: any, res: Response) => {
  try {
    const { amount, paymentMode, referenceNumber, notes } = req.body;
    const payAmount = Number(amount);

    if (isNaN(payAmount) || payAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid positive amount required' });
    }

    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const customer = await Customer.findById(invoice.customerId);

    // Apply payment
    invoice.amountPaid = (invoice.amountPaid || 0) + payAmount;
    invoice.balanceDue = Math.max(0, invoice.grandTotal - invoice.amountPaid);
    invoice.paymentStatus = invoice.balanceDue === 0 ? 'Paid' : 'Partial';
    await invoice.save();

    // Adjust customer khata balance
    if (customer) {
      customer.currentBalance = (customer.currentBalance || 0) - payAmount;
      await customer.save();
    }

    // Log Rojmel entry
    await Transaction.create({
      pedhiId: invoice.pedhiId,
      date: new Date(),
      type: 'PAYMENT_IN',
      amount: payAmount,
      customerId: invoice.customerId,
      partyName: invoice.customerName,
      paymentMode: paymentMode || 'Cash',
      referenceNumber: referenceNumber || invoice.invoiceNumber,
      invoiceId: invoice._id,
      category: 'Invoice Payment',
      notes: notes || `Payment against bill #${invoice.invoiceNumber}`
    });

    res.json({
      success: true,
      invoice,
      message: `Payment of ₹${payAmount.toLocaleString('en-IN')} recorded successfully`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
