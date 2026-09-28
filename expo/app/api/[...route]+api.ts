/**
 * Next-Native / Expo Router Catch-All Serverless API Route: /api/[...route]
 * Handles dynamic serverless API routing inside the Expo App
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://meetkhetani1111_db_user:U0gKyuDry2hCVODV@ac-jl18wkj-shard-00-00.z4iviiq.mongodb.net:27017,ac-jl18wkj-shard-00-01.z4iviiq.mongodb.net:27017,ac-jl18wkj-shard-00-02.z4iviiq.mongodb.net:27017/?ssl=true&replicaSet=atlas-73wprs-shard-0&authSource=admin&appName=Cluster0';

async function getDb() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGODB_URI);
  }
  return mongoose.connection.db;
}

export async function GET(request: Request, context: { params: { route: string[] } }) {
  try {
    const db = await getDb();
    if (!db) throw new Error('Failed to connect to MongoDB');

    const routePath = (context.params.route || []).join('/');
    const url = new URL(request.url);
    const pedhiId = url.searchParams.get('pedhiId');

    // Routing based on path
    if (routePath === 'pedhis') {
      const pedhis = await db.collection('pedhis').find({}).toArray();
      return Response.json({ success: true, pedhis, count: pedhis.length });
    }

    if (routePath === 'products') {
      const filter: any = {};
      if (pedhiId) filter.pedhiId = new mongoose.Types.ObjectId(pedhiId);
      const products = await db.collection('products').find(filter).toArray();
      return Response.json({ success: true, products, count: products.length });
    }

    if (routePath === 'suppliers') {
      const filter: any = {};
      if (pedhiId) filter.pedhiId = new mongoose.Types.ObjectId(pedhiId);
      const suppliers = await db.collection('suppliers').find(filter).toArray();
      return Response.json({ success: true, suppliers, count: suppliers.length });
    }

    if (routePath === 'customers') {
      const filter: any = {};
      if (pedhiId) filter.pedhiId = new mongoose.Types.ObjectId(pedhiId);
      const customers = await db.collection('customers').find(filter).toArray();
      return Response.json({ success: true, customers, count: customers.length });
    }

    return Response.json({
      status: 'active',
      route: routePath,
      message: 'Expo Next-Native Serverless API Endpoint is active',
      database: 'MongoDB Atlas Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: { route: string[] } }) {
  try {
    const db = await getDb();
    if (!db) throw new Error('Failed to connect to MongoDB');

    const routePath = (context.params.route || []).join('/');
    const body = await request.json();

    if (routePath === 'transactions') {
      const result = await db.collection('transactions').insertOne({
        ...body,
        createdAt: new Date()
      });
      return Response.json({ success: true, transactionId: result.insertedId }, { status: 201 });
    }

    return Response.json({
      success: true,
      message: `Processed POST request to /api/${routePath} via Expo Serverless Engine`,
      payload: body
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
