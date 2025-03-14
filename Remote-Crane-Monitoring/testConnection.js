
const { connectMongo, closeMongoConnection } = require('./database');

async function testConnection() {
  try {
    const db = await connectMongo();
    console.log('Successfully connected to MongoDB!');
    console.log('Database name:', db.databaseName);
    await closeMongoConnection();
    console.log('Connection closed successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

testConnection();
