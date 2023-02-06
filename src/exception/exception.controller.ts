import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { TYPES } from '../constants/types';
import { ILoggerService } from '../logger/logger.service.interface';
import { IExceptionController } from './exception.controller.interface';
import { IException } from './exception.entity.interface';

@injectable()
export class ExceptionController implements IExceptionController {
	constructor(@inject(TYPES.ILoggerService) private logger: ILoggerService) {
		this.logger = logger;
	}

	catch(err: IException | Error, req: Request, res: Response): void {
		let code;
		let message;

		if (err instanceof IException) {
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
