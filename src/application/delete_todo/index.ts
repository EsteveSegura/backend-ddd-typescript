import { TodoRepository, TodoNotFoundError, TodoDeletedEvent } from '../../domain/todo';
import EventBus from '../../domain/event-bus';
import DeleteTodoCommand from './delete-todo-command';

export { default as DeleteTodoCommand } from './delete-todo-command';

export interface DeleteTodoDeps {
  todoRepository: TodoRepository;
  eventBus: EventBus;
}

export default class DeleteTodo {
  private readonly todoRepository: TodoRepository;
  private readonly eventBus: EventBus;

  constructor({ todoRepository, eventBus }: DeleteTodoDeps) {
    this.todoRepository = todoRepository;
    this.eventBus = eventBus;
  }

  async execute(command: DeleteTodoCommand): Promise<void> {
    const todo = await this.todoRepository.findById(command.id);

    if (!todo) {
      throw new TodoNotFoundError({ id: command.id });
    }

    await this.todoRepository.delete(command.id);
    await this.eventBus.publish([new TodoDeletedEvent(command.id)]);
  }
}
