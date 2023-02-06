import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';

import { App } from './app';
import { TYPES } from './constants/types';
import { Config } from './config';
import { ILoggerService } from './logger/logger.service.interface';
import { LoggerService } from './logger/logger.service';
import { IDatabaseController } from './database/database.controller.interface';
import { DatabaseController } from './database/database.controller';
import { IExceptionController } from './exception/exception.controller.interface';
import { ExceptionController } from './exception/exception.controller';
import { IException } from './exception/exception.entity.interface';
import { Exception } from './exception/exception.entity';
import { IProductController } from './product/product.controller.interface';
import { ProductController } from './product/product.controller';
import { IProductDatabase } from './product/product.database.interface';
import { ProductDatabase } from './product/product.database';
import { IProductService } from './product/product.service.interface';
import { ProductService } from './product/product.service';
import { IUserService } from './user/user.service.interface';
import { UsersService } from './user/user.service';
import { UserController } from './user/user.controller';

const appBinging = new ContainerModule((bind: interfaces.Bind) => {
	bind<Config>(TYPES.Config).to(Config).inSingletonScope();
	bind<App>(TYPES.App).to(App).inSingletonScope();
	bind<ILoggerService>(TYPES.ILoggerService).to(LoggerService).inSingletonScope();
	bind<IDatabaseController>(TYPES.IDatabaseController).to(DatabaseController);
	bind<IExceptionController>(TYPES.IExceptionController).to(ExceptionController).inSingletonScope();
	bind<IException>(TYPES.IException).to(Exception).inSingletonScope();
	bind<IProductController>(TYPES.IProductController).to(ProductController).inSingletonScope();
	bind<IProductDatabase>(TYPES.IProductDatabase).to(ProductDatabase).inSingletonScope();
	bind<IProductService>(TYPES.IProductService).to(ProductService).inSingletonScope();
	bind<IUserService>(TYPES.IUserService).to(UsersService).inSingletonScope();
	bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
});

async function bootstrap(): Promise<App> {
	const container = new Container();
	container.load(appBinging);
	const app = container.get<App>(TYPES.App);
	const config = container.get<Config>(TYPES.Config);
	const database = container.get<IDatabaseController>(TYPES.IDatabaseController);

	config.init();
	await database.connect();
	await app.init();

	return app;
}

export const app = bootstrap();
