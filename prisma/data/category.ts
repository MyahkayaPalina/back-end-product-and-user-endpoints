import { Prisma } from '@prisma/client';

export const categoriesData: Prisma.CategoryCreateInput[] = [
	{
		title: 'Home',
	},
	{
		title: 'Garden',
	},
	{
		title: 'Other',
	},
];
