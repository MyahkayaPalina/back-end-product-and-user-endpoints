import { inject, injectable } from 'inversify';
import { Product } from '@prisma/client';

import { TYPES } from '../constants/types';
import { IDatabaseService } from '../database/database.service.interface';
import { CreateProductDto } from './dto/product-create.dto';
import { UpdateProductDto } from './dto/product-update.dto';
import { IProductRepository } from './product.repository.interface';

@injectable()
export class ProductRepository implements IProductRepository {
	constructor(@inject(TYPES.IDatabaseService) protected database: IDatabaseService) {}

	async create(product: CreateProductDto): Promise<Product> {
		return await this.database.client.product.create({
			data: product,
		});
	}

	async update(product: UpdateProductDto, id: number): Promise<Product> {
		return await this.database.client.product.update({
			where: { id },
			data: product,
		});
	}

	async delete(id: number): Promise<Product> {
		return await this.database.client.product.delete({ where: { id } });
	}

	async findById(id: number): Promise<Product> {
		return await this.database.client.product.findUniqueOrThrow({ where: { id } });
	}

	async find(skip: number, take: number): Promise<Product[]> {
		return await this.database.client.product.findMany({ skip, take });
	}
}
