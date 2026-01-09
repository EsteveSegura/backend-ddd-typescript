import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import config from './infrastructure/config';
import container from './container';
import createTodosController from './infrastructure/rest/todos-controller';
import createHealthController from './infrastructure/rest/health-controller';
import errorHandler from './infrastructure/rest/middleware/error-handler';
import requestLogger from './infrastructure/rest/middleware/request-logger';
import MongoDbHandler from './infrastructure/persistence/mongo/mongo-db-handler';
import Logger from './infrastructure/logging/logger';

const app: Application = express();

// Resolve logger from container
const logger = container.resolve<Logger>('logger');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger(logger));

// Routes
app.use('/', createHealthController());
app.use('/api/v1/todos', createTodosController(container));

// Error handler
app.use(errorHandler);

// Graceful shutdown
const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    logger.info('Shutdown signal received', { signal });
    const mongoDbHandler = container.resolve<MongoDbHandler>('mongoDbHandler');
    await mongoDbHandler.disconnect();
    process.exit(0);
  });
});

// Start server
const server = app.listen(config.server.port, () => {
  logger.info('Server started', {
    port: config.server.port,
    healthCheck: `http://localhost:${config.server.port}/health`,
    api: `http://localhost:${config.server.port}/api/v1/todos`,
  });
});

export { app, server };
