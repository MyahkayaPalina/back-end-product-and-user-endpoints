import { injectable } from 'inversify';

@injectable()
export class Exception extends Error {
	public code: number;
	public message: string;

	constructor(code: number, message: string) {
		super();
		this.code = code;
		this.message = message;
	}
}
