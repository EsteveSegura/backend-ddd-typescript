import { createContainer, asValue, asClass, asFunction, InjectionMode } from 'awilix';
import { v4 as uuidv4 } from 'uuid';
import { MongoClient } from 'mongodb';

// Domain services
import { createIdGenerator } from './domain/services/id-generator';

// Infrastructure - Persistence
import MongoDbHandler from './infrastructure/persistence/mongo/mongo-db-handler';
import MongoTodoDocumentParser from './infrastructure/persistence/mongo/todo/mongo-todo-document-parser';
import MongoTodoRepository from './infrastructure/persistence/mongo/todo/mongo-todo-repository';

// Application - Use Cases
import CreateTodo from './application/create_todo';
import GetTodo from './application/get_todo';
import GetAllTodos from './application/get_all_todos';
import UpdateTodo from './application/update_todo';
import DeleteTodo from './application/delete_todo';

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  // External dependencies as values
  uuidv4: asValue(uuidv4),
  mongoClient: asValue(MongoClient),

  // Domain services
  idGenerator: asFunction(createIdGenerator).singleton(),

  // Infrastructure - Persistence (singletons for connection reuse)
  mongoDbHandler: asClass(MongoDbHandler).singleton(),
  todoDocumentParser: asClass(MongoTodoDocumentParser).singleton(),
  todoRepository: asClass(MongoTodoRepository).singleton(),

  // Application - Use Cases (singletons)
  createTodo: asClass(CreateTodo).singleton(),
  getTodo: asClass(GetTodo).singleton(),
  getAllTodos: asClass(GetAllTodos).singleton(),
  updateTodo: asClass(UpdateTodo).singleton(),
  deleteTodo: asClass(DeleteTodo).singleton(),
});

export default container;
