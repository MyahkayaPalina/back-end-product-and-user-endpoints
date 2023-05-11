import { ITokenPayload } from '../src/auth/auth.token.interface';

declare global {
	namespace Express {
		interface Request {
			userPayload?: ITokenPayload;
		}
	}
}
