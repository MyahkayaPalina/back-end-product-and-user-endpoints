import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { TYPES } from '../constants/types';
import { ILoggerService } from '../logger/logger.service.interface';
import { IUserController } from './user.controller.interface';
import { IUserService } from './user.service.interface';
import { BaseController } from '../common/base.controller';
import { UpdateUserDto } from './dto/user-update.dto';
import { GuardMiddleware } from '../common/guard.middleware';
import { ValidateMiddleware } from '../common/validate.middleware';
import { UserDto } from './dto/user.dto';

/**
 *  @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          id:
 *            type: number
 *          role:
 *            type: string
 *            enum: [ADMIN, MANAGER, USER]
 *          email:
 *            type: string
 *          password:
 *            type: string
 *          name:
 *            type: string
 *          surname:
 *            type: string
 *        example:
 *          id: 1
 *          name: John
 *          email: admin@admin.com
 *          role: ADMIN
 */
@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.IUserService) private userService: IUserService,
		@inject(TYPES.ILoggerService) protected logger: ILoggerService,
	) {
		super(logger);

		this.addRoutes(
			[
				{
					method: 'patch',
					path: '/:id',
					func: this.updateRole,
					middlewares: [new GuardMiddleware([Role.ADMIN]), new ValidateMiddleware(UpdateUserDto)],
				},
				{
					path: '/me',
					method: 'get',
					func: this.findMe,
					middlewares: [new GuardMiddleware()],
				},
			],
			'user',
		);
	}

	/**
	 * @swagger
	 * /user/role/{id}:
	 *  patch:
	 *    summary: Change user role
	 *    parameters:
	 *      - in: path
	 *        name: id
	 *        schema:
	 *          type: integer
	 *          example: 3
	 *          required: true
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *        schema:
	 *          type: object
	 *          properties:
	 *            role:
	 *              type: string
	 *              enum: [ADMIN, MANAGER, USER]
	 *    responses:
	 *      204:
	 *      description: User role was updated
	 */
	async updateRole({ params, body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(params.id);
			await this.userService.updateRole(id, body.role);

			this.send(res, StatusCodes.NO_CONTENT);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * @swagger
	 *  /me:
	 *    get:
	 *      summary: Get my personal data
	 *    responses:
	 *      200:
	 *        content:
	 *          application/json:
	 *          schema:
	 *            type: object
	 *            properties:
	 *              user:
	 *                $ref: '#/components/schemas/User'
	 */
	async findMe({ userPayload }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.userService.findByEmail(userPayload.email);

			this.sendOk(res, { user: new UserDto(result) });
		} catch (err) {
			return next(err);
		}
	}
}
