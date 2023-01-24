import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

import { PORT } from './constants';
import { ILogger } from './logger/logger.interface';
import { IErrorsController } from './errors/errors.controller.interface';
import { ProductController } from './product/product.controller';
import { UsersController } from './users/users.controller';

export class App {
	private app: Express;
	private logger: ILogger;
	private productController: ProductController;
	private userController: UsersController;
	private errorsController: IErrorsController;

	constructor(
		logger: ILogger,
		productController: ProductController,
		userController: UsersController,
		errorsController: IErrorsController,
	) {
		this.app = express();
		this.logger = logger;
		this.productController = productController;
		this.userController = userController;
		this.errorsController = errorsController;
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
		this.app.use(this.errorsController.catch.bind(this.errorsController));
	}

	public init(): void {
		console.log('app.init()');
		this.handleMiddleware();
		this.handleRoutes();
		this.handleExceptions();
		this.logger.log('INITIALISATION in app.init');
		this.app.listen(PORT);
	}
}
