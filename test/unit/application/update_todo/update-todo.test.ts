import UpdateTodo, { UpdateTodoCommand } from '../../../../src/application/update_todo';
import { Todo, TodoRepository, TodoNotFoundError, TodoStatus } from '../../../../src/domain/todo';
import EventBus from '../../../../src/domain/event-bus';

describe('UpdateTodo use case', () => {
  const validId = '550e8400-e29b-41d4-a716-446655440000';
  const validTitle = 'Buy milk';

  const todoRepositoryMock: jest.Mocked<TodoRepository> = {
    findById: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const eventBusMock: jest.Mocked<EventBus> = {
    publish: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  };

  let updateTodo: UpdateTodo;

  beforeEach(() => {
    updateTodo = new UpdateTodo({
      todoRepository: todoRepositoryMock,
      eventBus: eventBusMock,
    });
    eventBusMock.publish.mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should update todo title', async () => {
    const todoMock = Todo.reconstitute({ id: validId, title: validTitle });
    todoRepositoryMock.findById.mockResolvedValue(todoMock);

    const command = new UpdateTodoCommand({
      id: validId,
      title: 'Buy oat milk',
    });

    const response = await updateTodo.execute(command);

    expect(todoRepositoryMock.findById).toHaveBeenCalledWith(validId);
    expect(todoRepositoryMock.update).toHaveBeenCalledTimes(1);
    expect(response.title).toBe('Buy oat milk');
  });

  test('should update todo description', async () => {
    const todoMock = Todo.reconstitute({ id: validId, title: validTitle });
    todoRepositoryMock.findById.mockResolvedValue(todoMock);

    const command = new UpdateTodoCommand({
      id: validId,
      description: 'New description',
    });

    const response = await updateTodo.execute(command);

    expect(todoRepositoryMock.update).toHaveBeenCalledTimes(1);
    expect(response.description).toBe('New description');
  });

  test('should mark todo as completed', async () => {
    const todoMock = Todo.reconstitute({ id: validId, title: validTitle });
    todoRepositoryMock.findById.mockResolvedValue(todoMock);

    const command = new UpdateTodoCommand({
      id: validId,
      status: TodoStatus.COMPLETED,
    });

    const response = await updateTodo.execute(command);

    expect(todoRepositoryMock.update).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(TodoStatus.COMPLETED);
  });

  test('should mark todo as pending', async () => {
    const todoMock = Todo.reconstitute({
      id: validId,
      title: validTitle,
      status: TodoStatus.COMPLETED,
    });
    todoRepositoryMock.findById.mockResolvedValue(todoMock);

    const command = new UpdateTodoCommand({
      id: validId,
      status: TodoStatus.PENDING,
    });

    const response = await updateTodo.execute(command);

    expect(todoRepositoryMock.update).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(TodoStatus.PENDING);
  });

  test('should throw TodoNotFoundError when todo does not exist', async () => {
    todoRepositoryMock.findById.mockResolvedValue(null);

    const command = new UpdateTodoCommand({
      id: validId,
      title: 'New title',
    });

    await expect(updateTodo.execute(command)).rejects.toThrow(TodoNotFoundError);
    expect(todoRepositoryMock.update).not.toHaveBeenCalled();
  });

  test('should publish domain events after updating', async () => {
    const todoMock = Todo.reconstitute({ id: validId, title: validTitle });
    todoRepositoryMock.findById.mockResolvedValue(todoMock);

    const command = new UpdateTodoCommand({
      id: validId,
      title: 'New title',
    });

    await updateTodo.execute(command);

    expect(eventBusMock.publish).toHaveBeenCalledTimes(1);
  });
});
