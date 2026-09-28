/**
 * Expo Router Serverless API Route: /api/orders
 * Handles order booking with custom supplier pricing & MongoDB Atlas connection
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://meetkhetani1111_db_user:U0gKyuDry2hCVODV@ac-jl18wkj-shard-00-00.z4iviiq.mongodb.net:27017,ac-jl18wkj-shard-00-01.z4iviiq.mongodb.net:27017,ac-jl18wkj-shard-00-02.z4iviiq.mongodb.net:27017/?ssl=true&replicaSet=atlas-73wprs-shard-0&authSource=admin&appName=Cluster0';

async function connectToMongo() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

export async function GET(request: Request) {
  try {
    await connectToMongo();
    const url = new URL(request.url);
    const pedhiId = url.searchParams.get('pedhiId');

    const db = mongoose.connection.db;
    if (!db) {
      return Response.json({ success: false, message: 'Database not initialized' }, { status: 500 });
    }

    const query: any = {};
    if (pedhiId) query.pedhiId = new mongoose.Types.ObjectId(pedhiId);

    const orders = await db.collection('orders').find(query).sort({ createdAt: -1 }).toArray();

    return Response.json({
      success: true,
      orders,
      count: orders.length,
      source: 'Expo Serverless Route + MongoDB Atlas'
    });
  } catch (error: any) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToMongo();
    const body = await request.json();
    const db = mongoose.connection.db;
    if (!db) {
      return Response.json({ success: false, message: 'Database not initialized' }, { status: 500 });
    }

    const newOrder = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('orders').insertOne(newOrder);

    return Response.json({
      success: true,
      orderId: result.insertedId,
      message: 'Order placed successfully via Expo Serverless API'
    }, { status: 201 });
  } catch (error: any) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
