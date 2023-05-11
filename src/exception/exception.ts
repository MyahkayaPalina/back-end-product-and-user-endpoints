import { injectable } from 'inversify';

import { IException } from './exception.interface';

@injectable()
export class Exception implements IException {
	public code: number;
	public message: string;

	constructor(code: number, message: string) {
		this.code = code;
		this.message = message;
	}
}
