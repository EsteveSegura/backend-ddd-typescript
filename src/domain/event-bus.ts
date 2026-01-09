import DomainEvent from './domain-event';

export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void>;

export default interface EventBus {
  publish(events: DomainEvent[]): Promise<void>;
  subscribe(eventName: string, handler: EventHandler): void;
  unsubscribe(eventName: string, handler: EventHandler): void;
}
