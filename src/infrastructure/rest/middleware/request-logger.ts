import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import Logger from '../../logging/logger';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      logger: Logger;
    }
  }
}

export default function requestLogger(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const requestId = randomUUID();
    const startTime = Date.now();

    req.requestId = requestId;
    req.logger = logger.child({ requestId });

    res.setHeader('X-Request-Id', requestId);

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const logContext = {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
      };

      if (res.statusCode >= 500) {
        req.logger.error('HTTP Request completed with error', undefined, logContext);
      } else if (res.statusCode >= 400) {
        req.logger.warn('HTTP Request completed with client error', logContext);
      } else {
        req.logger.info('HTTP Request completed', logContext);
      }
    });

    next();
  };
}
