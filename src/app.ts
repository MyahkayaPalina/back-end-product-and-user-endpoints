import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { TYPES } from './constants/types';
import { ILoggerService } from './logger/logger.service.interface';
import { IExceptionController } from './exception/exception.controller.interface';
import { IProductController } from './product/product.controller.interface';
import { UserController } from './user/user.controller';

@injectable()
export class App {
	private app: Express;
	@inject(TYPES.ILoggerService) private logger: ILoggerService;
	@inject(TYPES.IProductController) private productController: IProductController;
	@inject(TYPES.UserController) private userController: UserController;
	@inject(TYPES.IExceptionController) private exceptionController: IExceptionController;

	constructor() {
		this.app = express();
	}

	private handleMiddleware(): void {
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.json());
	}

	private handleRoutes(): void {
		this.app.use('/product', this.productController.router);
		this.app.use('/users', this.userController.router);
	}

	private handleExceptions(): void {
		this.app.use(this.exceptionController.catch.bind(this.exceptionController));
		this.app.use((req, res) => {
			res.status(StatusCodes.NOT_FOUND).json({ message: 'Page not found' });
		});
	}

	public init(): void {
		const { APP_ENV, APP_PORT, DB_PORT } = process.env;

		this.handleMiddleware();
		this.handleRoutes();
		this.handleExceptions();
		this.logger.log(
			`Server in ${APP_ENV} mode, listening on ${APP_PORT} port, database is on ${DB_PORT} port`,
		);
		this.app.listen(APP_PORT);
	}
}
