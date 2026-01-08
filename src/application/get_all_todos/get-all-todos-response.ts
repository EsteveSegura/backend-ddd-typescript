import { TodoObject } from '../../domain/todo';

export interface TodoItem {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export default class GetAllTodosResponse {
  public readonly items: TodoItem[];
  public readonly total: number;

  constructor(todos: TodoObject[]) {
    this.items = todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      status: todo.status,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    }));
    this.total = todos.length;
  }
}
