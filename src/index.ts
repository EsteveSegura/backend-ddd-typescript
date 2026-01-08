import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import config from './infrastructure/config';
import container from './container';
import createTodosController from './infrastructure/rest/todos-controller';
import createHealthController from './infrastructure/rest/health-controller';
import errorHandler from './infrastructure/rest/middleware/error-handler';
import MongoDbHandler from './infrastructure/persistence/mongo/mongo-db-handler';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/', createHealthController());
app.use('/api/v1/todos', createTodosController(container));

// Error handler
app.use(errorHandler);

// Graceful shutdown
const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    const mongoDbHandler = container.resolve<MongoDbHandler>('mongoDbHandler');
    await mongoDbHandler.disconnect();
    process.exit(0);
  });
});

// Start server
const server = app.listen(config.server.port, () => {
  console.log(`Server running on http://localhost:${config.server.port}`);
  console.log(`Health check: http://localhost:${config.server.port}/health`);
  console.log(`API: http://localhost:${config.server.port}/api/v1/todos`);
});

export { app, server };
