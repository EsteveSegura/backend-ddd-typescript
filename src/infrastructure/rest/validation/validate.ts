import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { HttpStatusCode } from '../http-status-code';

export interface ValidationErrorResponse {
  error: string;
  message: string;
  details: Array<{
    field: string;
    message: string;
  }>;
  requestId?: string;
}

type ValidationTarget = 'body' | 'params' | 'query';

export function validate<T>(schema: ZodSchema<T>, target: ValidationTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const dataToValidate = req[target];

    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      const issues = result.error.issues || [];
      const details = issues.map((issue) => ({
        field: String(issue.path?.join('.') || ''),
        message: String(issue.message || 'Validation error'),
      }));

      const response: ValidationErrorResponse = {
        error: 'ValidationError',
        message: 'Request validation failed',
        details,
        requestId: req.requestId,
      };

      req.logger?.warn('Validation error', { details, target });

      res.status(HttpStatusCode.BAD_REQUEST).json(response);
      return;
    }

    req[target] = result.data;
    next();
  };
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return validate(schema, 'body');
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return validate(schema, 'params');
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return validate(schema, 'query');
}
