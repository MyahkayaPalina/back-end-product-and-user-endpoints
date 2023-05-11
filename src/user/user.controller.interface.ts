import { Request, Response, NextFunction, Router } from 'express';

interface IUserController {
	router: Router;
	updateRole(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export { IUserController };
