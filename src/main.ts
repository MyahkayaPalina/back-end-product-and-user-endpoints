import { App } from './app';

import { db } from './database/database.controller';
import { LoggerService } from './logger/logger.service';
import { ProductController } from './product/product.controller';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { ProductService } from './product/product.service';

import { ErrorsController } from './errors/errors.controller';

async function bootstrap(): Promise<App> {
	const logger = new LoggerService();

	const app = new App(
		logger,
		new ProductController(db, logger, 'product', new ProductService(db)),
		new UsersController(db, logger, 'user', new UsersService()),
		new ErrorsController(logger),
	);

	await app.init();

	return app;
}

export const app = bootstrap();
