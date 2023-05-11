import { Category } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { ICategoryService } from './category.service.interface';
import { TYPES } from '../constants/types';
import { ICategoryRepository } from './category.repository.interface';

@injectable()
export class CategoryService implements ICategoryService {
	constructor(@inject(TYPES.ICategoryRepository) private categoryRepository: ICategoryRepository) {}
	create(title: string): Promise<Category> {
		return this.categoryRepository.create(title);
	}

	find(skip: number, take: number): Promise<Category[]> {
		return this.categoryRepository.find(skip, take);
	}
}
