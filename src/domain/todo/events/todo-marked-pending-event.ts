import DomainEvent from '../../domain-event';

export default class TodoMarkedPendingEvent implements DomainEvent {
  readonly name = 'todo.marked_pending';
  readonly occurredOn: Date;
  readonly data: Record<string, unknown>;

  constructor(todoId: string, markedAt: Date) {
    this.occurredOn = new Date();
    this.data = {
      todoId,
      markedAt: markedAt.toISOString(),
    };
  }
}
