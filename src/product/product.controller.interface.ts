import { Request, Response, NextFunction } from 'express';

import { Router } from 'express';

export interface IProductController {
	router: Router;
	add: ({ body }: Request, res: Response, next: NextFunction) => Promise<void>;
	edit: ({ body }: Request, res: Response, next: NextFunction) => Promise<void>;
	delete: ({ body }: Request, res: Response, next: NextFunction) => Promise<void>;
	get: ({ body }: Request, res: Response, next: NextFunction) => Promise<void>;
	default: (_: Request, res: Response, next: NextFunction) => Promise<void>;
}
