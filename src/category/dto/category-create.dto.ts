import { Category } from '@prisma/client';
import { IsString, IsDefined, IsEmpty } from 'class-validator';

export class CreateCategoryDto implements Omit<Category, 'id'> {
	@IsDefined()
	@IsString()
	title: string;

	@IsEmpty()
	createdAt: Date;

	@IsEmpty()
	updatedAt: Date;
}
