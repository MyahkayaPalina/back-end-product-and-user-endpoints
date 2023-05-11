import { IsDefined, IsString, Length } from 'class-validator';

export class RestorePasswordDto {
	@IsDefined()
	@IsString()
	@Length(6, 32)
	password1: string;

	@IsDefined()
	@IsString()
	@Length(6, 32)
	password2: string;
}
