import { Todo, TodoRepository } from '../../domain/todo';
import { IdGenerator } from '../../domain/services/id-generator';
import CreateTodoCommand from './create-todo-command';
import CreateTodoResponse from './create-todo-response';

export { default as CreateTodoCommand } from './create-todo-command';
export { default as CreateTodoResponse } from './create-todo-response';

export interface CreateTodoDeps {
  todoRepository: TodoRepository;
  idGenerator: IdGenerator;
}

export default class CreateTodo {
  private readonly todoRepository: TodoRepository;
  private readonly idGenerator: IdGenerator;

  constructor({ todoRepository, idGenerator }: CreateTodoDeps) {
    this.todoRepository = todoRepository;
    this.idGenerator = idGenerator;
  }

  async execute(command: CreateTodoCommand): Promise<CreateTodoResponse> {
    const todo = new Todo({
      id: this.idGenerator.generate(),
      title: command.title,
      description: command.description,
    });

    await this.todoRepository.save(todo);

    return new CreateTodoResponse(todo.toObject());
  }
}
