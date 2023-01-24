import express, { Request, Response, NextFunction } from 'express';

import { ILogger } from '../logger/logger.interface';
import { IErrorsController } from './errors.controller.interface';

export class ErrorsController implements IErrorsController {
	logger: ILogger;

	constructor(logger: ILogger) {
		this.logger = logger;
	}

	catch(err: Error, req: Request, res: Response, next: NextFunction): Response {
		this.logger.error(`errors.controller.catch StatusCode: ${res.statusCode}. Error: ${err}`);

		return res.status(res.statusCode).send(err);
	}
}
