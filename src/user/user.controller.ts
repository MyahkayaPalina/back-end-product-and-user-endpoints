import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { TYPES } from '../constants/types';
import { ILoggerService } from '../logger/logger.service.interface';
import { IUserRegister } from './user-register.interface';
import { IUserLogin } from './user-login.interface';
import { IUserService } from './user.service.interface';
import { BaseController } from '../common/base.controller';

@injectable()
export class UserController extends BaseController {
	@inject(TYPES.IUserService) private _service: IUserService;

	constructor(@inject(TYPES.ILoggerService) protected logger: ILoggerService) {
		super(logger);

		this.addRoutes(
			[
				{ method: 'post', path: '/login', func: this.login },
				{ method: 'post', path: '/register', func: this.register },
			],
			'user',
		);
	}

	private login(req: Request<{}, {}, IUserLogin>, res: Response): void {
		const { email, password } = req.body;

		if (email && password) {
			this.sendOk(res, `login ${req.body.email}`);
		} else {
			this.sendError(res, new Error('not provided both email and password'));
		}
	}

	private async register({ body }: Request<{}, {}, IUserRegister>, res: Response): Promise<void> {
		const newUser = await this._service.createUser(body);

		if (newUser) {
			this.sendOk(res, `register ${newUser.email} ${newUser.password}`);
			return;
		}

		this.sendError(res, new Error('Такой пользователь уже существует'), 422);
	}
}
