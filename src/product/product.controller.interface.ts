import { Request, Response, NextFunction, Router } from 'express';

export interface IProductController {
	router: Router;
	create: ({ body }: Request, res: Response, next: NextFunction) => Promise<void>;
	update: ({ body }: Request, res: Response, next: NextFunction) => Promise<void>;
	delete: ({ body }: Request, res: Response, next: NextFunction) => Promise<void>;
	findById: ({ body }: Request, res: Response, next: NextFunction) => Promise<void>;
	find: ({ body }: Request, res: Response, next: NextFunction) => Promise<void>;
}
