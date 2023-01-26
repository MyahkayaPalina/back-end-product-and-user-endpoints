import { ProductController } from './product.controller';
import { IProduct } from './product.interface';
import { IDatabase } from '../database/database.interface';

import { Product } from './product.entity';

export class ProductService {
	constructor(protected db: IDatabase) {
		this.db = db;
	}

	async addProduct(product: IProduct): Promise<Product | null> {
		const newProduct = new Product(product);

		await this.db.execute(
			`
				INSERT INTO products (title, price, description, img)
				VALUES (?, ?, ?, ?)
			`,
			[newProduct.title, newProduct.price, newProduct.description, newProduct.img],
		);

		return newProduct;
	}

	async editProduct(product: IProduct): Promise<Product | null> {
		//TODO AFTER adding CRM. only changed fields shall be send and updated
		const newProduct = new Product(product);

		await this.db.execute(
			`
			UPDATE products
			SET title=?, price=?, description=?, img=?
			WHERE id=?
		`,
			[
				newProduct.title,
				newProduct.price,
				newProduct.description,
				newProduct.img,
				Number(newProduct.id),
			],
		);

		return newProduct;
	}

	async deleteProduct(product: IProduct): Promise<Product | null> {
		const deletedProduct = new Product(product);

		await this.db.execute(
			`
		    DELETE FROM products WHERE id=?
		  `,
			[Number(deletedProduct.id)],
		);

		return deletedProduct;
	}

	async getProduct(product: IProduct): Promise<Product | null> {
		const gettedProduct = new Product(product);

		return this.db
			.execute(
				`
			 SELECT * FROM products WHERE products.id = ?
		  `,
				[Number(gettedProduct.id)],
			)
			.then((products) => {
				if (Array.isArray(products)) {
					return products[0];
				}

				return undefined;
			})
			.catch(() => undefined);
	}

	async getProducts(): Promise<Product[] | unknown> {
		return this.db
			.execute('SELECT * FROM products')
			.then((products) => products)
			.catch(() => undefined);
	}
}
