import { Request, Response, NextFunction, Router } from 'express';

type param = string | number | undefined;

export interface IDatabase {
	execute: (comand: string, params?: param[]) => Promise<unknown>;
}
