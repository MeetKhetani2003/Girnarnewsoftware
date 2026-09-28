import { Router, Request, Response } from 'express';
import { StockTransfer } from '../models/StockTransfer.js';
import { Product } from '../models/Product.js';
import { Pedhi } from '../models/Pedhi.js';

const router = Router();

// List Transfers
router.get('/', async (req: Request, res: Response) => {
  try {
    const { pedhiId } = req.query;

    let query: any = {};
    if (pedhiId) {
      query.$or = [{ fromPedhiId: pedhiId }, { toPedhiId: pedhiId }];
    }

    const transfers = await StockTransfer.find(query).sort({ transferDate: -1, createdAt: -1 });
    res.json({ success: true, transfers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create Transfer between Pedhis
router.post('/', async (req: Request, res: Response) => {
  try {
    const { fromPedhiId, toPedhiId, productId, quantity, vehicleNumber, notes } = req.body;
    const qty = Number(quantity);

    if (!fromPedhiId || !toPedhiId || !productId || isNaN(qty) || qty <= 0) {
      return res.status(400).json({ success: false, message: 'Source pedhi, target pedhi, product and valid quantity required' });
    }

    if (fromPedhiId === toPedhiId) {
      return res.status(400).json({ success: false, message: 'Source and Target Pedhi must be different' });
    }

    const [fromPedhi, toPedhi, sourceProduct] = await Promise.all([
      Pedhi.findById(fromPedhiId),
      Pedhi.findById(toPedhiId),
      Product.findById(productId)
    ]);

    if (!fromPedhi || !toPedhi || !sourceProduct) {
      return res.status(404).json({ success: false, message: 'Pedhis or source product not found' });
    }

    // 1. Deduct stock from source product
    sourceProduct.currentStock = Math.max(0, (sourceProduct.currentStock || 0) - qty);
    await sourceProduct.save();

    // 2. Find or create matching product in target Pedhi
    let targetProduct = await Product.findOne({
      pedhiId: toPedhi._id,
      name: sourceProduct.name
    });

    if (targetProduct) {
      targetProduct.currentStock = (targetProduct.currentStock || 0) + qty;
      await targetProduct.save();
    } else {
      // Clone product to target pedhi
      targetProduct = await Product.create({
        pedhiId: toPedhi._id,
        name: sourceProduct.name,
        productType: sourceProduct.productType,
        category: sourceProduct.category,
        unit: sourceProduct.unit,
        taktiSpecs: sourceProduct.taktiSpecs,
        mandirSpecs: sourceProduct.mandirSpecs,
        murtiSpecs: sourceProduct.murtiSpecs,
        hsnCode: sourceProduct.hsnCode,
        sellingPrice: sourceProduct.sellingPrice,
        purchasePrice: sourceProduct.purchasePrice,
        currentStock: qty,
        minStockAlert: sourceProduct.minStockAlert,
        gstRate: sourceProduct.gstRate,
        sku: sourceProduct.sku,
        description: sourceProduct.description
      });
    }

    const count = await StockTransfer.countDocuments({});
    const transferNumber = `TRF/${new Date().getFullYear()}/${100 + count + 1}`;

    const transfer = await StockTransfer.create({
      fromPedhiId: fromPedhi._id,
      fromPedhiName: fromPedhi.name,
      toPedhiId: toPedhi._id,
      toPedhiName: toPedhi.name,
      productId: sourceProduct._id,
      productName: sourceProduct.name,
      quantity: qty,
      unit: sourceProduct.unit,
      productType: sourceProduct.productType,
      transferNumber,
      status: 'Received',
      vehicleNumber: vehicleNumber || '',
      transferDate: new Date(),
      receivedDate: new Date(),
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      transfer,
      message: `Successfully transferred ${qty} ${sourceProduct.unit} of "${sourceProduct.name}" from ${fromPedhi.name} to ${toPedhi.name}`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
