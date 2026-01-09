import DomainEvent from '../../domain/domain-event';
import EventBus, { EventHandler } from '../../domain/event-bus';
import Logger from '../logging/logger';

export interface InMemoryEventBusDeps {
  logger: Logger;
}

export default class InMemoryEventBus implements EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private readonly logger: Logger;

  constructor({ logger }: InMemoryEventBusDeps) {
    this.logger = logger;
  }

  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const eventHandlers = this.handlers.get(event.name);

      this.logger.info('Publishing domain event', {
        eventName: event.name,
        eventData: event.data,
        occurredOn: event.occurredOn.toISOString(),
        handlersCount: eventHandlers?.size ?? 0,
      });

      if (!eventHandlers || eventHandlers.size === 0) {
        continue;
      }

      const handlerPromises = Array.from(eventHandlers).map(async (handler) => {
        try {
          await handler(event);
        } catch (error) {
          this.logger.error('Error executing event handler', error as Error, {
            eventName: event.name,
            eventData: event.data,
          });
        }
      });

      await Promise.all(handlerPromises);
    }
  }

  subscribe(eventName: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventName) ?? new Set();
    handlers.add(handler);
    this.handlers.set(eventName, handlers);

    this.logger.debug('Event handler subscribed', { eventName });
  }

  unsubscribe(eventName: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventName);
    if (handlers) {
      handlers.delete(handler);
      this.logger.debug('Event handler unsubscribed', { eventName });
    }
  }
}
