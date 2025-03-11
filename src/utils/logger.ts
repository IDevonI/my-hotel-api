import { format } from 'util';

enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

type LogMessage = string | Error | Record<string, unknown>;

interface LoggerOptions {
  timestamp?: boolean;
  colorize?: boolean;
}

const colors = {
  [LogLevel.INFO]: '\x1b[32m', // Green
  [LogLevel.WARN]: '\x1b[33m', // Yellow
  [LogLevel.ERROR]: '\x1b[31m', // Red
  [LogLevel.DEBUG]: '\x1b[36m', // Cyan
  reset: '\x1b[0m'
};

class Logger {
  private readonly options: LoggerOptions;

  constructor(options: LoggerOptions = {}) {
    this.options = {
      timestamp: true,
      colorize: true,
      ...options
    };
  }

  private formatMessage(level: LogLevel, message: LogMessage): string {
    const timestamp = this.options.timestamp
      ? `[${new Date().toISOString()}] `
      : '';
    const color = this.options.colorize ? colors[level] : '';
    const reset = this.options.colorize ? colors.reset : '';

    let formattedMessage = message;
    if (message instanceof Error) {
      formattedMessage = message.stack || message.message;
    } else if (typeof message === 'object') {
      formattedMessage = JSON.stringify(message, null, 2);
    }

    return `${timestamp}${color}${level}${reset}: ${formattedMessage}`;
  }

  public info(message: LogMessage): void {
    console.log(this.formatMessage(LogLevel.INFO, message));
  }

  public warn(message: LogMessage): void {
    console.warn(this.formatMessage(LogLevel.WARN, message));
  }

  public error(message: LogMessage): void {
    console.error(this.formatMessage(LogLevel.ERROR, message));
  }

  public debug(message: LogMessage): void {
    console.debug(this.formatMessage(LogLevel.DEBUG, message));
  }
}

export const logger = new Logger();
