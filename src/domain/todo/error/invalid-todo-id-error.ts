import ApplicationError from '../../application-error';

export default class InvalidTodoIdError extends ApplicationError {
  constructor(context?: { id?: string }) {
    super('Invalid todo ID', context);
  }
}
