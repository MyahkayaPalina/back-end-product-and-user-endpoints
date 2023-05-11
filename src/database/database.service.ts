import { PrismaClient } from '@prisma/client';

import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { IDatabaseService } from './database.service.interface';
import { ILoggerService } from '../logger/logger.service.interface';
import { TYPES } from '../constants/types';

@injectable()
export class DatabaseService implements IDatabaseService {
	public client: PrismaClient;

	constructor(@inject(TYPES.ILoggerService) protected logger: ILoggerService) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();

			this.logger.log('Database is connected');
		} catch (err: unknown) {
			this.logger.error(`${StatusCodes.INTERNAL_SERVER_ERROR}. Database is not connected`);
		}
	}

	async disconnect(): Promise<void> {
		this.client.$disconnect();
	}
}
