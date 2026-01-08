import ApplicationError from '../../application-error';

export default class TodoNotFoundError extends ApplicationError {
  constructor(context?: { id?: string }) {
    super('Todo not found', context);
  }
}
