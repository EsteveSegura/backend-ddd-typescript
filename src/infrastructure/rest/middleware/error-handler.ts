import { Request, Response, NextFunction } from 'express';
import ApplicationError from '../../../domain/application-error';
import { HttpStatusCode } from '../http-status-code';

export interface ErrorResponse {
  error: string;
  message: string;
  context?: Record<string, unknown>;
}

export default function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err);

  if (err instanceof ApplicationError) {
    const response: ErrorResponse = {
      error: err.name,
      message: err.message,
    };

    if (err.context) {
      response.context = err.context;
    }

    res.status(HttpStatusCode.UNPROCESSABLE_ENTITY).json(response);
    return;
  }

  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
  });
}
