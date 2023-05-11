import { Category } from '@prisma/client';

export interface ICategoryService {
	create: (title: string) => Promise<Category>;
	find: (skip: number, take: number) => Promise<Category[]>;
}
