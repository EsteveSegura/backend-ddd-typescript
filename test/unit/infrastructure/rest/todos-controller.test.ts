import express, { Application } from 'express';
import request from 'supertest';
import { createContainer, asValue, AwilixContainer } from 'awilix';
import createTodosController from '../../../../src/infrastructure/rest/todos-controller';
import errorHandler from '../../../../src/infrastructure/rest/middleware/error-handler';
import { TodoNotFoundError, TodoStatus } from '../../../../src/domain/todo';

describe('TodosController', () => {
  const validId = '550e8400-e29b-41d4-a716-446655440000';
  const validTitle = 'Buy milk';
  const validDescription = 'From the store';
  const mockDate = new Date('2024-01-15T10:00:00.000Z');

  const mockTodoResponse = {
    id: validId,
    title: validTitle,
    description: validDescription,
    status: TodoStatus.PENDING,
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  const expectedJsonResponse = {
    id: validId,
    title: validTitle,
    description: validDescription,
    status: TodoStatus.PENDING,
    createdAt: mockDate.toISOString(),
    updatedAt: mockDate.toISOString(),
  };

  let app: Application;
  let container: AwilixContainer;

  const createTodoMock = { execute: jest.fn() };
  const getTodoMock = { execute: jest.fn() };
  const getAllTodosMock = { execute: jest.fn() };
  const updateTodoMock = { execute: jest.fn() };
  const deleteTodoMock = { execute: jest.fn() };

  beforeEach(() => {
    container = createContainer();
    container.register({
      createTodo: asValue(createTodoMock),
      getTodo: asValue(getTodoMock),
      getAllTodos: asValue(getAllTodosMock),
      updateTodo: asValue(updateTodoMock),
      deleteTodo: asValue(deleteTodoMock),
    });

    app = express();
    app.use(express.json());
    app.use('/api/v1/todos', createTodosController(container));
    app.use(errorHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/todos', () => {
    test('should return all todos with status 200', async () => {
      getAllTodosMock.execute.mockResolvedValue({ todos: [mockTodoResponse] });

      const { status, body } = await request(app).get('/api/v1/todos');

      expect(status).toBe(200);
      expect(body).toEqual({ todos: [expectedJsonResponse] });
      expect(getAllTodosMock.execute).toHaveBeenCalledTimes(1);
    });

    test('should return empty array when no todos', async () => {
      getAllTodosMock.execute.mockResolvedValue({ todos: [] });

      const { status, body } = await request(app).get('/api/v1/todos');

      expect(status).toBe(200);
      expect(body.todos).toEqual([]);
    });
  });

  describe('GET /api/v1/todos/:id', () => {
    test('should return todo with status 200', async () => {
      getTodoMock.execute.mockResolvedValue(mockTodoResponse);

      const { status, body } = await request(app).get(`/api/v1/todos/${validId}`);

      expect(status).toBe(200);
      expect(body).toEqual(expectedJsonResponse);
      expect(getTodoMock.execute).toHaveBeenCalledTimes(1);
    });

    test('should return 404 when todo not found', async () => {
      getTodoMock.execute.mockRejectedValue(new TodoNotFoundError({ id: validId }));

      const { status, body } = await request(app).get(`/api/v1/todos/${validId}`);

      expect(status).toBe(404);
      expect(body.error).toBe('TodoNotFound');
    });
  });

  describe('POST /api/v1/todos', () => {
    test('should create todo and return 201', async () => {
      createTodoMock.execute.mockResolvedValue(mockTodoResponse);

      const { status, body } = await request(app)
        .post('/api/v1/todos')
        .send({ title: validTitle, description: validDescription });

      expect(status).toBe(201);
      expect(body).toEqual(expectedJsonResponse);
      expect(createTodoMock.execute).toHaveBeenCalledTimes(1);
    });

    test('should create todo without description', async () => {
      const responseWithoutDesc = { ...mockTodoResponse, description: null };
      createTodoMock.execute.mockResolvedValue(responseWithoutDesc);

      const { status, body } = await request(app)
        .post('/api/v1/todos')
        .send({ title: validTitle });

      expect(status).toBe(201);
      expect(body.description).toBeNull();
    });

    test('should return 400 when title is empty', async () => {
      const { status, body } = await request(app)
        .post('/api/v1/todos')
        .send({ title: '' });

      expect(status).toBe(400);
      expect(body.error).toBe('ValidationError');
      expect(body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: expect.stringContaining('empty') }),
        ])
      );
    });

    test('should return 400 when title is missing', async () => {
      const { status, body } = await request(app)
        .post('/api/v1/todos')
        .send({});

      expect(status).toBe(400);
      expect(body.error).toBe('ValidationError');
    });
  });

  describe('PUT /api/v1/todos/:id', () => {
    test('should update todo and return 200', async () => {
      const updatedResponse = { ...mockTodoResponse, title: 'Buy oat milk' };
      updateTodoMock.execute.mockResolvedValue(updatedResponse);

      const { status, body } = await request(app)
        .put(`/api/v1/todos/${validId}`)
        .send({ title: 'Buy oat milk' });

      expect(status).toBe(200);
      expect(body.title).toBe('Buy oat milk');
      expect(updateTodoMock.execute).toHaveBeenCalledTimes(1);
    });

    test('should update todo status to COMPLETED', async () => {
      const completedResponse = { ...mockTodoResponse, status: TodoStatus.COMPLETED };
      updateTodoMock.execute.mockResolvedValue(completedResponse);

      const { status, body } = await request(app)
        .put(`/api/v1/todos/${validId}`)
        .send({ status: 'COMPLETED' });

      expect(status).toBe(200);
      expect(body.status).toBe(TodoStatus.COMPLETED);
    });

    test('should return 404 when todo not found', async () => {
      updateTodoMock.execute.mockRejectedValue(new TodoNotFoundError({ id: validId }));

      const { status, body } = await request(app)
        .put(`/api/v1/todos/${validId}`)
        .send({ title: 'New title' });

      expect(status).toBe(404);
      expect(body.error).toBe('TodoNotFound');
    });

    test('should return 400 when title is empty', async () => {
      const { status, body } = await request(app)
        .put(`/api/v1/todos/${validId}`)
        .send({ title: '' });

      expect(status).toBe(400);
      expect(body.error).toBe('ValidationError');
      expect(body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: expect.stringContaining('empty') }),
        ])
      );
    });

    test('should return 400 when id is invalid uuid', async () => {
      const { status, body } = await request(app)
        .put('/api/v1/todos/invalid-uuid')
        .send({ title: 'New title' });

      expect(status).toBe(400);
      expect(body.error).toBe('ValidationError');
    });
  });

  describe('DELETE /api/v1/todos/:id', () => {
    test('should delete todo and return 204', async () => {
      deleteTodoMock.execute.mockResolvedValue(undefined);

      const { status, body } = await request(app).delete(`/api/v1/todos/${validId}`);

      expect(status).toBe(204);
      expect(body).toEqual({});
      expect(deleteTodoMock.execute).toHaveBeenCalledTimes(1);
    });

    test('should return 404 when todo not found', async () => {
      deleteTodoMock.execute.mockRejectedValue(new TodoNotFoundError({ id: validId }));

      const { status, body } = await request(app).delete(`/api/v1/todos/${validId}`);

      expect(status).toBe(404);
      expect(body.error).toBe('TodoNotFound');
    });
  });
});
