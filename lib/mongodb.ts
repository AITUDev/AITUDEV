import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.warn('⚠️ Warning: MONGODB_URI is not defined in .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongo;

if (!cached) {
  cached = (global as any).mongo = { conn: null, promise: null };
}

async function dbConnect(): Promise<Db> {
  if (!MONGODB_URI || MONGODB_URI.includes('<db_username>')) {
    throw new Error('MONGODB_URI in .env.local contains a placeholder <db_username>. Please replace it with your actual MongoDB username.');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return client.db(process.env.MONGODB_DB_NAME || 'aitudev');
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
