import { Request, Response, NextFunction } from 'express';

import { IMiddleware } from './middleware.interface';

export interface IRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: 'get' | 'post' | 'patch' | 'delete' | 'use';
	middlewares?: IMiddleware[];
}
