import { TodoRepository, TodoNotFoundError, TodoStatus } from '../../domain/todo';
import UpdateTodoCommand from './update-todo-command';
import UpdateTodoResponse from './update-todo-response';

export { default as UpdateTodoCommand } from './update-todo-command';
export { default as UpdateTodoResponse } from './update-todo-response';

export interface UpdateTodoDeps {
  todoRepository: TodoRepository;
}

export default class UpdateTodo {
  private readonly todoRepository: TodoRepository;

  constructor({ todoRepository }: UpdateTodoDeps) {
    this.todoRepository = todoRepository;
  }

  async execute(command: UpdateTodoCommand): Promise<UpdateTodoResponse> {
    const todo = await this.todoRepository.findById(command.id);

    if (!todo) {
      throw new TodoNotFoundError({ id: command.id });
    }

    if (command.title !== undefined || command.description !== undefined) {
      todo.update({
        title: command.title,
        description: command.description,
      });
    }

    if (command.status !== undefined) {
      if (command.status === TodoStatus.COMPLETED) {
        todo.complete();
      } else if (command.status === TodoStatus.PENDING) {
        todo.markPending();
      }
    }

    await this.todoRepository.update(todo);

    return new UpdateTodoResponse(todo.toObject());
  }
}
