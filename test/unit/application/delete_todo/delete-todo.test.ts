import DeleteTodo, { DeleteTodoCommand } from '../../../../src/application/delete_todo';
import { Todo, TodoRepository, TodoNotFoundError } from '../../../../src/domain/todo';

describe('DeleteTodo use case', () => {
  const validId = '550e8400-e29b-41d4-a716-446655440000';
  const validTitle = 'Buy milk';

  const todoRepositoryMock: jest.Mocked<TodoRepository> = {
    findById: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  let deleteTodo: DeleteTodo;

  beforeEach(() => {
    deleteTodo = new DeleteTodo({
      todoRepository: todoRepositoryMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should delete todo when found', async () => {
    const todoMock = new Todo({ id: validId, title: validTitle });
    todoRepositoryMock.findById.mockResolvedValue(todoMock);

    const command = new DeleteTodoCommand({ id: validId });
    await deleteTodo.execute(command);

    expect(todoRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(todoRepositoryMock.findById).toHaveBeenCalledWith(validId);
    expect(todoRepositoryMock.delete).toHaveBeenCalledTimes(1);
    expect(todoRepositoryMock.delete).toHaveBeenCalledWith(validId);
  });

  test('should throw TodoNotFoundError when todo does not exist', async () => {
    todoRepositoryMock.findById.mockResolvedValue(null);

    const command = new DeleteTodoCommand({ id: validId });

    await expect(deleteTodo.execute(command)).rejects.toThrow(TodoNotFoundError);
    expect(todoRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(todoRepositoryMock.delete).not.toHaveBeenCalled();
  });
});
