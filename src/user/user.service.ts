import { IUserRegister } from './user-register.interface';

import { User } from './user.entity';
import { injectable } from 'inversify';

@injectable()
export class UsersService {
	async createUser({ email, password, name }: IUserRegister): Promise<User | null> {
		const newUser = new User(email, name);
		await newUser.setPassword(password);
		return newUser;
	}
}
