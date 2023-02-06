import { StatusCodes } from 'http-status-codes';
import { injectable, inject } from 'inversify';

import { TYPES } from '../constants/types';
import { AddProductDto } from './dto/product-add.dto';
import { EditProductDto } from './dto/product-edit.dto';
import { DeleteProductDto } from './dto/product-delete.dto';
import { GetProductDto } from './dto/product-get.dto';
import { IProductService } from './product.service.interface';
import { IProductDatabase } from './product.database.interface';
import { Exception } from '../exception/exception.entity';

@injectable()
export class ProductService implements IProductService {
	@inject(TYPES.IProductDatabase) private _database: IProductDatabase;

	async addProduct(product: AddProductDto): Promise<void> {
		if (!product.title) {
			throw new Exception(StatusCodes.BAD_REQUEST, 'Title not provided');
		}

		await this._database.addProduct(product, product.title).catch(() => {
			throw new Exception(StatusCodes.INTERNAL_SERVER_ERROR, 'Database connection failed');
		});
	}

	async editProduct(product: EditProductDto): Promise<EditProductDto | unknown> {
		if (!product.id) {
			throw new Exception(StatusCodes.BAD_REQUEST, 'Id not provided');
		}
		//TODO AFTER adding CRM. only changed fields shall be send and updated
		return await this._database.editProduct(product, Number(product.id)).catch(() => {
			throw new Exception(StatusCodes.INTERNAL_SERVER_ERROR, 'Database connection failed');
		});
	}

	async deleteProduct(product: DeleteProductDto): Promise<DeleteProductDto | unknown> {
		if (!product.id) {
			throw new Exception(StatusCodes.BAD_REQUEST, 'Id not provided');
		}

		return await this._database.deleteProduct(Number(product.id)).catch(() => {
			throw new Exception(StatusCodes.INTERNAL_SERVER_ERROR, 'Database connection failed');
		});
	}

	async getProduct(product: GetProductDto): Promise<GetProductDto> {
		return this._database
			.getProduct(Number(product.id))
			.then((products: GetProductDto[] | unknown) => {
				if (Array.isArray(products)) {
					return products[0];
				}
			})
			.catch(() => {
				throw new Exception(StatusCodes.NO_CONTENT, 'Product with provided id is not exist');
			});
	}

	async getProducts(): Promise<GetProductDto[] | unknown> {
		return this._database.getProducts().catch(() => {
			throw new Exception(StatusCodes.NO_CONTENT, 'There is no products yet');
		});
	}
}
