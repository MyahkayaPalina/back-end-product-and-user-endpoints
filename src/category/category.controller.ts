import { Role } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { TYPES } from '../constants/types';
import { BaseController } from '../common/base.controller';
import { GuardMiddleware } from '../common/guard.middleware';
import { ValidateMiddleware } from '../common/validate.middleware';
import { ILoggerService } from '../logger/logger.service.interface';
import { ICategoryController } from './category.controller.interface';
import { CreateCategoryDto } from './dto/category-create.dto';
import { ICategoryService } from './category.service.interface';
import { getParsedLimit } from '../utils/pagination';

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *      type: object
 *      required:
 *        - title
 *      parameters:
 *        title:
 *          type: string
 *        createdAt:
 *          type: date
 *        updatedAt:
 *          type: date
 *      example:
 *        title: Product name
 *        createdAt: 2023-03-02 14:32:06.102
 *        updatedAt: 2023-03-02 14:32:06.102
 */
@injectable()
export class CategoryController extends BaseController implements ICategoryController {
	constructor(
		@inject(TYPES.ILoggerService) protected logger: ILoggerService,
		@inject(TYPES.ICategoryService) private categoryService: ICategoryService,
	) {
		super(logger);

		this.addRoutes(
			[
				{
					path: '/',
					method: 'post',
					func: this.create,
					middlewares: [
						new GuardMiddleware([Role.ADMIN, Role.MANAGER]),
						new ValidateMiddleware(CreateCategoryDto),
					],
				},
				{ path: '/', method: 'get', func: this.find },
			],
			'category',
		);
	}

	/**
	 * @swagger
	 * /category:
	 *   post:
	 *    summary: Creates product category
	 *    requestBody:
	 *      content:
	 *        application/json:
	 *          schema:
	 *            type: object
	 *            properties:
	 *              title:
	 *                type: string
	 *            example:
	 *              title: Home furniture
	 *    responses:
	 *      201:
	 *        description: Product category was created
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: object
	 *              $ref: '#/components/schemas/Category'
	 */
	async create({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.categoryService.create(body.title);

			this.send(res, StatusCodes.CREATED, result);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * @swagger
	 * /category:
	 *   get:
	 *    summary: Returns list of categories
	 *    parameters:
	 *      - in: query
	 *        name: skip
	 *        schema:
	 *          type: integer
	 *          default: 0
	 *          example: 3
	 *        description: Number of first category we get
	 *      - in: query
	 *        name: limit
	 *        schema:
	 *          type: integer
	 *          default: 20
	 *          example: 5
	 *        desccription: Quantity of categories we get
	 *    responses:
	 *      200:
	 *        description: List of categories
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: array
	 *              items:
	 *                $ref: '#/components/schemas/Category'
	 */
	async find({ query }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const skip = Number(query.skip) || 0;
			const take = getParsedLimit(Number(query.take), 10, 20);
			const result = await this.categoryService.find(skip, take);

			this.sendOk(res, result);
		} catch (err) {
			return next(err);
		}
	}
}
