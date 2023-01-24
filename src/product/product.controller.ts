import express, { Request, Response } from 'express';

import { DParentRoutePath } from '../common/parentRoutePath.d';
import { IDatabase } from '../database/database.interface';
import { ILogger } from '../logger/logger.interface';
import { IProduct } from './product.interface';

import { BaseController } from '../common/base.controller';

export class ProductController extends BaseController {
	constructor(db: IDatabase, logger: ILogger, parentRouterPath: DParentRoutePath) {
		super(db, logger, parentRouterPath);

		this.addRoutes([
			{ method: 'post', path: '/add', func: this.add },
			{ method: 'patch', path: '/edit', func: this.edit },
			{ method: 'delete', path: '/delete', func: this.delete },
			{ method: 'get', path: '/get', func: this.get },
			{ method: 'use', path: '/', func: this.default },
		]);
	}

	private add(req: Request, res: Response): void {
		const { title, price = null, description = null, img = null } = req.body;
		this.db
			.execute(
				`
					INSERT INTO products (title, price, description, img)
					VALUES (?, ?, ?, ?)
				`,
				[title, price, description, img],
			)
			.then(() => {
				this.send(res, 201, req.body);
			})
			.catch((err) => this.sendError(res, err));
	}

	private edit(req: Request, res: Response): void {
		//TODO AFTER adding CRM. only changed fields shall be send and updated
		const { id, title, price = null, description = null, img = null } = req.body;

		this.db
			.execute(
				`
					UPDATE products
					SET title=?, price=?, description=?, img=?
					WHERE id=?
				`,
				[title, price, description, img, Number(id)],
			)
			.then(() => {
				this.sendOk(res, `SUCCESS edit product ${req.body}`);
			})
			.catch((err) => this.sendError(res, err));
	}

	private delete(req: Request, res: Response): void {
		this.db
			.execute(
				`
		    DELETE FROM products WHERE id=?
		  `,
				[Number(req.body.id)],
			)
			.then(() => {
				res.redirect('/');
				this.send(res, 204);
			})
			.catch((err) => this.sendError(res, err));
	}

	private get(req: Request, res: Response): void {
		this.db
			.execute('SELECT * FROM products WHERE products.id = ?', [Number(req.body.id)])
			.then((products) => {
				if (Array.isArray(products)) {
					return this.sendOk(res, `SUCCESS edit product ${products[0]}`);
				}

				this.sendError(res, new Error('no such product'));
			})
			.catch((err) => this.sendError(res, err));
	}

	private default(_: Request, res: Response): void {
		this.db
			.execute('SELECT * FROM products')
			.then((products) => this.sendOk(res, `SUCCESS all products: ${products}`))
			.catch((err) => this.sendError(res, err));
	}
}
