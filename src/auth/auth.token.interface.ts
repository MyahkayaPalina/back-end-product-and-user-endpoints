import { User } from '@prisma/client';

export interface ITokenPayload {
	id: User['id'];
	role: User['role'];
	email: User['email'];
}
