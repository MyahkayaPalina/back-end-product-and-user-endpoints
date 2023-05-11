import express, { Router, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';

import { IMiddleware } from './middleware.interface';
import { ILoggerService } from '../logger/logger.service.interface';
import { IRoute } from './route.interface';
import { IBaseController } from './base.controller.interface';

@injectable()
export abstract class BaseController implements IBaseController {
	private readonly _router: Router;
	protected logger: ILoggerService;

	constructor(logger: ILoggerService) {
		this._router = express.Router();
		this.logger = logger;
	}

	get router(): Router {
		return this._router;
	}

	addRoutes(routes: IRoute[], parentRouterPath: string): void {
		routes.forEach(({ method, path, func, middlewares }) => {
			this.logger.log(
				`base.controller.addRoutes. Method: ${method}. Path: ${parentRouterPath || ''}${path}`,
			);

			const bindedMiddlewares = middlewares?.map((m: IMiddleware) => m.execute.bind(m));
			const handler = func.bind(this);
			const pipeline = bindedMiddlewares ? [...bindedMiddlewares, handler] : handler;

			this._router[method](path, pipeline);
		});
	}

	send<T>(res: Response, code: number, message?: T): void {
		this.logger.log(`base.controller.send. Res: ${res}. StatusCode: ${code}. Message: ${message}`);
		res.status(code).json(message);
	}

	sendError(res: Response, err: Error, code?: number): void {
		this.logger.error(err);
		res.status(code || StatusCodes.NOT_FOUND).json(err.message);
	}

	sendOk<T>(res: Response, message: T): void {
		this.send<T>(res, StatusCodes.OK, message);
	}
}
