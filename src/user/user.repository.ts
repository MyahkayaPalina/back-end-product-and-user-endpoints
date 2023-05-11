import { inject, injectable } from 'inversify';
import { Role, User } from '@prisma/client';
import { TYPES } from '../constants/types';
import { IDatabaseService } from '../database/database.service.interface';
import { CreateUserDto } from './dto/user-create.dto';
import { IUserRepository } from './user.repository.interface';

@injectable()
class UserRepository implements IUserRepository {
	constructor(@inject(TYPES.IDatabaseService) private database: IDatabaseService) {}

	async create(user: CreateUserDto): Promise<User> {
		return await this.database.client.user.create({ data: user });
	}

	async findByEmail(email: string): Promise<User> {
		return await this.database.client.user.findUniqueOrThrow({ where: { email } });
	}

	async updatePassword(id: number, password: string): Promise<User> {
		return await this.database.client.user.update({
			where: { id },
			data: { password },
		});
	}

	async updateRole(id: number, role: Role): Promise<User> {
		return await this.database.client.user.update({
			where: { id },
			data: { role },
		});
	}
}

export { UserRepository };
