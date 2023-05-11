import { Product } from '@prisma/client';

import { CreateProductDto } from './dto/product-create.dto';
import { UpdateProductDto } from './dto/product-update.dto';

export interface IProductService {
	create: (product: CreateProductDto) => Promise<Product>;
	update: (product: UpdateProductDto, id: number) => Promise<Product>;
	delete: (id: number) => Promise<Product>;
	findById: (id: number) => Promise<Product>;
	find: (skip: number, take: number) => Promise<Product[]>;
}
