import mysql from 'mysql2';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import {
	IDatabaseController,
	paramType,
	executeDatabaseType,
} from './database.controller.interface';
import { Exception } from '../exception/exception.entity';
import { ILoggerService } from '../logger/logger.service.interface';
import { TYPES } from '../constants/types';

@injectable()
export class DatabaseController implements IDatabaseController {
	@inject(TYPES.ILoggerService) protected logger: ILoggerService;

	private executeDatabase: unknown | executeDatabaseType;

	async execute(comand: string, params?: paramType[]): Promise<unknown> {
		if (typeof this.executeDatabase === 'function') {
			return this.executeDatabase(comand, params);
		}

		throw new Exception(
			StatusCodes.INTERNAL_SERVER_ERROR,
			'Connect to database before run the execution',
		);
	}

	async connect(): Promise<void> {
		try {
			const { DB_HOST, DB_PORT, DB_USERNAME, DB_NAME, DB_PASSWORD } = process.env;
			const pool = mysql.createPool({
				host: DB_HOST,
				port: Number(DB_PORT),
				user: DB_USERNAME,
				database: DB_NAME,
				password: DB_PASSWORD,
			});

			this.executeDatabase = pool.promise().execute;
			this.logger.log('Database is connected');
		} catch {
			throw new Exception(StatusCodes.INTERNAL_SERVER_ERROR, 'Database is not connected');
		}
	}
}
