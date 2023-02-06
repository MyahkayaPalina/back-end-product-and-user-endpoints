import { inject, injectable } from 'inversify';

import { TYPES } from '../constants/types';
import { IDatabaseController } from '../database/database.controller.interface';
import { AddProductDto } from './dto/product-add.dto';
import { EditProductDto } from './dto/product-edit.dto';
import { GetProductDto } from './dto/product-get.dto';
import { idInDb, title } from './dto/product.props.dto';
import { IProductDatabase } from './product.database.interface';

@injectable()
export class ProductDatabase implements IProductDatabase {
	@inject(TYPES.IDatabaseController) protected database: IDatabaseController;

	async addProduct(product: AddProductDto, title: title): Promise<unknown> {
		return await this.database.execute(
			`
				INSERT INTO products (title, price, description, img)
				VALUES (?, ?, ?, ?)
			`,
			[title, product.price, product.description, product.img],
		);
	}

	async editProduct(product: EditProductDto, id: idInDb): Promise<unknown> {
		return await this.database.execute(
			`
			UPDATE products
			SET title=?, price=?, description=?, img=?
			WHERE id=?
		`,
			[product.title, product.price, product.description, product.img, id],
		);
	}

	async deleteProduct(id: idInDb): Promise<unknown> {
		return await this.database.execute(
			`
		    DELETE FROM products WHERE id=?
		  `,
			[id],
		);
	}

	async getProduct(id: idInDb): Promise<unknown> {
		return this.database.execute(
			`
			 SELECT * FROM products WHERE products.id = ?
		  `,
			[id],
		);
	}

	async getProducts(): Promise<GetProductDto[] | unknown> {
		return this.database.execute('SELECT * FROM products');
	}
}
