import express, { Request, Response } from 'express';

import { DParentRoutePath } from '../common/parentRoutePath.d';
import { IDatabase } from '../database/database.interface';
import { ILogger } from '../logger/logger.interface';
import { IProduct } from './product.interface';
import { IProductService } from './product.service.interface';

import { BaseController } from '../common/base.controller';

export class ProductController extends BaseController {
	private _service: IProductService;

	constructor(
		db: IDatabase,
		logger: ILogger,
		parentRouterPath: DParentRoutePath,
		productService: IProductService,
	) {
		super(db, logger, parentRouterPath);

		this.addRoutes([
			{ method: 'post', path: '/add', func: this.add },
			{ method: 'patch', path: '/edit', func: this.edit },
			{ method: 'delete', path: '/delete', func: this.delete },
			{ method: 'get', path: '/get', func: this.get },
			{ method: 'use', path: '/', func: this.default },
		]);
		this._service = productService;
	}

	private async add({ body }: Request, res: Response): Promise<void> {
		const product = await this._service.addProduct(body);

		if (product) {
			this.send(res, 201, product);
			return;
		}

		this.sendError(res, new Error('Impossible to create such product'));
	}

	private async edit({ body }: Request, res: Response): Promise<void> {
		const product = await this._service.editProduct(body);

		if (product) {
			this.sendOk(res, `SUCCESS edit product ${product}`);
			return;
		}

		this.sendError(res, new Error('Impossible to change this product'));
	}

	private async delete({ body }: Request, res: Response): Promise<void> {
		const product = await this._service.deleteProduct(body);

		if (product) {
			res.redirect('/');
			this.send(res, 204);
			return;
		}

		this.sendError(res, new Error('Impossible to delete this product'));
	}

	private async get({ body }: Request, res: Response): Promise<void> {
		const product = await this._service.getProduct(body);

		if (product) {
			this.sendOk(res, `SUCCESS edit product ${product}`);
			return;
		}

		this.sendError(res, new Error('no such product'));
	}

	private async default(_: Request, res: Response): Promise<void> {
		const products = await this._service.getProducts();

		if (products) {
			this.sendOk(res, `SUCCESS all products: ${products}`);
			return;
		}

		this.sendError(res, new Error('no products found'));
	}
}
