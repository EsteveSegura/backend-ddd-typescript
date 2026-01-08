export default class CreateTodoCommand {
  public readonly title: string;
  public readonly description?: string;

  constructor(props: { title: string; description?: string }) {
    this.title = props.title;
    this.description = props.description;
  }
}
