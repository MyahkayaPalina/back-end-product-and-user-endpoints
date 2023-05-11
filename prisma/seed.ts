import 'reflect-metadata';
import { Container, ContainerModule, inject, injectable, interfaces } from 'inversify';

import { TYPES } from '../src/constants/types';
import { categoriesData } from './data/category';
import { productsData } from './data/product';
import { usersData } from './data/user';
import { ILoggerService } from '../src/logger/logger.service.interface';
import { LoggerService } from '../src/logger/logger.service';
import { IDatabaseService } from '../src/database/database.service.interface';
import { DatabaseService } from '../src/database/database.service';
import { IAuthService } from '../src/auth/auth.service.interface';
import { AuthService } from '../src/auth/auth.service';
import { IUserService } from '../src/user/user.service.interface';
import { UserService } from '../src/user/user.service';
import { IConfigService } from '../src/config/config.service.interface';
import { ConfigService } from '../src/config/config.service';
import { IUserRepository } from '../src/user/user.repository.interface';
import { UserRepository } from '../src/user/user.repository';

@injectable()
class Seed {
	constructor(
		@inject(TYPES.ILoggerService) private loggerService: ILoggerService,
		@inject(TYPES.IDatabaseService) private databaseService: IDatabaseService,
		@inject(TYPES.IAuthService) private authService: IAuthService,
	) {}

	public async uploadData(): Promise<void> {
		this.loggerService.log(`Start seeding ...`);

		for (const categoryData of categoriesData) {
			try {
				const category = await this.databaseService.client.category.create({
					data: categoryData,
				});
				this.loggerService.log(`Created product category with title: ${category.title}`);
			} catch (e) {
				this.loggerService.log(`Product category is already exists: ${e}`);
			}
		}

		for (const userData of usersData) {
			try {
				const hashedPassword = await this.authService.getHashedPassword(userData.password);

				const user = await this.databaseService.client.user.create({
					data: { ...userData, password: hashedPassword },
				});
				this.loggerService.log(`Created user with id: ${user.id}`);
			} catch (e) {
				this.loggerService.log(`User is already exists: ${e}`);
			}
		}

		for (const productData of productsData) {
			try {
				const category = await this.databaseService.client.product.create({
					data: productData,
				});
				this.loggerService.log(`Created product with title: ${category.title}`);
			} catch (e) {
				this.loggerService.log(`Product is already exists: ${e}`);
			}
		}

		this.loggerService.log(`Seeding finished.`);
	}

	public async init(): Promise<void> {
		await this.uploadData();
		this.databaseService.disconnect();
	}
}
export { Seed };

export const seedBinging = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILoggerService>(TYPES.ILoggerService).to(LoggerService).inSingletonScope();
	bind<DatabaseService>(TYPES.IDatabaseService).to(DatabaseService).inSingletonScope();
	bind<IAuthService>(TYPES.IAuthService).to(AuthService).inSingletonScope();
	bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
	bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<Seed>(TYPES.ISeed).to(Seed);
});

const seedContainer = new Container();
seedContainer.load(seedBinging);
const seed = seedContainer.get<Seed>(TYPES.ISeed);
seed.init();
