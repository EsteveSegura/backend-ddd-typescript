import { MongoClient, Db } from 'mongodb';
import config from '../../config';
import Logger from '../../logging/logger';

export interface MongoDbHandlerDeps {
  mongoClient: typeof MongoClient;
  logger: Logger;
}

export default class MongoDbHandler {
  private readonly mongoClient: typeof MongoClient;
  private readonly logger: Logger;
  private client: MongoClient | null = null;
  private instance: Db | null = null;

  constructor({ mongoClient, logger }: MongoDbHandlerDeps) {
    this.mongoClient = mongoClient;
    this.logger = logger;
  }

  private async connect(): Promise<Db> {
    try {
      this.client = await this.mongoClient.connect(config.mongo.uri);
      const db = this.client.db(config.mongo.dbName);

      await db.collection('todos').createIndex(
        { createdAt: -1 },
        { name: 'createdAt_desc' }
      );

      this.logger.info('Connected to MongoDB', { database: config.mongo.dbName });
      return db;
    } catch (error) {
      this.logger.error('Error connecting to MongoDB', error as Error);
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
      this.logger.info('Disconnected from MongoDB');
    }
  }
}
