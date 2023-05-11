import { Role, User } from '@prisma/client';
import { CreateUserDto } from './dto/user-create.dto';

interface IUserRepository {
	create: (user: CreateUserDto) => Promise<User>;
	findByEmail: (email: string) => Promise<User>;
	updatePassword: (id: number, password: string) => Promise<User>;
	updateRole: (id: number, role: Role) => Promise<User>;
}

export { IUserRepository };
