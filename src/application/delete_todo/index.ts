import { TodoRepository, TodoNotFoundError } from '../../domain/todo';
import DeleteTodoCommand from './delete-todo-command';

export { default as DeleteTodoCommand } from './delete-todo-command';

export interface DeleteTodoDeps {
  todoRepository: TodoRepository;
}

export default class DeleteTodo {
  private readonly todoRepository: TodoRepository;

  constructor({ todoRepository }: DeleteTodoDeps) {
    this.todoRepository = todoRepository;
  }

  async execute(command: DeleteTodoCommand): Promise<void> {
    const todo = await this.todoRepository.findById(command.id);

    if (!todo) {
      throw new TodoNotFoundError({ id: command.id });
    }

    await this.todoRepository.delete(command.id);
  }
}
