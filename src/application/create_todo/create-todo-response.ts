import { TodoObject } from '../../domain/todo';

export default class CreateTodoResponse {
  public readonly id: string;
  public readonly title: string;
  public readonly description: string | null;
  public readonly status: string;
  public readonly createdAt: Date;

  constructor(todo: TodoObject) {
    this.id = todo.id;
    this.title = todo.title;
    this.description = todo.description;
    this.status = todo.status;
    this.createdAt = todo.createdAt;
  }
}
