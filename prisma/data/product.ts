import { Prisma } from '@prisma/client';

export const productsData: Prisma.ProductCreateInput[] = [
	{
		title: 'Title of product 1',
		description: 'Cool product',
		category: {
			connect: {
				title: 'Home',
			},
		},
		author: {
			connect: {
				email: 'admin1@admin.com',
			},
		},
	},
	{
		title: 'Title of product 2',
		description: 'Very easy to use',
		price: 2003,
		category: {
			connect: {
				title: 'Home',
			},
		},
		author: {
			connect: {
				email: 'admin1@admin.com',
			},
		},
	},
	{
		title: 'Title of product 3',
		description: 'Need in every house',
		price: 2010,
		category: {
			connect: {
				title: 'Garden',
			},
		},
		author: {
			connect: {
				email: 'manager1@manager.com',
			},
		},
	},
	{
		title: 'Title of product 4',
		price: 2015,
		category: {
			connect: {
				title: 'Home',
			},
		},
		author: {
			connect: {
				email: 'manager2@manager.com',
			},
		},
	},
	{
		title: 'Title of product 5',
		description: 'Makes your live easier',
		price: 2003,
		category: {
			connect: {
				title: 'Garden',
			},
		},
		author: {
			connect: {
				email: 'manager1@manager.com',
			},
		},
	},
];
