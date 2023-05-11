import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { TYPES } from '../constants/types';
import { ILoggerService } from '../logger/logger.service.interface';
import { Exception } from './exception';
import { IExceptionFilter } from './exception.filter.interface';
import { IException } from './exception.interface';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILoggerService) private logger: ILoggerService) {}

	catch(err: IException | Error, req: Request, res: Response, _: NextFunction): void {
		let code;
		let message;

		if (err instanceof Exception) {
			code = err.code;
			message = err.message;
		} else {
			code = StatusCodes.INTERNAL_SERVER_ERROR;
			message = err?.message || 'Server Error';
		}

		this.logger.error(`${code}. ${message}`);
		res.status(code).json(message);
	}
}
