import { Todo, TodoRepository } from '../../domain/todo';
import { IdGenerator } from '../../domain/services/id-generator';
import EventBus from '../../domain/event-bus';
import CreateTodoCommand from './create-todo-command';
import CreateTodoResponse from './create-todo-response';

export { default as CreateTodoCommand } from './create-todo-command';
export { default as CreateTodoResponse } from './create-todo-response';

export interface CreateTodoDeps {
  todoRepository: TodoRepository;
  idGenerator: IdGenerator;
  eventBus: EventBus;
}

export default class CreateTodo {
  private readonly todoRepository: TodoRepository;
  private readonly idGenerator: IdGenerator;
  private readonly eventBus: EventBus;

  constructor({ todoRepository, idGenerator, eventBus }: CreateTodoDeps) {
    this.todoRepository = todoRepository;
    this.idGenerator = idGenerator;
    this.eventBus = eventBus;
  }

  async execute(command: CreateTodoCommand): Promise<CreateTodoResponse> {
    const todo = Todo.create({
      id: this.idGenerator.generate(),
      title: command.title,
      description: command.description,
    });

    await this.todoRepository.save(todo);
    await this.eventBus.publish(todo.getEvents());
    todo.clearEvents();

    return new CreateTodoResponse(todo.toObject());
  }
}
