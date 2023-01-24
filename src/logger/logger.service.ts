import { Logger } from 'tslog';

import { ILogger } from './logger.interface';

export class LoggerService implements ILogger {
	public logger: Logger<undefined>;

	constructor() {
		this.logger = new Logger();
	}

	public log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	public error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	public warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}
