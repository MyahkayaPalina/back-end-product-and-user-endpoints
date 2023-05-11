import { Response } from 'express';
import { IRoute } from './route.interface';

export interface IBaseController {
	addRoutes(routes: IRoute[], parentRouterPath: string): void;
	send<T>(res: Response, code: number, message?: T): void;
	sendError(res: Response, err: Error, code?: number): void;
	sendOk<T>(res: Response, message: T): void;
}
