import { MongoClient, Db } from 'mongodb';
import config from '../../config';

export interface MongoDbHandlerDeps {
  mongoClient: typeof MongoClient;
}

export default class MongoDbHandler {
  private readonly mongoClient: typeof MongoClient;
  private client: MongoClient | null = null;
  private instance: Db | null = null;

  constructor({ mongoClient }: MongoDbHandlerDeps) {
    this.mongoClient = mongoClient;
  }

  private async connect(): Promise<Db> {
    try {
      this.client = await this.mongoClient.connect(config.mongo.uri);
      const db = this.client.db(config.mongo.dbName);

      await db.collection('todos').createIndex(
        { createdAt: -1 },
        { name: 'createdAt_desc' }
      );

      console.log(`Connected to MongoDB: ${config.mongo.dbName}`);
      return db;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  async getInstance(): Promise<Db> {
    if (!this.instance) {
      this.instance = await this.connect();
    }
    return this.instance;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.instance = null;
      console.log('Disconnected from MongoDB');
    }
  }
}
