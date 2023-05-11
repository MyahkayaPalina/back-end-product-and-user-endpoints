import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import jwt, { Secret } from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { Exception } from '../exception/exception';
import { IAuthService } from './auth.service.interface';
import { TYPES } from '../constants/types';
import { IUserService } from '../user/user.service.interface';
import { IConfigService } from '../config/config.service.interface';
import { CreateUserDto } from '../user/dto/user-create.dto';
import { ITokenPayload } from './auth.token.interface';

@injectable()
class AuthService implements IAuthService {
	constructor(
		@inject(TYPES.IUserService) private userService: IUserService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {}

	async getHashedPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt(Number(this.configService.get('SALT')));

		return await bcrypt.hash(password, salt);
	}

	private getTokenPayload({ id, role, email }: User): ITokenPayload {
		return { id, role, email };
	}

	async userRegister(body: CreateUserDto): Promise<User> {
		const hashedPassword = await this.getHashedPassword(body.password);

		const result = await this.userService.create({
			...body,
			password: hashedPassword,
		});

		return result;
	}

	async verifyUserPassword(password: string, hashedPassword: string): Promise<void> {
		const isSamePassword = await bcrypt.compare(password, hashedPassword);

		if (!isSamePassword) {
			throw new Exception(StatusCodes.INTERNAL_SERVER_ERROR, 'Password is incorrect');
		}
	}

	getNewToken(user: User, secret: string, experationTime: string): string {
		const payload = this.getTokenPayload(user);

		return jwt.sign(payload, this.configService.get(secret) as Secret, {
			expiresIn: `${this.configService.get(experationTime)}s`,
		});
	}

	getNewTokenCookie(token: string, experationTime: string): string {
		return `accessToken=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
			experationTime,
		)}`;
	}

	getAccessToken(user: User): { token: string; cookie: string } {
		const token = this.getNewToken(
			user,
			'JWT_ACCESS_TOKEN_SECRET',
			'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
		);

		const cookie = this.getNewTokenCookie(token, 'JWT_ACCESS_TOKEN_EXPIRATION_TIME');

		return { token, cookie };
	}

	getRefreshToken(user: User): { token: string; cookie: string } {
		const token = this.getNewToken(
			user,
			'JWT_REFRESH_TOKEN_SECRET',
			'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
		);

		const cookie = this.getNewTokenCookie(token, 'JWT_REFRESH_TOKEN_EXPIRATION_TIME');

		return { token, cookie };
	}
}

export { AuthService };
