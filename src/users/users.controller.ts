import express, { Request, Response, NextFunction } from 'express';

import { DParentRoutePath } from '../common/parentRoutePath.d';
import { IDatabase } from '../database/database.interface';
import { ILogger } from '../logger/logger.interface';
import { IUserRegister } from './user-register.interface';
import { IUserLogin } from './user-login.interface';
import { IUsersService } from './user.service.interface';

import { BaseController } from '../common/base.controller';

export class UsersController extends BaseController {
	private _service: IUsersService;

	constructor(
		db: IDatabase,
		logger: ILogger,
		parentRouterPath: DParentRoutePath,
		service: IUsersService,
	) {
		super(db, logger, parentRouterPath);

		this.addRoutes([
			{ method: 'post', path: '/login', func: this.login },
			{ method: 'post', path: '/register', func: this.register },
		]);
		this._service = service;
	}

	private login(req: Request<{}, {}, IUserLogin>, res: Response, next: NextFunction): void {
		const { email, password } = req.body;

		if (email && password) {
			this.sendOk(res, `login ${req.body.email}`);
		} else {
			this.sendError(res, new Error('not provided both email and password'));
		}
	}

	private async register(
		{ body }: Request<{}, {}, IUserRegister>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const newUser = await this._service.createUser(body);

		if (newUser) {
			this.sendOk(res, `register ${newUser.email} ${newUser.password}`);
			return;
		}

		this.sendError(res, new Error('Такой пользователь уже существует'), 422);
	}
}
