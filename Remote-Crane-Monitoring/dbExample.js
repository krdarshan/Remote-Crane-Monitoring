
// Example of using the database connection

const { pgQuery, getCollection } = require('./database');

// PostgreSQL example - Get all crane alerts
async function getCraneAlertsSQL() {
  try {
    const query = 'SELECT * FROM alerts WHERE status = $1 ORDER BY created_at DESC';
    const params = ['active'];
    const result = await pgQuery(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
}

// MongoDB example - Get all crane alerts
async function getCraneAlertsMongoDB() {
  try {
    const alertsCollection = await getCollection('alerts');
    const alerts = await alertsCollection.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .toArray();
    return alerts;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
}

// Example schema creation for PostgreSQL
async function createSchemaSQL() {
  try {
    // Create users table
    await pgQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        requires_mfa BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create cranes table
    await pgQuery(`
      CREATE TABLE IF NOT EXISTS cranes (
        id SERIAL PRIMARY KEY,
        crane_id VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        last_maintenance TIMESTAMP,
        next_maintenance TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create alerts table
    await pgQuery(`
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        crane_id VARCHAR(50) REFERENCES cranes(crane_id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        severity VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        assigned_to INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database schema created successfully');
  } catch (error) {
    console.error('Error creating database schema:', error);
  }
}

// Example schema for MongoDB
// This could be used as a reference when creating your collections
const mongoSchema = {
  users: {
    username: String,
    email: String,
    password: String,
    role: String,
    requiresMfa: Boolean,
    createdAt: Date,
    updatedAt: Date
  },
  cranes: {
    craneId: String,
    name: String,
    location: String,
    status: String,
    lastMaintenance: Date,
    nextMaintenance: Date,
    createdAt: Date,
    updatedAt: Date
  },
  alerts: {
    craneId: String,
    title: String,
    description: String,
    severity: String,
    status: String,
    assignedTo: String,
    createdAt: Date,
    updatedAt: Date
  }
};

// Sample function to initialize MongoDB collections with validators
async function initMongoDBCollections() {
  try {
    const db = await connectMongo();
    
    // Create users collection with validation
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['username', 'email', 'password', 'role'],
          properties: {
            username: { bsonType: 'string' },
            email: { bsonType: 'string' },
            password: { bsonType: 'string' },
            role: { bsonType: 'string' },
            requiresMfa: { bsonType: 'bool' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' }
          }
        }
      }
    });
    
    // Create indexes for users collection
    const usersCollection = db.collection('users');
    await usersCollection.createIndex({ username: 1 }, { unique: true });
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    
    console.log('MongoDB collections initialized');
  } catch (error) {
    console.error('Error initializing MongoDB collections:', error);
  }
}

module.exports = {
  getCraneAlertsSQL,
  getCraneAlertsMongoDB,
  createSchemaSQL,
  initMongoDBCollections
};
