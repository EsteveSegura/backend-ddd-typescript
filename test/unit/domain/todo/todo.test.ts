import Todo, { TodoStatus } from '../../../../src/domain/todo/todo';
import { InvalidTodoIdError, InvalidTodoTitleError } from '../../../../src/domain/todo/error';
import { TodoCreatedEvent, TodoCompletedEvent, TodoUpdatedEvent, TodoMarkedPendingEvent } from '../../../../src/domain/todo/events';

describe('Todo domain entity', () => {
  const validId = '550e8400-e29b-41d4-a716-446655440000';
  const validTitle = 'Buy milk';
  const validDescription = 'From the store';

  const MOCK_DATE_STRING = '2024-01-15T10:00:00.000Z';
  const mockDate = new Date(MOCK_DATE_STRING);

  beforeEach(() => {
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    test('should create a todo with valid properties', () => {
      const todo = Todo.create({
        id: validId,
        title: validTitle,
        description: validDescription,
      });

      expect(todo.id).toBe(validId);
      expect(todo.title).toBe(validTitle);
      expect(todo.description).toBe(validDescription);
      expect(todo.status).toBe(TodoStatus.PENDING);
      expect(todo.createdAt).toEqual(mockDate);
      expect(todo.updatedAt).toEqual(mockDate);
    });

    test('should create a todo with default values', () => {
      const todo = Todo.create({
        id: validId,
        title: validTitle,
      });

      expect(todo.description).toBeNull();
      expect(todo.status).toBe(TodoStatus.PENDING);
    });

    test('should throw InvalidTodoIdError when creating without id', () => {
      expect(() => {
        Todo.create({ id: '', title: validTitle });
      }).toThrow(InvalidTodoIdError);
    });

    test('should throw InvalidTodoIdError when creating with invalid uuid', () => {
      expect(() => {
        Todo.create({ id: 'invalid-uuid', title: validTitle });
      }).toThrow(InvalidTodoIdError);
    });

    test('should throw InvalidTodoTitleError when creating without title', () => {
      expect(() => {
        Todo.create({ id: validId, title: '' });
      }).toThrow(InvalidTodoTitleError);
    });

    test('should throw InvalidTodoTitleError when creating with whitespace only title', () => {
      expect(() => {
        Todo.create({ id: validId, title: '   ' });
      }).toThrow(InvalidTodoTitleError);
    });

    test('should trim title on creation', () => {
      const todo = Todo.create({
        id: validId,
        title: '  Buy milk  ',
      });

      expect(todo.title).toBe('Buy milk');
    });

    test('should emit TodoCreatedEvent on creation', () => {
      const todo = Todo.create({
        id: validId,
        title: validTitle,
        description: validDescription,
      });

      const events = todo.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TodoCreatedEvent);
      expect(events[0].name).toBe('todo.created');
      expect(events[0].data).toEqual({
        todoId: validId,
        title: validTitle,
        description: validDescription,
      });
    });
  });

  describe('reconstitute', () => {
    test('should reconstitute a todo without emitting events', () => {
      const todo = Todo.reconstitute({
        id: validId,
        title: validTitle,
        description: validDescription,
        status: TodoStatus.COMPLETED,
      });

      expect(todo.id).toBe(validId);
      expect(todo.status).toBe(TodoStatus.COMPLETED);
      expect(todo.getEvents()).toHaveLength(0);
    });
  });

  describe('complete', () => {
    test('should mark todo as completed', () => {
      const todo = Todo.reconstitute({ id: validId, title: validTitle });

      todo.complete();

      expect(todo.status).toBe(TodoStatus.COMPLETED);
      expect(todo.isCompleted()).toBe(true);
      expect(todo.isPending()).toBe(false);
    });

    test('should emit TodoCompletedEvent when completing', () => {
      const todo = Todo.reconstitute({ id: validId, title: validTitle });

      todo.complete();

      const events = todo.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TodoCompletedEvent);
      expect(events[0].name).toBe('todo.completed');
    });

    test('should not change status or emit event if already completed', () => {
      const todo = Todo.reconstitute({
        id: validId,
        title: validTitle,
        status: TodoStatus.COMPLETED,
      });

      todo.complete();

      expect(todo.status).toBe(TodoStatus.COMPLETED);
      expect(todo.getEvents()).toHaveLength(0);
    });
  });

  describe('markPending', () => {
    test('should mark todo as pending', () => {
      const todo = Todo.reconstitute({
        id: validId,
        title: validTitle,
        status: TodoStatus.COMPLETED,
      });

      todo.markPending();

      expect(todo.status).toBe(TodoStatus.PENDING);
      expect(todo.isPending()).toBe(true);
      expect(todo.isCompleted()).toBe(false);
    });

    test('should emit TodoMarkedPendingEvent when marking pending', () => {
      const todo = Todo.reconstitute({
        id: validId,
        title: validTitle,
        status: TodoStatus.COMPLETED,
      });

      todo.markPending();

      const events = todo.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TodoMarkedPendingEvent);
      expect(events[0].name).toBe('todo.marked_pending');
    });

    test('should not change status or emit event if already pending', () => {
      const todo = Todo.reconstitute({ id: validId, title: validTitle });

      todo.markPending();

      expect(todo.status).toBe(TodoStatus.PENDING);
      expect(todo.getEvents()).toHaveLength(0);
    });
  });

  describe('update', () => {
    test('should update title', () => {
      const todo = Todo.reconstitute({ id: validId, title: validTitle });

      todo.update({ title: 'Buy oat milk' });

      expect(todo.title).toBe('Buy oat milk');
    });

    test('should update description', () => {
      const todo = Todo.reconstitute({ id: validId, title: validTitle });

      todo.update({ description: 'New description' });

      expect(todo.description).toBe('New description');
    });

    test('should update both title and description', () => {
      const todo = Todo.reconstitute({ id: validId, title: validTitle });

      todo.update({ title: 'New title', description: 'New description' });

      expect(todo.title).toBe('New title');
      expect(todo.description).toBe('New description');
    });

    test('should emit TodoUpdatedEvent when updating', () => {
      const todo = Todo.reconstitute({ id: validId, title: validTitle });

      todo.update({ title: 'New title', description: 'New description' });

      const events = todo.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TodoUpdatedEvent);
      expect(events[0].name).toBe('todo.updated');
      expect(events[0].data).toEqual({
        todoId: validId,
        changes: {
          title: 'New title',
          description: 'New description',
        },
      });
    });

    test('should throw InvalidTodoTitleError when updating with empty title', () => {
      const todo = Todo.reconstitute({ id: validId, title: validTitle });

      expect(() => {
        todo.update({ title: '' });
      }).toThrow(InvalidTodoTitleError);
    });
  });

  describe('toObject', () => {
    test('should return plain object representation', () => {
      const todo = Todo.reconstitute({
        id: validId,
        title: validTitle,
        description: validDescription,
        status: TodoStatus.COMPLETED,
      });

      const result = todo.toObject();

      expect(result).toEqual({
        id: validId,
        title: validTitle,
        description: validDescription,
        status: TodoStatus.COMPLETED,
        createdAt: mockDate,
        updatedAt: mockDate,
      });
    });
  });
});
