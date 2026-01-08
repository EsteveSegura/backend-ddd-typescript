import { TodoStatus } from '../../domain/todo';

export default class UpdateTodoCommand {
  public readonly id: string;
  public readonly title?: string;
  public readonly description?: string;
  public readonly status?: TodoStatus;

  constructor(props: {
    id: string;
    title?: string;
    description?: string;
    status?: TodoStatus;
  }) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.status = props.status;
  }
}
