import { Router, Request, Response } from 'express';
import { HttpStatusCode } from './http-status-code';

export default function createHealthController(): Router {
  const router = Router();

  router.get('/health', (_req: Request, res: Response) => {
    res.status(HttpStatusCode.OK).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}
