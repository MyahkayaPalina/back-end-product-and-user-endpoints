import { Role, User } from '@prisma/client';
import { CreateUserDto } from './dto/user-create.dto';

interface IUserService {
	create: (user: CreateUserDto) => Promise<User>;
	findByEmail: (email: string) => Promise<User>;
	updatePassword: (id: number, password: string) => Promise<User>;
	updateRole: (id: number, role: Role) => Promise<User>;
}

export { IUserService };
