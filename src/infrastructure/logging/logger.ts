import pino, { Logger as PinoLogger } from 'pino';
import config from '../config';

export interface LogContext {
  [key: string]: unknown;
}

export default interface Logger {
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: Error, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
  child(bindings: LogContext): Logger;
}

class PinoLoggerAdapter implements Logger {
  private readonly logger: PinoLogger;

  constructor(logger: PinoLogger) {
    this.logger = logger;
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(context ?? {}, message);
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(context ?? {}, message);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.logger.error({ ...context, err: error }, message);
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(context ?? {}, message);
  }

  child(bindings: LogContext): Logger {
    return new PinoLoggerAdapter(this.logger.child(bindings));
  }
}

export function createLogger(): Logger {
  const pinoLogger = pino({
    level: config.logging.level,
    formatters: {
      level: (label) => ({ level: label }),
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    ...(config.logging.pretty && {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
    }),
  });

  return new PinoLoggerAdapter(pinoLogger);
}
