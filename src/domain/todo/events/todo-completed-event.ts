import DomainEvent from '../../domain-event';

export default class TodoCompletedEvent implements DomainEvent {
  readonly name = 'todo.completed';
  readonly occurredOn: Date;
  readonly data: Record<string, unknown>;

  constructor(todoId: string, completedAt: Date) {
    this.occurredOn = new Date();
    this.data = {
      todoId,
      completedAt: completedAt.toISOString(),
    };
  }
}
