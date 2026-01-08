import { TodoRepository } from '../../domain/todo';
import GetAllTodosResponse from './get-all-todos-response';

export { default as GetAllTodosResponse } from './get-all-todos-response';

export interface GetAllTodosDeps {
  todoRepository: TodoRepository;
}

export default class GetAllTodos {
  private readonly todoRepository: TodoRepository;

  constructor({ todoRepository }: GetAllTodosDeps) {
    this.todoRepository = todoRepository;
  }

  async execute(): Promise<GetAllTodosResponse> {
    const todos = await this.todoRepository.findAll();
    return new GetAllTodosResponse(todos.map((t) => t.toObject()));
  }
}
