import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { TYPES } from '../constants/types';
import { IProductService } from './product.service.interface';
import { IProductController } from './product.controller.interface';
import { BaseController } from '../common/base.controller';
import { ILoggerService } from '../logger/logger.service.interface';

@injectable()
export class ProductController extends BaseController implements IProductController {
	@inject(TYPES.IProductService) private _service: IProductService;

	constructor(@inject(TYPES.ILoggerService) protected logger: ILoggerService) {
		super(logger);

		this.addRoutes(
			[
				{ method: 'post', path: '/add', func: this.add },
				{ method: 'patch', path: '/edit', func: this.edit },
				{ method: 'delete', path: '/delete', func: this.delete },
				{ method: 'get', path: '/get', func: this.get },
				{ method: 'use', path: '/', func: this.default },
			],
			'product',
		);
	}

	async add({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			await this._service.addProduct(body);
			this.send(res, StatusCodes.CREATED, body);
		} catch (err) {
			next(err);
		}
	}

	async edit({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			await this._service.editProduct(body);

			this.sendOk(res, `SUCCESS edit product ${body}`);
		} catch (err) {
			next(err);
		}
	}

	async delete({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			await this._service.deleteProduct(body);

			this.send(res, StatusCodes.NO_CONTENT);
		} catch (err) {
			next(err);
		}
	}

	async get({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const product = await this._service.getProduct(body);

			this.sendOk(res, `SUCCESS edit product ${product}`);
		} catch (err) {
			next(err);
		}
	}

	async default(_: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const products = await this._service.getProducts();

			this.sendOk(res, `SUCCESS all products: ${products}`);
		} catch (err) {
			next(err);
		}
	}
}
