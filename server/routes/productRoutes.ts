import { Router, Request, Response } from 'express';
import { Product } from '../models/Product.js';

const router = Router();

// List products
router.get('/', async (req: Request, res: Response) => {
  try {
    const { pedhiId, category, search, lowStockOnly } = req.query;

    let query: any = {};
    if (pedhiId) {
      query.pedhiId = pedhiId;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      const regex = new RegExp(String(search), 'i');
      query.$or = [
        { name: regex },
        { sku: regex },
        { hsnCode: regex },
        { category: regex }
      ];
    }

    if (lowStockOnly === 'true') {
      query.$expr = { $lte: ['$currentStock', '$minStockAlert'] };
    }

    const products = await Product.find(query).sort({ updatedAt: -1, name: 1 });
    
    // Distinct categories for tabs
    const categories = await Product.distinct('category', pedhiId ? { pedhiId } : {});

    res.json({
      success: true,
      products,
      categories: ['All', ...categories.filter(Boolean)]
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single product
router.get('/:id', async (req: any, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create product
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      pedhiId,
      name,
      category,
      unit,
      hsnCode,
      sellingPrice,
      purchasePrice,
      currentStock,
      minStockAlert,
      gstRate,
      sku,
      description
    } = req.body;

    if (!pedhiId || !name) {
      return res.status(400).json({ success: false, message: 'Pedhi and Item Name are required' });
    }

    const product = await Product.create({
      pedhiId,
      name,
      category: category || 'General Stone',
      unit: unit || 'Pcs',
      hsnCode: hsnCode || '6802',
      sellingPrice: Number(sellingPrice) || 0,
      purchasePrice: Number(purchasePrice) || 0,
      currentStock: Number(currentStock) || 0,
      minStockAlert: Number(minStockAlert) || 5,
      gstRate: Number(gstRate) || 18,
      sku,
      description
    });

    res.status(201).json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Quick Stock Adjustment (+ or - count)
router.post('/:id/adjust-stock', async (req: any, res: Response) => {
  try {
    const { adjustment, reason } = req.body; // e.g. +10 or -3
    const delta = Number(adjustment);

    if (isNaN(delta) || delta === 0) {
      return res.status(400).json({ success: false, message: 'Valid non-zero adjustment quantity required' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    product.currentStock = (product.currentStock || 0) + delta;
    await product.save();

    res.json({
      success: true,
      product,
      message: `Stock adjusted by ${delta > 0 ? '+' : ''}${delta}. New stock: ${product.currentStock}`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update product
router.put('/:id', async (req: any, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete product
router.delete('/:id', async (req: any, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
