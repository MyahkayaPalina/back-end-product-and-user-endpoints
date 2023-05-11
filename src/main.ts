import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';

import { App } from './app';
import { TYPES } from './constants/types';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { ILoggerService } from './logger/logger.service.interface';
import { LoggerService } from './logger/logger.service';
import { IDatabaseService } from './database/database.service.interface';
import { DatabaseService } from './database/database.service';
import { IExceptionFilter } from './exception/exception.filter.interface';
import { ExceptionFilter } from './exception/exception.filter';
import { IProductController } from './product/product.controller.interface';
import { ProductController } from './product/product.controller';
import { IProductRepository } from './product/product.repository.interface';
import { ProductRepository } from './product/product.repository';
import { IProductService } from './product/product.service.interface';
import { ProductService } from './product/product.service';
import { IUserService } from './user/user.service.interface';
import { UserService } from './user/user.service';
import { UserRepository } from './user/user.repository';
import { IUserRepository } from './user/user.repository.interface';
import { UserController } from './user/user.controller';
import { IUserController } from './user/user.controller.interface';
import { AuthController } from './auth/auth.controller';
import { IAuthController } from './auth/auth.controller.interface';
import { AuthService } from './auth/auth.service';
import { IAuthService } from './auth/auth.service.interface';
import { ICategoryController } from './category/category.controller.interface';
import { CategoryController } from './category/category.controller';
import { ICategoryRepository } from './category/category.repository.interface';
import { CategoryRepository } from './category/category.repository';
import { ICategoryService } from './category/category.service.interface';
import { CategoryService } from './category/category.service';
import { IMailerService } from './mailer/mailer.service.interface';
import { MailerService } from './mailer/mailer.service';

const appBinging = new ContainerModule((bind: interfaces.Bind) => {
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<App>(TYPES.App).to(App).inSingletonScope();
	bind<ILoggerService>(TYPES.ILoggerService).to(LoggerService).inSingletonScope();
	bind<IDatabaseService>(TYPES.IDatabaseService).to(DatabaseService);
	bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter).inSingletonScope();
	bind<IProductController>(TYPES.IProductController).to(ProductController).inSingletonScope();
	bind<IProductRepository>(TYPES.IProductRepository).to(ProductRepository).inSingletonScope();
	bind<IProductService>(TYPES.IProductService).to(ProductService).inSingletonScope();
	bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
	bind<IUserController>(TYPES.IUserController).to(UserController).inSingletonScope();
	bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
	bind<IAuthController>(TYPES.IAuthController).to(AuthController).inSingletonScope();
	bind<IAuthService>(TYPES.IAuthService).to(AuthService).inSingletonScope();
	bind<ICategoryController>(TYPES.ICategoryController).to(CategoryController).inSingletonScope();
	bind<ICategoryRepository>(TYPES.ICategoryRepository).to(CategoryRepository).inSingletonScope();
	bind<ICategoryService>(TYPES.ICategoryService).to(CategoryService).inSingletonScope();
	bind<IMailerService>(TYPES.IMailerService).to(MailerService).inSingletonScope();
});

async function bootstrap(): Promise<App> {
	const container = new Container();
	container.load(appBinging);
	const app = container.get<App>(TYPES.App);

	await app.init();

	return app;
}

export const app = bootstrap();
