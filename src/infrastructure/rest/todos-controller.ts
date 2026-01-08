import { Router, Request, Response, NextFunction } from 'express';
import { AwilixContainer } from 'awilix';
import { HttpStatusCode } from './http-status-code';
import { TodoNotFoundError, InvalidTodoIdError, InvalidTodoTitleError, TodoStatus } from '../../domain/todo';
import CreateTodo, { CreateTodoCommand } from '../../application/create_todo';
import GetTodo, { GetTodoCommand } from '../../application/get_todo';
import GetAllTodos from '../../application/get_all_todos';
import UpdateTodo, { UpdateTodoCommand } from '../../application/update_todo';
import DeleteTodo, { DeleteTodoCommand } from '../../application/delete_todo';

export default function createTodosController(container: AwilixContainer): Router {
  const router = Router();

  // GET /todos - Get all todos
  router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const getAllTodos = container.resolve<GetAllTodos>('getAllTodos');
      const response = await getAllTodos.execute();
      res.status(HttpStatusCode.OK).json(response);
    } catch (err) {
      next(err);
    }
  });

  // GET /todos/:id - Get todo by ID
  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const command = new GetTodoCommand({ id });
      const getTodo = container.resolve<GetTodo>('getTodo');
      const response = await getTodo.execute(command);
      res.status(HttpStatusCode.OK).json(response);
    } catch (err) {
      if (err instanceof TodoNotFoundError) {
        res.status(HttpStatusCode.NOT_FOUND).json({
          error: 'TodoNotFound',
          message: err.message,
          context: err.context,
        });
        return;
      }
      if (err instanceof InvalidTodoIdError) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          error: 'InvalidTodoId',
          message: err.message,
          context: err.context,
        });
        return;
      }
      next(err);
    }
  });

  // POST /todos - Create a new todo
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description } = req.body;
      const command = new CreateTodoCommand({ title, description });
      const createTodo = container.resolve<CreateTodo>('createTodo');
      const response = await createTodo.execute(command);
      res.status(HttpStatusCode.CREATED).json(response);
    } catch (err) {
      if (err instanceof InvalidTodoTitleError) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          error: 'InvalidTodoTitle',
          message: err.message,
          context: err.context,
        });
        return;
      }
      next(err);
    }
  });

  // PUT /todos/:id - Update a todo
  router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title, description, status } = req.body;

      const validStatus = status
        ? Object.values(TodoStatus).includes(status)
          ? (status as TodoStatus)
          : undefined
        : undefined;

      const command = new UpdateTodoCommand({
        id,
        title,
        description,
        status: validStatus,
      });

      const updateTodo = container.resolve<UpdateTodo>('updateTodo');
      const response = await updateTodo.execute(command);
      res.status(HttpStatusCode.OK).json(response);
    } catch (err) {
      if (err instanceof TodoNotFoundError) {
        res.status(HttpStatusCode.NOT_FOUND).json({
          error: 'TodoNotFound',
          message: err.message,
          context: err.context,
        });
        return;
      }
      if (err instanceof InvalidTodoIdError) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          error: 'InvalidTodoId',
          message: err.message,
          context: err.context,
        });
        return;
      }
      if (err instanceof InvalidTodoTitleError) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          error: 'InvalidTodoTitle',
          message: err.message,
          context: err.context,
        });
        return;
      }
      next(err);
    }
  });

  // DELETE /todos/:id - Delete a todo
  router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const command = new DeleteTodoCommand({ id });
      const deleteTodo = container.resolve<DeleteTodo>('deleteTodo');
      await deleteTodo.execute(command);
      res.status(HttpStatusCode.NO_CONTENT).send();
    } catch (err) {
      if (err instanceof TodoNotFoundError) {
        res.status(HttpStatusCode.NOT_FOUND).json({
          error: 'TodoNotFound',
          message: err.message,
          context: err.context,
        });
        return;
      }
      if (err instanceof InvalidTodoIdError) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          error: 'InvalidTodoId',
          message: err.message,
          context: err.context,
        });
        return;
      }
      next(err);
    }
  });

  return router;
}
