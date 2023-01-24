import express, { Request, Response, NextFunction } from 'express';

export interface IErrorsController {
	catch: (err: Error, req: Request, res: Response, next: NextFunction) => void;
}
