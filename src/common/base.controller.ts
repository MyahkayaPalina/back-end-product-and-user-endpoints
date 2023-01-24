import express, { Router, Response } from 'express';

import { ILogger } from '../logger/logger.interface';
import { IRoute } from './route.interface';
import { IDatabase } from '../database/database.interface';
import { DParentRoutePath } from '../common/parentRoutePath.d';

export abstract class BaseController {
	private readonly _router: Router;

	constructor(
		protected db: IDatabase,
		private logger: ILogger,
		protected parentRouterPath: DParentRoutePath,
	) {
		this.db = db;
		this._router = express.Router();
		this.logger = logger;
		this.parentRouterPath = parentRouterPath;
	}

	get router(): Router {
		return this._router;
	}

	protected addRoutes(routes: IRoute[]): void {
		routes.forEach(({ method, path, func }) => {
			this.logger.log(
				`base.controller.addRoutes. Method: ${method}. Path: ${this.parentRouterPath || ''}${path}`,
			);

			this._router[method](path, func.bind(this));
		});
	}

	protected send<T>(res: Response, code: number, message?: T): Response {
		this.logger.log(`base.controller.send. Res: ${res}. StatusCode: ${code}. Message: ${message}`);
		return res.status(code).json(message);
	}

	protected sendError(res: Response, err: Error): Response {
		this.logger.error(err);
		return res.status(404).json(err.message);
	}

	protected sendOk<T>(res: Response, message: T): Response {
		return this.send<T>(res, 200, message);
	}
}
