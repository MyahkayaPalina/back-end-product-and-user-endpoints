import { Category } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { TYPES } from '../constants/types';
import { IDatabaseService } from '../database/database.service.interface';
import { ICategoryRepository } from './category.repository.interface';

@injectable()
export class CategoryRepository implements ICategoryRepository {
	constructor(@inject(TYPES.IDatabaseService) private database: IDatabaseService) {}

	async create(title: string): Promise<Category> {
		return await this.database.client.category.create({
			data: { title },
		});
	}
	async find(skip: number, take: number): Promise<Category[]> {
		return await this.database.client.category.findMany({ skip, take });
	}
}
