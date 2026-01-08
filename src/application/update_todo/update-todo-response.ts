import { TodoObject } from '../../domain/todo';

export default class UpdateTodoResponse {
  public readonly id: string;
  public readonly title: string;
  public readonly description: string | null;
  public readonly status: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(todo: TodoObject) {
    this.id = todo.id;
    this.title = todo.title;
    this.description = todo.description;
    this.status = todo.status;
    this.createdAt = todo.createdAt;
    this.updatedAt = todo.updatedAt;
  }
}
