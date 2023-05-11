import { Prisma, Role } from '@prisma/client';

export const usersData: Prisma.UserCreateInput[] = [
	{
		role: Role.ADMIN,
		email: 'admin1@admin.com',
		password: '123456789',
	},
	{
		role: Role.ADMIN,
		email: 'admin2@admin.com',
		password: '123456789',
	},
	{
		role: Role.MANAGER,
		email: 'manager1@manager.com',
		password: '12345',
		name: 'Manager',
		surname: 'Manager surname',
	},
	{
		role: Role.MANAGER,
		email: 'manager2@manager.com',
		password: '12345',
		name: 'Manager 2',
		surname: 'Manager surname 2',
	},
	{
		role: Role.USER,
		email: 'user1@user.com',
		password: '111111111',
	},
	{
		role: Role.USER,
		email: 'user2@user.com',
		password: '111111111',
	},
	{
		role: Role.USER,
		email: 'user3@user.com',
		password: '111111111',
	},
];
