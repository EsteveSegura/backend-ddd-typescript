import GetTodo, { GetTodoCommand } from '../../../../src/application/get_todo';
import { Todo, TodoRepository, TodoNotFoundError } from '../../../../src/domain/todo';

describe('GetTodo use case', () => {
  const validId = '550e8400-e29b-41d4-a716-446655440000';
  const validTitle = 'Buy milk';

  const todoRepositoryMock: jest.Mocked<TodoRepository> = {
    findById: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  let getTodo: GetTodo;

  beforeEach(() => {
    getTodo = new GetTodo({
      todoRepository: todoRepositoryMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return todo when found', async () => {
    const todoMock = new Todo({ id: validId, title: validTitle });
    todoRepositoryMock.findById.mockResolvedValue(todoMock);

    const command = new GetTodoCommand({ id: validId });
    const response = await getTodo.execute(command);

    expect(todoRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(todoRepositoryMock.findById).toHaveBeenCalledWith(validId);
    expect(response.id).toBe(validId);
    expect(response.title).toBe(validTitle);
  });

  test('should throw TodoNotFoundError when todo does not exist', async () => {
    todoRepositoryMock.findById.mockResolvedValue(null);

    const command = new GetTodoCommand({ id: validId });

    await expect(getTodo.execute(command)).rejects.toThrow(TodoNotFoundError);
    expect(todoRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(todoRepositoryMock.findById).toHaveBeenCalledWith(validId);
  });
});
