/**
 * Expo Router Serverless API Route: /api/costing
 * Implements serverless pricing and profit calculations for Expo application
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      stoneType = 'Lakha Red Stone',
      lengthInches = 36,
      widthInches = 24,
      customSupplierCostPerSqFt = 450,
      labourCostPerSqFt = 80,
      sellingRatePerSqFt = 650,
      supplierName = 'Direct Quarry Lot'
    } = body;

    const len = Number(lengthInches) || 1;
    const wid = Number(widthInches) || 1;
    const totalSqFt = Number(((len * wid) / 144).toFixed(3));

    const rawCostPerSqFt = Number(customSupplierCostPerSqFt) || 0;
    const labourPerSqFt = Number(labourCostPerSqFt) || 0;
    const sellRatePerSqFt = Number(sellingRatePerSqFt) || 0;

    const totalCostPerSqFt = rawCostPerSqFt + labourPerSqFt;
    const totalCost = Math.round(totalCostPerSqFt * totalSqFt);
    const totalRevenue = Math.round(sellRatePerSqFt * totalSqFt);
    const profitPerSqFt = sellRatePerSqFt - totalCostPerSqFt;
    const totalProfit = totalRevenue - totalCost;
    const marginPercent = totalRevenue > 0 ? Number(((totalProfit / totalRevenue) * 100).toFixed(1)) : 0;

    return Response.json({
      success: true,
      stoneType,
      dimensions: {
        lengthInches: len,
        widthInches: wid,
        totalSqFt
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
        status: totalProfit > 0 ? 'PROFITABLE' : 'LOSS'
      },
      environment: 'Expo Serverless API (Next-Native / Expo Router v3)'
    });
  } catch (error: any) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    status: 'active',
    endpoint: '/api/costing',
    methods: ['POST', 'GET'],
    description: 'Serverless Takti Square Feet and Custom Supplier Profit Engine'
  });
}
