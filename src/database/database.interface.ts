import { Request, Response, NextFunction, Router } from 'express';

type param = string | number | null;

export interface IDatabase {
	execute: (comand: string, params?: param[]) => Promise<unknown>;
}
