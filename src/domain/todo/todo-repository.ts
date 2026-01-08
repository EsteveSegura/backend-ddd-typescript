import Todo from './todo';

export default interface TodoRepository {
  findById(id: string): Promise<Todo | null>;
  findAll(): Promise<Todo[]>;
  save(todo: Todo): Promise<void>;
  update(todo: Todo): Promise<void>;
  delete(id: string): Promise<void>;
}
