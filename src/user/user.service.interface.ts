import { IUserRegister } from './user-register.interface';
import { User } from './user.entity';

export interface IUserService {
	createUser: (user: IUserRegister) => Promise<User | null>;
}
