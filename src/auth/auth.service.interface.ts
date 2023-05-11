import { User } from '@prisma/client';

import { CreateUserDto } from '../user/dto/user-create.dto';

interface IAuthService {
	getHashedPassword(password: string): Promise<string>;
	userRegister(body: CreateUserDto): Promise<User>;
	verifyUserPassword(plainTextPassword: string, hashedPassword: string): Promise<void>;
	getNewToken(user: User, secret: string, experationTime: string): string;
	getNewTokenCookie(token: string, experationTime: string): string;
	getAccessToken(user: User): { token: string; cookie: string };
	getRefreshToken(user: User): { token: string; cookie: string };
}
export { IAuthService };
