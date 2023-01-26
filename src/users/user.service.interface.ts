import { IUserRegister } from './user-register.interface';
import { User } from './user.entity';

export interface IUsersService {
	createUser: (user: IUserRegister) => Promise<User | null>;
}
