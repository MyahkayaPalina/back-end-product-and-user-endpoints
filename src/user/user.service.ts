import { Role, User } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { TYPES } from '../constants/types';
import { CreateUserDto } from './dto/user-create.dto';
import { IUserRepository } from './user.repository.interface';
import { IUserService } from './user.service.interface';

@injectable()
class UserService implements IUserService {
	constructor(@inject(TYPES.IUserRepository) private userRepository: IUserRepository) {}

	async create(user: CreateUserDto): Promise<User> {
		return await this.userRepository.create(user);
	}

	async findByEmail(email: string): Promise<User> {
		return await this.userRepository.findByEmail(email);
	}

	async updatePassword(id: number, password: string): Promise<User> {
		return await this.userRepository.updatePassword(id, password);
	}

	async updateRole(id: number, role: Role): Promise<User> {
		return await this.userRepository.updateRole(id, role);
	}
}

export { UserService };
