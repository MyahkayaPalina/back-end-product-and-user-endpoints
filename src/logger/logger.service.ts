import { injectable } from 'inversify';
import { Logger } from 'tslog';

import { ILoggerService } from './logger.service.interface';

@injectable()
export class LoggerService implements ILoggerService {
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
