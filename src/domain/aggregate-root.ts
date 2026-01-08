import DomainEvent from './domain-event';

export default abstract class AggregateRoot {
  private _events: DomainEvent[] = [];

  protected addEvent(event: DomainEvent): void {
    this._events.push(event);
  }

  public getEvents(): DomainEvent[] {
    return [...this._events];
  }

  public clearEvents(): void {
    this._events = [];
  }
}
