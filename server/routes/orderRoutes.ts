import { Router, Request, Response } from 'express';
import { Order } from '../models/Order.js';
import { Pedhi } from '../models/Pedhi.js';
import { Customer } from '../models/Customer.js';
import { Invoice } from '../models/Invoice.js';
import { Transaction } from '../models/Transaction.js';

const router = Router();

// List Orders
router.get('/', async (req: Request, res: Response) => {
  try {
    const { pedhiId, status, productType, search } = req.query;

    let query: any = {};
    if (pedhiId) query.pedhiId = pedhiId;
    if (status && status !== 'All') query.status = status;
    if (productType && productType !== 'All') query.productType = productType;

    if (search) {
      const regex = new RegExp(String(search), 'i');
      query.$or = [
        { orderNumber: regex },
        { customerName: regex },
        { customerMobile: regex },
        { title: regex },
        { specsSummary: regex }
      ];
    }

    const orders = await Order.find(query).sort({ deliveryDate: 1, createdAt: -1 });

    const totalOrdersCount = orders.length;
    const totalOrderValue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalPendingAdvance = orders.reduce((sum, o) => sum + (o.balanceDue || 0), 0);

    res.json({
      success: true,
      orders,
      summary: {
        totalOrdersCount,
        totalOrderValue,
        totalPendingAdvance
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Next order number
router.get('/next-number/:pedhiId', async (req: any, res: Response) => {
  try {
    const pedhi = await Pedhi.findById(req.params.pedhiId);
    const prefix = pedhi ? pedhi.name.substring(0, 3).toUpperCase() : 'ORD';
    const count = await Order.countDocuments({ pedhiId: req.params.pedhiId });
    const orderNumber = `ORD-${prefix}-${101 + count}`;
    res.json({ success: true, orderNumber });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create Order
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      pedhiId,
      customerId,
      deliveryDate,
      productType,
      title,
      specsSummary,
      customDetails,
      totalAmount,
      advancePaid,
      costPerSqFt,
      labourCostPerSqFt,
      totalCost,
      estimatedProfit,
      profitMarginPercent,
      supplierName,
      assignedKarigar,
      notes
    } = req.body;

    if (!pedhiId || !customerId || !deliveryDate || !title) {
      return res.status(400).json({
        success: false,
        message: 'Pedhi, party, delivery target date, and order title are required'
      });
    }

    const [pedhi, customer] = await Promise.all([
      Pedhi.findById(pedhiId),
      Customer.findById(customerId)
    ]);

    if (!pedhi || !customer) {
      return res.status(404).json({ success: false, message: 'Pedhi or Party not found' });
    }

    const prefix = pedhi.name.substring(0, 3).toUpperCase();
    const count = await Order.countDocuments({ pedhiId });
    const orderNumber = req.body.orderNumber || `ORD-${prefix}-${101 + count}`;

    const total = Number(totalAmount) || 0;
    const advance = Number(advancePaid) || 0;
    const balance = Math.max(0, total - advance);

    const order = await Order.create({
      pedhiId,
      orderNumber,
      orderDate: new Date(),
      deliveryDate: new Date(deliveryDate),
      customerId: customer._id,
      customerName: customer.name,
      customerMobile: customer.mobile,
      productType: productType || 'mandir',
      title,
      specsSummary: specsSummary || '',
      customDetails: customDetails || {},
      totalAmount: total,
      advancePaid: advance,
      balanceDue: balance,
      costPerSqFt: Number(costPerSqFt) || 0,
      labourCostPerSqFt: Number(labourCostPerSqFt) || 0,
      totalCost: Number(totalCost) || 0,
      estimatedProfit: Number(estimatedProfit) || 0,
      profitMarginPercent: Number(profitMarginPercent) || 0,
      supplierName: supplierName || '',
      status: 'Booked',
      assignedKarigar: assignedKarigar || '',
      notes: notes || ''
    });

    // If advance was received immediately, record Rojmel transaction & adjust customer balance
    if (advance > 0) {
      customer.currentBalance = (customer.currentBalance || 0) + balance;
      await customer.save();

      await Transaction.create({
        pedhiId,
        date: new Date(),
        type: 'PAYMENT_IN',
        amount: advance,
        customerId: customer._id,
        partyName: customer.name,
        paymentMode: 'UPI',
        referenceNumber: orderNumber,
        category: 'Order Booking Advance',
        notes: `Advance for ${title} (${orderNumber})`
      });
    }

    res.status(201).json({ success: true, order, message: `Order #${orderNumber} booked successfully` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Order status / progress stage
router.patch('/:id/status', async (req: any, res: Response) => {
  try {
    const { status, assignedKarigar, notes } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (status) order.status = status;
    if (assignedKarigar !== undefined) order.assignedKarigar = assignedKarigar;
    if (notes !== undefined) order.notes = notes;

    await order.save();
    res.json({ success: true, order, message: `Order status updated to: ${status}` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Convert completed order into Tax Invoice
router.post('/:id/convert-to-invoice', async (req: any, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const pedhi = await Pedhi.findById(order.pedhiId);
    if (!pedhi) return res.status(404).json({ success: false, message: 'Pedhi not found' });

    const prefix = pedhi.settings?.invoicePrefix || 'GS/';
    const seq = pedhi.settings?.invoiceNextNumber || 101;
    const invoiceNumber = `${prefix}${seq}`;

    // Item line
    const gstRate = 12;
    const taxableAmount = Number((order.totalAmount / (1 + gstRate / 100)).toFixed(2));
    const gstTotal = order.totalAmount - taxableAmount;
    const cgst = Number((gstTotal / 2).toFixed(2));
    const sgst = Number((gstTotal / 2).toFixed(2));

    const invoice = await Invoice.create({
      pedhiId: order.pedhiId,
      invoiceNumber,
      date: new Date(),
      customerId: order.customerId,
      customerName: order.customerName,
      customerMobile: order.customerMobile,
      isInterstate: false,
      items: [
        {
          name: `${order.title} (${order.specsSummary})`,
          unit: order.productType === 'takti' ? 'SqFt' : 'Pcs',
          quantity: order.customDetails?.calculatedSqFt || 1,
          rate: order.customDetails?.calculatedSqFt
            ? Number((order.totalAmount / order.customDetails.calculatedSqFt).toFixed(2))
            : order.totalAmount,
          taxableAmount,
          gstRate,
          cgstAmount: cgst,
          sgstAmount: sgst,
          igstAmount: 0,
          total: order.totalAmount
        }
      ],
      subtotal: taxableAmount,
      discountTotal: 0,
      totalCgst: cgst,
      totalSgst: sgst,
      totalIgst: 0,
      roundOff: 0,
      grandTotal: order.totalAmount,
      paymentMode: order.balanceDue === 0 ? 'UPI' : 'Credit',
      paymentStatus: order.balanceDue === 0 ? 'Paid' : order.advancePaid > 0 ? 'Partial' : 'Unpaid',
      amountPaid: order.advancePaid,
      balanceDue: order.balanceDue,
      notes: `Generated from Order #${order.orderNumber}`
    });

    // Advance sequence
    if (pedhi.settings) {
      pedhi.settings.invoiceNextNumber = seq + 1;
      pedhi.markModified('settings');
      await pedhi.save();
    }

    order.invoiceId = invoice._id;
    order.status = 'Delivered';
    await order.save();

    res.json({
      success: true,
      invoice,
      order,
      message: `Order #${order.orderNumber} converted to Tax Invoice #${invoiceNumber}`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
