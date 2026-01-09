import DomainEvent from '../../domain-event';

export interface TodoUpdateChanges {
  title?: string;
  description?: string | null;
}

export default class TodoUpdatedEvent implements DomainEvent {
  readonly name = 'todo.updated';
  readonly occurredOn: Date;
  readonly data: Record<string, unknown>;

  constructor(todoId: string, changes: TodoUpdateChanges) {
    this.occurredOn = new Date();
    this.data = {
      todoId,
      changes,
    };
  }
}
