import { Request, Response, NextFunction } from 'express';

export interface IExceptionController {
	catch: (err: Error, req: Request, res: Response, next: NextFunction) => void;
}
