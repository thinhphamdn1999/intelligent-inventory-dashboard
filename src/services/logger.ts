type LogLevel = 'info' | 'warn' | 'error';
type LogMeta = Record<string, unknown>;

export interface LogTransport {
  log(level: LogLevel, message: string, meta?: LogMeta): void;
}

class ConsoleTransport implements LogTransport {
  log(level: LogLevel, message: string, meta?: LogMeta): void {
    let consoleMethod = console.info;

    if (level === 'warn') {
      consoleMethod = console.warn;
    } else if (level === 'error') {
      consoleMethod = console.error;
    }

    consoleMethod(`[${level.toUpperCase()}] ${message}`, meta ?? '');
  }
}

export class Logger {
  private transports: LogTransport[];

  constructor(transports: LogTransport[] = [new ConsoleTransport()]) {
    this.transports = transports;
  }

  addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  private log(level: LogLevel, message: string, meta?: LogMeta): void {
    this.transports.forEach((transport) => transport.log(level, message, meta));
  }

  info(message: string, meta?: LogMeta): void {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: LogMeta): void {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: LogMeta): void {
    this.log('error', message, meta);
  }
}

const logger = new Logger();

export default logger;
