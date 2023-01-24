import express, { Request, Response, NextFunction } from 'express';

import { DParentRoutePath } from '../common/parentRoutePath.d';
import { IDatabase } from '../database/database.interface';
import { ILogger } from '../logger/logger.interface';

import { BaseController } from '../common/base.controller';

export class UsersController extends BaseController {
	constructor(db: IDatabase, logger: ILogger, parentRouterPath: DParentRoutePath) {
		super(db, logger, parentRouterPath);

		this.addRoutes([
			{ method: 'get', path: '/login', func: this.login },
			{ method: 'get', path: '/register', func: this.register },
		]);
	}

	login(req: Request, res: Response, next: NextFunction): void {
		this.sendOk(res, 'login');
	}

	register(req: Request, res: Response, next: NextFunction): void {
		this.sendOk(res, 'register');
	}
}
