import { Request, Response, NextFunction } from 'express';
import ApplicationError from '../../../domain/application-error';
import { HttpStatusCode } from '../http-status-code';

export interface ErrorResponse {
  error: string;
  message: string;
  context?: Record<string, unknown>;
  requestId?: string;
}

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const logger = req.logger;

  if (err instanceof ApplicationError) {
    const response: ErrorResponse = {
      error: err.name,
      message: err.message,
      requestId: req.requestId,
    };

    if (err.context) {
      response.context = err.context;
    }

    logger?.warn('Application error occurred', {
      error: err.name,
      message: err.message,
      context: err.context,
    });

    res.status(HttpStatusCode.UNPROCESSABLE_ENTITY).json(response);
    return;
  }

  logger?.error('Unexpected error occurred', err, {
    stack: err.stack,
  });

  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
    requestId: req.requestId,
  });
}
