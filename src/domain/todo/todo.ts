import { validate as uuidValidate } from 'uuid';
import AggregateRoot from '../aggregate-root';
import { InvalidTodoIdError, InvalidTodoTitleError } from './error';

export enum TodoStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export interface TodoProps {
  id: string;
  title: string;
  description?: string;
  status?: TodoStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TodoObject {
  id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
}

export default class Todo extends AggregateRoot {
  private _id!: string;
  private _title!: string;
  private _description: string | null = null;
  private _status: TodoStatus = TodoStatus.PENDING;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: TodoProps) {
    super();
    this.id = props.id;
    this.title = props.title;
    this._description = props.description ?? null;
    this._status = props.status ?? TodoStatus.PENDING;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    if (!value || !uuidValidate(value)) {
      throw new InvalidTodoIdError({ id: value });
    }
    this._id = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    const trimmed = value?.trim();
    if (!trimmed) {
      throw new InvalidTodoTitleError({ title: value });
    }
    this._title = trimmed;
  }

  get description(): string | null {
    return this._description;
  }

  set description(value: string | null) {
    this._description = value?.trim() || null;
  }

  get status(): TodoStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public complete(): void {
    if (this._status === TodoStatus.COMPLETED) return;
    this._status = TodoStatus.COMPLETED;
    this._updatedAt = new Date();
  }

  public markPending(): void {
    if (this._status === TodoStatus.PENDING) return;
    this._status = TodoStatus.PENDING;
    this._updatedAt = new Date();
  }

  public update(props: { title?: string; description?: string }): void {
    if (props.title !== undefined) {
      this.title = props.title;
    }
    if (props.description !== undefined) {
      this.description = props.description;
    }
    this._updatedAt = new Date();
  }

  public isCompleted(): boolean {
    return this._status === TodoStatus.COMPLETED;
  }

  public isPending(): boolean {
    return this._status === TodoStatus.PENDING;
  }

  public toObject(): TodoObject {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
