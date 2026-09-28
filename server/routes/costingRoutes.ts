import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Serverless API Route: Takti Costing & Profit Engine
 * Answers user request:
 * "takti has the marble grenite and lakhared stone ok so they all costs diffrent ok from supplier
 * like some wher 1ftsq marble in 450 somewhere 500persqft like that so how can we calculate the
 * costing of it whiel in factory we dont know which supllier's supply we are using so it also have
 * the custom supply price option while booking the order so it will give me profit"
 */
router.post('/takti-calculator', async (req: Request, res: Response) => {
  try {
    const {
      stoneType = 'Lakha Red Stone',
      lengthInches = 36,
      widthInches = 24,
      customSupplierCostPerSqFt = 450,
      labourCostPerSqFt = 80,
      sellingRatePerSqFt = 650,
      supplierName = 'Custom Quarry Batch'
    } = req.body;

    const len = Number(lengthInches) || 1;
    const wid = Number(widthInches) || 1;
    const sqFt = Number(((len * wid) / 144).toFixed(3));

    const rawCostPerSqFt = Number(customSupplierCostPerSqFt) || 0;
    const labourPerSqFt = Number(labourCostPerSqFt) || 0;
    const sellRatePerSqFt = Number(sellingRatePerSqFt) || 0;

    const totalCostPerSqFt = rawCostPerSqFt + labourPerSqFt;
    const totalCost = Math.round(totalCostPerSqFt * sqFt);
    const totalRevenue = Math.round(sellRatePerSqFt * sqFt);
    const profitPerSqFt = sellRatePerSqFt - totalCostPerSqFt;
    const totalProfit = totalRevenue - totalCost;
    const marginPercent = totalRevenue > 0 ? Number(((totalProfit / totalRevenue) * 100).toFixed(1)) : 0;

    // Supplier comparison matrix (e.g. Quarry A @ 450 vs Quarry B @ 500 vs Quarry C @ 420)
    const comparison = [
      { supplier: 'Rajasthan Quarry Direct', ratePerSqFt: 420 },
      { supplier: 'Morbi Stone Yard A', ratePerSqFt: 450 },
      { supplier: 'Premium Selected Slab B', ratePerSqFt: 500 },
      { supplier: supplierName || 'Current Batch Selection', ratePerSqFt: rawCostPerSqFt }
    ].map((item) => {
      const itemCostPerSqFt = item.ratePerSqFt + labourPerSqFt;
      const itemTotalCost = Math.round(itemCostPerSqFt * sqFt);
      const itemProfit = totalRevenue - itemTotalCost;
      const itemMargin = totalRevenue > 0 ? Number(((itemProfit / totalRevenue) * 100).toFixed(1)) : 0;
      return {
        supplier: item.supplier,
        supplierCostPerSqFt: item.ratePerSqFt,
        totalCostPerSqFt: itemCostPerSqFt,
        totalCost: itemTotalCost,
        netProfit: itemProfit,
        marginPercent: itemMargin
      };
    });

    res.json({
      success: true,
      stoneType,
      dimensions: {
        lengthInches: len,
        widthInches: wid,
        totalSqFt: sqFt
      },
      costing: {
        supplierName,
        customSupplierCostPerSqFt: rawCostPerSqFt,
        labourCostPerSqFt: labourPerSqFt,
        totalCostPerSqFt,
        totalCost
      },
      pricing: {
        sellingRatePerSqFt: sellRatePerSqFt,
        totalRevenue
      },
      profitability: {
        profitPerSqFt,
        totalProfit,
        marginPercent,
        status: totalProfit > 0 ? 'PROFITABLE' : totalProfit === 0 ? 'BREAKEVEN' : 'LOSS'
      },
      supplierComparison: comparison,
      serverlessEngine: 'Expo Router API + MongoDB Atlas / Node.js'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Serverless API Route: Mandir Costing & Profit Engine
 * For Sevan wood & marble mandirs
 */
router.post('/mandir-calculator', async (req: Request, res: Response) => {
  try {
    const {
      material = 'Pure Sevan Wood',
      widthInches = 48,
      depthInches = 24,
      heightInches = 66,
      shikharaType = '3 Shikhara with Kalash',
      rawMaterialCost = 38000,
      karigarLabourCost = 18000,
      sellingPrice = 78000
    } = req.body;

    const rawCost = Number(rawMaterialCost) || 0;
    const labourCost = Number(karigarLabourCost) || 0;
    const sellPrice = Number(sellingPrice) || 0;

    const totalCost = rawCost + labourCost;
    const totalProfit = sellPrice - totalCost;
    const marginPercent = sellPrice > 0 ? Number(((totalProfit / sellPrice) * 100).toFixed(1)) : 0;

    res.json({
      success: true,
      product: 'mandir',
      material,
      dimensions: { widthInches, depthInches, heightInches },
      shikharaType,
      costing: {
        rawMaterialCost: rawCost,
        karigarLabourCost: labourCost,
        totalCost
      },
      pricing: {
        sellingPrice: sellPrice
      },
      profitability: {
        totalProfit,
        marginPercent,
        status: totalProfit > 0 ? 'PROFITABLE' : 'LOSS'
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Serverless API Route: Murti Costing & Profit Engine
 * For Makrana marble & gemstone bhagwan murtis
 */
router.post('/murti-calculator', async (req: Request, res: Response) => {
  try {
    const {
      deity = 'Radha Krishna',
      heightInches = 24,
      marbleType = 'Makrana Super White (Grade A)',
      shringarWork = '24K Real Gold Leaf Foil (Vark)',
      marbleBlockCost = 36000,
      sculptorLabourCost = 16000,
      sellingPrice = 75000
    } = req.body;

    const rawCost = Number(marbleBlockCost) || 0;
    const labourCost = Number(sculptorLabourCost) || 0;
    const sellPrice = Number(sellingPrice) || 0;

    const totalCost = rawCost + labourCost;
    const totalProfit = sellPrice - totalCost;
    const marginPercent = sellPrice > 0 ? Number(((totalProfit / sellPrice) * 100).toFixed(1)) : 0;

    res.json({
      success: true,
      product: 'murti',
      deity,
      heightInches,
      marbleType,
      shringarWork,
      costing: {
        marbleBlockCost: rawCost,
        sculptorLabourCost: labourCost,
        totalCost
      },
      pricing: {
        sellingPrice: sellPrice
      },
      profitability: {
        totalProfit,
        marginPercent,
        status: totalProfit > 0 ? 'PROFITABLE' : 'LOSS'
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
