import { UUID } from 'mongodb';
import { Todo, TodoRepository } from '../../../../domain/todo';
import MongoDbHandler from '../mongo-db-handler';
import MongoTodoDocumentParser from './mongo-todo-document-parser';
import { TodoDocument } from './todo-document';

const COLLECTION_NAME = 'todos';

export interface MongoTodoRepositoryDeps {
  mongoDbHandler: MongoDbHandler;
  todoDocumentParser: MongoTodoDocumentParser;
}

export default class MongoTodoRepository implements TodoRepository {
  private readonly mongoDbHandler: MongoDbHandler;
  private readonly todoDocumentParser: MongoTodoDocumentParser;

  constructor({ mongoDbHandler, todoDocumentParser }: MongoTodoRepositoryDeps) {
    this.mongoDbHandler = mongoDbHandler;
    this.todoDocumentParser = todoDocumentParser;
  }

  async findById(id: string): Promise<Todo | null> {
    const db = await this.mongoDbHandler.getInstance();
    const document = await db
      .collection<TodoDocument>(COLLECTION_NAME)
      .findOne({ _id: new UUID(id) });

    return document ? this.todoDocumentParser.toDomain(document) : null;
  }

  async findAll(): Promise<Todo[]> {
    const db = await this.mongoDbHandler.getInstance();
    const documents = await db
      .collection<TodoDocument>(COLLECTION_NAME)
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return documents.map((doc) => this.todoDocumentParser.toDomain(doc));
  }

  async save(todo: Todo): Promise<void> {
    const db = await this.mongoDbHandler.getInstance();
    const document = this.todoDocumentParser.toDocument(todo);
    await db.collection<TodoDocument>(COLLECTION_NAME).insertOne(document);
  }

  async update(todo: Todo): Promise<void> {
    const db = await this.mongoDbHandler.getInstance();
    const document = this.todoDocumentParser.toDocument(todo);
    await db
      .collection<TodoDocument>(COLLECTION_NAME)
      .replaceOne({ _id: new UUID(todo.id) }, document);
  }

  async delete(id: string): Promise<void> {
    const db = await this.mongoDbHandler.getInstance();
    await db
      .collection<TodoDocument>(COLLECTION_NAME)
      .deleteOne({ _id: new UUID(id) });
  }
}
