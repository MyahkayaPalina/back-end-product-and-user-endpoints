import { User } from '@prisma/client';
import { IsDefined, IsEmail, Length, IsString, IsOptional, IsEmpty } from 'class-validator';

export class CreateUserDto implements Omit<User, 'id' | 'role'> {
	@IsDefined()
	@IsString()
	@IsEmail()
	email: string;

	@IsDefined()
	@IsString()
	@Length(6, 255)
	password: string;

	@IsOptional()
	@IsString()
	@Length(1, 255)
	name: string;

	@IsOptional()
	@IsString()
	@Length(1, 255)
	surname: string;

	@IsEmpty()
	createdAt: Date;

	@IsEmpty()
	updatedAt: Date;
}
