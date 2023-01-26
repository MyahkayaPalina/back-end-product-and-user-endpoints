import { hash } from 'bcryptjs';

export class User {
	private _email: string;
	private _name: string;
	private _password: string | undefined;

	constructor(_email: string, _name: string) {
		this._email = _email;
		this._name = _name;
	}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get password(): string | undefined {
		return this._password;
	}

	public async setPassword(_password: string): Promise<void> {
		this._password = await hash(_password, 10);
	}
}
