import { UUID } from 'mongodb';
import MongoTodoDocumentParser from '../../../../../src/infrastructure/persistence/mongo/todo/mongo-todo-document-parser';
import { Todo, TodoStatus } from '../../../../../src/domain/todo';
import { TodoDocument } from '../../../../../src/infrastructure/persistence/mongo/todo/todo-document';

describe('MongoTodoDocumentParser', () => {
  const validId = '550e8400-e29b-41d4-a716-446655440000';
  const validTitle = 'Buy milk';
  const validDescription = 'From the store';
  const mockDate = new Date('2024-01-15T10:00:00.000Z');

  let parser: MongoTodoDocumentParser;

  beforeEach(() => {
    parser = new MongoTodoDocumentParser();
  });

  describe('toDocument', () => {
    test('should convert domain to document', () => {
      const todo = Todo.reconstitute({
        id: validId,
        title: validTitle,
        description: validDescription,
        status: TodoStatus.PENDING,
        createdAt: mockDate,
        updatedAt: mockDate,
      });

      const document = parser.toDocument(todo);

      expect(document._id.toString()).toBe(validId);
      expect(document.title).toBe(validTitle);
      expect(document.description).toBe(validDescription);
      expect(document.status).toBe(TodoStatus.PENDING);
      expect(document.createdAt).toEqual(mockDate);
      expect(document.updatedAt).toEqual(mockDate);
    });

    test('should convert domain with null description', () => {
      const todo = Todo.reconstitute({
        id: validId,
        title: validTitle,
        createdAt: mockDate,
        updatedAt: mockDate,
      });

      const document = parser.toDocument(todo);

      expect(document.description).toBeNull();
    });

    test('should convert completed todo', () => {
      const todo = Todo.reconstitute({
        id: validId,
        title: validTitle,
        status: TodoStatus.COMPLETED,
        createdAt: mockDate,
        updatedAt: mockDate,
      });

      const document = parser.toDocument(todo);

      expect(document.status).toBe(TodoStatus.COMPLETED);
    });
  });

  describe('toDomain', () => {
    test('should convert document to domain', () => {
      const document: TodoDocument = {
        _id: new UUID(validId),
        title: validTitle,
        description: validDescription,
        status: TodoStatus.PENDING,
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      const todo = parser.toDomain(document);

      expect(todo.id).toBe(validId);
      expect(todo.title).toBe(validTitle);
      expect(todo.description).toBe(validDescription);
      expect(todo.status).toBe(TodoStatus.PENDING);
      expect(todo.createdAt).toEqual(mockDate);
      expect(todo.updatedAt).toEqual(mockDate);
    });

    test('should convert document with null description', () => {
      const document: TodoDocument = {
        _id: new UUID(validId),
        title: validTitle,
        description: null,
        status: TodoStatus.PENDING,
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      const todo = parser.toDomain(document);

      expect(todo.description).toBeNull();
    });

    test('should convert completed document', () => {
      const document: TodoDocument = {
        _id: new UUID(validId),
        title: validTitle,
        description: null,
        status: TodoStatus.COMPLETED,
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      const todo = parser.toDomain(document);

      expect(todo.status).toBe(TodoStatus.COMPLETED);
      expect(todo.isCompleted()).toBe(true);
    });
  });

  describe('round-trip conversion', () => {
    test('should preserve data through domain -> document -> domain', () => {
      const originalTodo = Todo.reconstitute({
        id: validId,
        title: validTitle,
        description: validDescription,
        status: TodoStatus.COMPLETED,
        createdAt: mockDate,
        updatedAt: mockDate,
      });

      const document = parser.toDocument(originalTodo);
      const restoredTodo = parser.toDomain(document);

      expect(restoredTodo.id).toBe(originalTodo.id);
      expect(restoredTodo.title).toBe(originalTodo.title);
      expect(restoredTodo.description).toBe(originalTodo.description);
      expect(restoredTodo.status).toBe(originalTodo.status);
      expect(restoredTodo.createdAt).toEqual(originalTodo.createdAt);
      expect(restoredTodo.updatedAt).toEqual(originalTodo.updatedAt);
    });
  });
});
