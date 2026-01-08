import { TodoRepository, TodoNotFoundError } from '../../domain/todo';
import GetTodoCommand from './get-todo-command';
import GetTodoResponse from './get-todo-response';

export { default as GetTodoCommand } from './get-todo-command';
export { default as GetTodoResponse } from './get-todo-response';

export interface GetTodoDeps {
  todoRepository: TodoRepository;
}

export default class GetTodo {
  private readonly todoRepository: TodoRepository;

  constructor({ todoRepository }: GetTodoDeps) {
    this.todoRepository = todoRepository;
  }

  async execute(command: GetTodoCommand): Promise<GetTodoResponse> {
    const todo = await this.todoRepository.findById(command.id);

    if (!todo) {
      throw new TodoNotFoundError({ id: command.id });
    }

    return new GetTodoResponse(todo.toObject());
  }
}
