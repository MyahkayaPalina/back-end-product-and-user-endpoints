import { Prisma } from '@prisma/client';
import { IsEmpty, IsInt, IsOptional, Length, Max, Min, IsString } from 'class-validator';

export class UpdateProductDto implements Omit<Prisma.ProductUpdateInput, 'id'> {
	@IsOptional()
	@IsString()
	@Length(1, 255)
	title?: string;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(10000000)
	price?: number;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsString()
	@Length(1, 1000)
	img?: string;

	@IsEmpty()
	createdAt: Date;

	@IsEmpty()
	updatedAt: Date;
}
