import { User } from '@prisma/client';

export class UserDto implements Partial<User> {
	public id: User['id'];
	public role: User['role'];
	public email: User['email'];
	public password: User['password'];
	public name: User['name'];
	public surname: User['surname'];

	constructor(user: User) {
		this.id = user.id;
		this.role = user.role;
		this.email = user.email;
		this.password = user.password;
		this.name = user.name;
		this.surname = user.surname;
	}
}
