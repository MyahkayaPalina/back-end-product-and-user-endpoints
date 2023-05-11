import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

import { IMiddleware } from './middleware.interface';
import { ITokenPayload } from '../auth/auth.token.interface';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: Secret) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		const token = (req.query.token || req.headers['x-access-token']) as string;

		if (!token) return next();

		try {
			req.userPayload = jwt.verify(token, this.secret) as ITokenPayload;

			return next();
		} catch (err) {
			return next(err);
		}
	}
}
