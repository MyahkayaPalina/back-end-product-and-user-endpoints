import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { Exception } from '../exception/exception';
import { IMiddleware } from './middleware.interface';

export class GuardMiddleware implements IMiddleware {
	constructor(private allowedRoles: Role[] = []) {}

	execute({ userPayload }: Request, res: Response, next: NextFunction): void {
		if (!userPayload) {
			return next(new Exception(StatusCodes.FORBIDDEN, 'User not authorized'));
		}

		if (this.allowedRoles.length && !this.allowedRoles.includes(userPayload.role)) {
			return next(new Exception(StatusCodes.FORBIDDEN, 'No permissions'));
		}

		return next();
	}
}
