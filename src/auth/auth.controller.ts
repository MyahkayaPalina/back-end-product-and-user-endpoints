import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import { TYPES } from '../constants/types';
import { IAuthController } from './auth.controller.interface';
import { IAuthService } from './auth.service.interface';
import { IUserService } from '../user/user.service.interface';
import { BaseController } from '../common/base.controller';
import { GuardMiddleware } from '../common/guard.middleware';
import { ValidateMiddleware } from '../common/validate.middleware';
import { ILoggerService } from '../logger/logger.service.interface';
import { Exception } from '../exception/exception';
import { UserDto } from '../user/dto/user.dto';
import { LoginUserDto } from './dto/user-login.dto';
import { CreateUserDto } from '../user/dto/user-create.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { IConfigService } from '../config/config.service.interface';
import { ITokenPayload } from './auth.token.interface';
import { IMailerService } from '../mailer/mailer.service.interface';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      parameters:
 *        email:
 *          type: string
 *        password:
 *          type: number
 *        name:
 *          type: string
 *        surname:
 *          type: string
 *        createdAt:
 *          type: date
 *        updatedAt:
 *          type: date
 *      example:
 *        email: 1@gmail.com
 *        password: 12345678
 *        name: Jack
 *        surname: Nicklson
 *        createdAt: 2023-03-02 14:32:06.102
 *        updatedAt: 2023-03-02 14:32:06.102
 */

@injectable()
class AuthController extends BaseController implements IAuthController {
	constructor(
		@inject(TYPES.ILoggerService) protected logger: ILoggerService,
		@inject(TYPES.IAuthService) private authService: IAuthService,
		@inject(TYPES.IUserService) private userService: IUserService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IMailerService) private mailerService: IMailerService,
	) {
		super(logger);

		this.addRoutes(
			[
				{
					path: '/login',
					method: 'post',
					func: this.login,
					middlewares: [new ValidateMiddleware(LoginUserDto)],
				},
				{
					path: '/register',
					method: 'post',
					func: this.register,
					middlewares: [new ValidateMiddleware(CreateUserDto)],
				},
				{
					path: '/token',
					method: 'get',
					func: this.getToken,
				},

				{
					path: '/forgot-password',
					method: 'post',
					func: this.forgotPassword,
					middlewares: [new ValidateMiddleware(ForgotPasswordDto)],
				},
				{
					path: '/restore-password',
					method: 'post',
					func: this.restorePassword,
					middlewares: [new GuardMiddleware(), new ValidateMiddleware(RestorePasswordDto)],
				},
				{
					path: '/logout',
					method: 'get',
					func: this.logout,
					middlewares: [new GuardMiddleware()],
				},
			],
			'auth',
		);
	}

	/**
	 * @swagger
	 * /auth/login:
	 *   post:
	 *     summary: Logins user's
	 *     requestBody:
	 *       content:
	 *          application/json:
	 *            schema:
	 *              type: object
	 *              properties:
	 *                email:
	 *                  type: string
	 *                password:
	 *                  type: script
	 *              required:
	 *                - email
	 *                - password
	 *              example:
	 *                email: email1@gmail.com
	 *                password: 12345678
	 *     responses:
	 *       200:
	 *         description: User is logged in
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 accessToken:
	 *                   type: string
	 *                 user:
	 *                   $ref: '#/components/schemas/User'
	 */
	async login(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, password } = req.body;

			const user = await this.userService.findByEmail(email);
			await this.authService.verifyUserPassword(password, user.password);

			const { token: accessToken } = this.authService.getAccessToken(user);
			const { cookie: refreshTokenCookie } = this.authService.getRefreshToken(user);

			res.setHeader('Set-Cookie', [refreshTokenCookie]);

			this.sendOk(res, { user: new UserDto(user), accessToken });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * @swagger
	 * /auth/register:
	 *   post:
	 *     summary: Registrates new user
	 *     requestBody:
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               email:
	 *                 type: string
	 *               password:
	 *                 type: string
	 *               name:
	 *                 type: string
	 *               surname:
	 *                 type: string
	 *             required:
	 *               - email
	 *               - password
	 *             example:
	 *               email: email1@gmail.com
	 *               password: 12345678
	 *     responses:
	 *       201:
	 *         description: User was registered
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 accessToken:
	 *                   type: string
	 *                 user:
	 *                   $ref: '#/components/schemas/User'
	 */
	async register({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			await this.authService.userRegister(body);

			this.send(res, StatusCodes.CREATED);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * @swagger
	 * /auth/token:
	 *   get:
	 *     summary: Returns new access token and updates refresh token as well
	 *     responses:
	 *       200:
	 *         description: Tokens were updated successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 accessToken:
	 *                   type: string
	 */

	async getToken({ cookies }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { refreshToken } = cookies;

			if (!refreshToken) {
				return next(new Exception(StatusCodes.FORBIDDEN, 'Access is denied'));
			}

			const userPayload = jwt.verify(
				refreshToken,
				this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
			) as ITokenPayload;

			const user = await this.userService.findByEmail(userPayload.email);

			const { token: newAccessToken } = this.authService.getAccessToken(user);
			const { cookie: newRefreshToken } = this.authService.getRefreshToken(user);

			res.setHeader('Set-Cookie', [newRefreshToken]);

			this.sendOk(res, { newAccessToken });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * @swagger
	 * /auth/forgot-password:
	 *   post:
	 *     summary: Forgots password
	 *     requestBody:
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               email:
	 *                 type: string
	 *             required:
	 *               - email
	 *              example:
	 *                email: email1@gmail.com
	 *     responses:
	 *       200:
	 *         description: Redirects to restoring password page
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 url:
	 *                   type: string
	 */
	async forgotPassword({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email } = body;
			const user = await this.userService.findByEmail(email);
			const { token } = this.authService.getAccessToken(user);
			const url = `${this.configService.get('CLIENT_URL')}/restore-password?token=${token}`;

			this.mailerService.sendRestorePasswordLinkToEmail(email, url);

			this.sendOk(res, {});
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * @swagger
	 * /auth/restore-password:
	 *   post:
	 *     summary: Restores password
	 *    parameters:
	 *      - in: query
	 *        name: token
	 *        schema:
	 *          type: string
	 *          required: true
	 *          description: Access token
	 *     requestBody:
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               password1:
	 *                 type: string
	 *               password2:
	 *                 type: string
	 *             required:
	 *               - password1
	 *               - password2
	 *              example:
	 *                password1: 123456
	 *                password2: 123456
	 *     responses:
	 *       204:
	 *         description: Password was updated
	 */
	async restorePassword(
		{ userPayload, body }: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const user = await this.userService.findByEmail(userPayload.email);

			if (body.password1 !== body.password2) {
				throw new Exception(StatusCodes.UNAUTHORIZED, 'Passwords did not match');
			}
			const hashedPassword = await this.authService.getHashedPassword(body.password1);

			await this.userService.updatePassword(user.id, hashedPassword);

			this.sendOk(res, {});
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * @swagger
	 * /auth/logout:
	 *   get:
	 *     summary: Loggs user out
	 *     responses:
	 *       200:
	 *         description: User was logged out
	 */
	async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			res.clearCookie('refreshToken');

			this.sendOk(res, {});
		} catch (err) {
			return next(err);
		}
	}
}

export { AuthController };
