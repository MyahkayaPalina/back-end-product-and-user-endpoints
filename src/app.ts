import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { StatusCodes } from 'http-status-codes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { inject, injectable } from 'inversify';

import swaggerDocument from './swagger.json';
import { TYPES } from './constants/types';
import { ILoggerService } from './logger/logger.service.interface';
import { IExceptionFilter } from './exception/exception.filter.interface';
import { IProductController } from './product/product.controller.interface';
import { IUserController } from './user/user.controller.interface';
import { IDatabaseService } from './database/database.service.interface';
import { IConfigService } from './config/config.service.interface';
import { AuthMiddleware } from './common/auth.middleware';
import { IAuthController } from './auth/auth.controller.interface';
import { ICategoryController } from './category/category.controller.interface';

@injectable()
export class App {
	private app: Express;

	constructor(
		@inject(TYPES.ILoggerService) private logger: ILoggerService,
		@inject(TYPES.IProductController) private productController: IProductController,
		@inject(TYPES.IUserController) private userController: IUserController,
		@inject(TYPES.IAuthController) private authController: IAuthController,
		@inject(TYPES.ICategoryController) private categoryController: ICategoryController,
		@inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.IDatabaseService) private database: IDatabaseService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {
		this.app = express();
	}

	private handleMiddleware(): void {
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.json());
		const auth = new AuthMiddleware(this.configService.get('JWT_ACCESS_TOKEN_SECRET'));
		this.app.use(auth.execute.bind(auth));
	}

	private handleRoutes(): void {
		this.app.use('/product', this.productController.router);
		this.app.use('/user', this.userController.router);
		this.app.use('/auth', this.authController.router);
		this.app.use('/category', this.categoryController.router);
		this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerDocument)));
	}

	private handleExceptions(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
		this.app.use((req, res) => {
			res.status(StatusCodes.NOT_FOUND).json({ message: 'Page not found' });
		});
	}

	public async init(): Promise<void> {
		const APP_ENV = this.configService.get('APP_ENV');
		const APP_PORT = this.configService.get('APP_PORT');

		this.handleMiddleware();
		this.handleRoutes();
		this.handleExceptions();
		await this.database.connect();
		this.logger.log(`Server in ${APP_ENV} mode, listening on ${APP_PORT} port`);
		this.app.listen(APP_PORT);
	}
}
