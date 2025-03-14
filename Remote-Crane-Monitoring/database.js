
// Database connection module

// PostgreSQL connection
const { Pool } = require('pg');

// MongoDB connection
const { MongoClient } = require('mongodb');

// Connection configuration
const dbConfig = {
  // PostgreSQL configuration
  postgresql: {
    connectionString: process.env.DATABASE_URL || '',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // Maximum connections in the pool
    idleTimeoutMillis: 30000
  },
  
  // MongoDB configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://darshankr22cy018nc:Darshan@#1@cluster0.zhvo0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    dbName: 'crane_monitoring',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
    }
  }
};

// PostgreSQL pool
const pgPool = new Pool(dbConfig.postgresql);

// MongoDB client
let mongoClient = null;
let mongoDb = null;

// Initialize MongoDB connection
async function connectMongo() {
  if (!mongoClient) {
    mongoClient = new MongoClient(dbConfig.mongodb.uri, dbConfig.mongodb.options);
    await mongoClient.connect();
    mongoDb = mongoClient.db(dbConfig.mongodb.dbName);
    console.log('Connected to MongoDB');
  }
  return mongoDb;
}

// PostgreSQL query function
async function pgQuery(text, params) {
  const start = Date.now();
  try {
    const res = await pgPool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

// Close PostgreSQL connection
async function closePgConnection() {
  await pgPool.end();
}

// Close MongoDB connection
async function closeMongoConnection() {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
    mongoDb = null;
  }
}

// Get MongoDB collection
async function getCollection(collectionName) {
  const db = await connectMongo();
  return db.collection(collectionName);
}

module.exports = {
  // PostgreSQL functions
  pgQuery,
  pgPool,
  closePgConnection,
  
  // MongoDB functions
  connectMongo,
  getCollection,
  closeMongoConnection
};
