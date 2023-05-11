import { Product } from '@prisma/client';
import { IsEmpty, IsInt, IsOptional, Length, Max, Min, IsString, IsDefined } from 'class-validator';

export class CreateProductDto implements Omit<Product, 'id'> {
	@IsString()
	@Length(1, 255)
	@IsDefined()
	title: string;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(10000000)
	price: number;

	@IsOptional()
	@IsString()
	description: string;

	@IsOptional()
	@IsString()
	@Length(1, 1000)
	img: string;

	@IsDefined()
	categoryId: number;

	@IsDefined()
	authorId: number;

	@IsEmpty()
	createdAt: Date;

	@IsEmpty()
	updatedAt: Date;
}
