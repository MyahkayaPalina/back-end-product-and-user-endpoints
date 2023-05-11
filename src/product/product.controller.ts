import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Role } from '@prisma/client';

import { TYPES } from '../constants/types';
import { IProductService } from './product.service.interface';
import { IProductController } from './product.controller.interface';
import { BaseController } from '../common/base.controller';
import { ILoggerService } from '../logger/logger.service.interface';
import { getParsedLimit } from '../utils/pagination';
import { CreateProductDto } from './dto/product-create.dto';
import { UpdateProductDto } from './dto/product-update.dto';
import { ValidateMiddleware } from './../common/validate.middleware';
import { GuardMiddleware } from './../common/guard.middleware';

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *      type: object
 *      required:
 *        - title
 *      parameters:
 *        title:
 *          type: string
 *        price:
 *          type: number
 *        img:
 *          type: string
 *        description:
 *          type: string
 *        createdAt:
 *          type: date
 *        updatedAt:
 *          type: date
 *      example:
 *        title: Product name
 *        price: 200
 *        img: ./product-name.jpg
 *        createdAt: 2023-03-02 14:32:06.102
 *        updatedAt: 2023-03-02 14:32:06.102
 */

@injectable()
export class ProductController extends BaseController implements IProductController {
	constructor(
		@inject(TYPES.ILoggerService) protected logger: ILoggerService,
		@inject(TYPES.IProductService) private productService: IProductService,
	) {
		super(logger);

		this.addRoutes(
			[
				{
					method: 'post',
					path: '/',
					func: this.create,
					middlewares: [
						new GuardMiddleware([Role.ADMIN, Role.MANAGER]),
						new ValidateMiddleware(CreateProductDto),
					],
				},
				{
					method: 'patch',
					path: '/:id',
					func: this.update,
					middlewares: [
						new GuardMiddleware([Role.ADMIN, Role.MANAGER]),
						new ValidateMiddleware(UpdateProductDto),
					],
				},
				{
					method: 'delete',
					path: '/:id',
					func: this.delete,
					middlewares: [new GuardMiddleware([Role.ADMIN, Role.MANAGER])],
				},
				{
					method: 'get',
					path: '/:id',
					func: this.findById,
					middlewares: [new GuardMiddleware([])],
				},
				{
					method: 'get',
					path: '/',
					func: this.find,
					middlewares: [new GuardMiddleware([])],
				},
			],
			'product',
		);
	}

	/**
	 * @swagger
	 * /product:
	 *   post:
	 *    summary: Creates product
	 *    requestBody:
	 *      content:
	 *        application/json:
	 *          schema:
	 *            type: object
	 *            properties:
	 *              title:
	 *                type: string
	 *              price:
	 *                type: number
	 *              img:
	 *                type: string
	 *              description:
	 *                type: string
	 *            required:
	 *              - title
	 *            example:
	 *              title: Product name
	 *              price: 220
	 *    responses:
	 *      201:
	 *        description: Product was created
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: object
	 *              $ref: '#/components/schemas/Product'
	 */
	async create({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.productService.create(body);

			this.send(res, StatusCodes.CREATED, result);
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @swagger
	 * /product/{id}:
	 *   patch:
	 *    summary: Changes product details
	 *    parameters:
	 *      - in: path
	 *        name: id
	 *        schema:
	 *          type: integer
	 *          example: 3
	 *          required: true
	 *    requestBody:
	 *      content:
	 *        application/json:
	 *          schema:
	 *            type: object
	 *            properties:
	 *              title:
	 *                type: string
	 *              price:
	 *                type: number
	 *              img:
	 *                type: string
	 *              description:
	 *                type: string
	 *            example:
	 *              description: Lifechanging product
	 *              price: 40
	 *    responses:
	 *      201:
	 *        description: Product was updated
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: object
	 *              $ref: '#/components/schemas/Product'
	 */
	async update(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(req.params.id);
			const result = await this.productService.update(req.body, id);

			this.sendOk(res, result);
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @swagger
	 * /product/{id}:
	 *   delete:
	 *    summary: Deletes product by it's id
	 *    parameters:
	 *      - in: path
	 *        name: id
	 *        schema:
	 *          type: integer
	 *          example: 10
	 *          required: true
	 *    responses:
	 *      204:
	 *        description: Product was deleted
	 */
	async delete({ params }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(params.id);
			await this.productService.delete(id);

			this.send(res, StatusCodes.NO_CONTENT);
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @swagger
	 * /product/{id}:
	 *   get:
	 *    summary: Finds product by it's id
	 *    parameters:
	 *      - in: path
	 *        name: id
	 *        schema:
	 *          type: integer
	 *          example: 3
	 *          required: true
	 *    responses:
	 *      200:
	 *        description: Product was found
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: object
	 *              $ref: '#/components/schemas/Product'
	 */
	async findById({ params }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = Number(params.id);
			const result = await this.productService.findById(id);

			this.sendOk(res, result);
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @swagger
	 * /product:
	 *   get:
	 *    summary: Returns list of products
	 *    parameters:
	 *      - in: query
	 *        name: skip
	 *        schema:
	 *          type: integer
	 *          default: 0
	 *          example: 3
	 *        description: Number of first product we get
	 *      - in: query
	 *        name: limit
	 *        schema:
	 *          type: integer
	 *          default: 20
	 *          example: 5
	 *        desccription: Quantity of products we get
	 *    responses:
	 *      200:
	 *        description: List of products
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: array
	 *              items:
	 *                $ref: '#/components/schemas/Product'
	 */
	async find({ query }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const skip = Number(query.skip) || 0;
			const take = getParsedLimit(Number(query.take), 10, 20);
			const result = await this.productService.find(skip, take);

			this.sendOk(res, result);
		} catch (err) {
			next(err);
		}
	}
}
