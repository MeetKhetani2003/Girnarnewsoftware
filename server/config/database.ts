import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb://meetkhetani1111_db_user:U0gKyuDry2hCVODV@ac-jl18wkj-shard-00-00.z4iviiq.mongodb.net:27017,ac-jl18wkj-shard-00-01.z4iviiq.mongodb.net:27017,ac-jl18wkj-shard-00-02.z4iviiq.mongodb.net:27017/?ssl=true&replicaSet=atlas-73wprs-shard-0&authSource=admin&appName=Cluster0';

let isConnected = false;

export async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }

  const uri = process.env.MONGODB_URI || DEFAULT_URI;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected to host: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.error(`[Database Error] Could not connect to MongoDB: ${error.message}`);
    return false;
  }
}

export function getDatabaseStatus() {
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const stateCode = mongoose.connection.readyState;
  return {
    state: states[stateCode] || 'Unknown',
    isConnected: stateCode === 1,
    host: mongoose.connection.host || 'MongoDB Atlas'
  };
}
