import { Request, Response, NextFunction, Router } from 'express';

export interface ICategoryController {
	router: Router;
	create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	find: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
