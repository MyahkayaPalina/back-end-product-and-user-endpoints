import { App } from './app';

import { db } from './database/database.controller';
import { LoggerService } from './logger/logger.service';
import { ProductController } from './product/product.controller';
import { UsersController } from './users/users.controller';
import { ErrorsController } from './errors/errors.controller';

async function bootstrap(): Promise<App> {
	const logger = new LoggerService();

	const app = new App(
		logger,
		new ProductController(db, logger, 'product'),
		new UsersController(db, logger, 'user'),
		new ErrorsController(logger),
	);

	await app.init();

	return app;
}

export const app = bootstrap();
