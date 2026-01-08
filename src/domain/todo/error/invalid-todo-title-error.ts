import ApplicationError from '../../application-error';

export default class InvalidTodoTitleError extends ApplicationError {
  constructor(context?: { title?: string }) {
    super('Todo title is required and must be a non-empty string', context);
  }
}
