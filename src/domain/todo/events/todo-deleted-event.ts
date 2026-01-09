import DomainEvent from '../../domain-event';

export default class TodoDeletedEvent implements DomainEvent {
  readonly name = 'todo.deleted';
  readonly occurredOn: Date;
  readonly data: Record<string, unknown>;

  constructor(todoId: string) {
    this.occurredOn = new Date();
    this.data = {
      todoId,
    };
  }
}
