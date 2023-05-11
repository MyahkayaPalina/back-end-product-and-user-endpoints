import { User } from '@prisma/client';
import { IsDefined, IsEmail, Length, IsString } from 'class-validator';

export class LoginUserDto implements Pick<User, 'email' | 'password'> {
	@IsDefined()
	@IsString()
	@IsEmail()
	email: string;

	@IsDefined()
	@IsString()
	@Length(6, 32)
	password: string;
}
