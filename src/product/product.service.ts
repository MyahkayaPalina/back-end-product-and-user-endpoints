import { Product } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { injectable, inject } from 'inversify';

import { TYPES } from '../constants/types';
import { CreateProductDto } from './dto/product-create.dto';
import { UpdateProductDto } from './dto/product-update.dto';
import { IProductService } from './product.service.interface';
import { IProductRepository } from './product.repository.interface';
import { Exception } from '../exception/exception';

@injectable()
export class ProductService implements IProductService {
	constructor(@inject(TYPES.IProductRepository) private productRepository: IProductRepository) {}

	async create(product: CreateProductDto): Promise<Product> {
		if (!product.title) {
			throw new Exception(StatusCodes.BAD_REQUEST, 'Title not provided');
		}

		return await this.productRepository.create(product);
	}

	async update(product: UpdateProductDto, id: number): Promise<Product> {
		return await this.productRepository.update(product, id);
	}

	async delete(id: number): Promise<Product> {
		return await this.productRepository.delete(id);
	}

	async findById(id: number): Promise<Product> {
		return await this.productRepository.findById(id);
	}

	async find(skip: number, take: number): Promise<Product[]> {
		return await this.productRepository.find(skip, take);
	}
}
