import CreateTodo, { CreateTodoCommand } from '../../../../src/application/create_todo';
import { TodoRepository } from '../../../../src/domain/todo';
import { IdGenerator } from '../../../../src/domain/services/id-generator';
import EventBus from '../../../../src/domain/event-bus';

describe('CreateTodo use case', () => {
  const validId = '550e8400-e29b-41d4-a716-446655440000';
  const validTitle = 'Buy milk';
  const validDescription = 'From the store';

  const todoRepositoryMock: jest.Mocked<TodoRepository> = {
    findById: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const idGeneratorMock: jest.Mocked<IdGenerator> = {
    generate: jest.fn(),
  };

  const eventBusMock: jest.Mocked<EventBus> = {
    publish: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  };

  let createTodo: CreateTodo;

  beforeEach(() => {
    createTodo = new CreateTodo({
      todoRepository: todoRepositoryMock,
      idGenerator: idGeneratorMock,
      eventBus: eventBusMock,
    });
    idGeneratorMock.generate.mockReturnValue(validId);
    eventBusMock.publish.mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a todo and return response', async () => {
    const command = new CreateTodoCommand({
      title: validTitle,
      description: validDescription,
    });

    const response = await createTodo.execute(command);

    expect(idGeneratorMock.generate).toHaveBeenCalledTimes(1);
    expect(todoRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(response.id).toBe(validId);
    expect(response.title).toBe(validTitle);
    expect(response.description).toBe(validDescription);
    expect(response.status).toBe('PENDING');
  });

  test('should create a todo without description', async () => {
    const command = new CreateTodoCommand({
      title: validTitle,
    });

    const response = await createTodo.execute(command);

    expect(todoRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(response.title).toBe(validTitle);
    expect(response.description).toBeNull();
  });

  test('should call repository save with correct todo', async () => {
    const command = new CreateTodoCommand({
      title: validTitle,
      description: validDescription,
    });

    await createTodo.execute(command);

    expect(todoRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: validId,
        _title: validTitle,
        _description: validDescription,
      })
    );
  });

  test('should publish domain events after saving', async () => {
    const command = new CreateTodoCommand({
      title: validTitle,
      description: validDescription,
    });

    await createTodo.execute(command);

    expect(eventBusMock.publish).toHaveBeenCalledTimes(1);
    expect(eventBusMock.publish).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'todo.created',
          data: expect.objectContaining({
            todoId: validId,
            title: validTitle,
          }),
        }),
      ])
    );
  });
});
