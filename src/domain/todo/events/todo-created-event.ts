import DomainEvent from '../../domain-event';

export default class TodoCreatedEvent implements DomainEvent {
  readonly name = 'todo.created';
  readonly occurredOn: Date;
  readonly data: Record<string, unknown>;

  constructor(todoId: string, title: string, description: string | null) {
    this.occurredOn = new Date();
    this.data = {
      todoId,
      title,
      description,
    };
  }
}
