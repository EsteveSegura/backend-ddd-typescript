export default interface DomainEvent {
  readonly name: string;
  readonly occurredOn: Date;
  readonly data: Record<string, unknown>;
}
