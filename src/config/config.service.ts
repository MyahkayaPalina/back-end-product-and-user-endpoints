import * as dotenv from 'dotenv';
import joi from 'joi';
import { inject, injectable } from 'inversify';
import 'dotenv/config';

import { ILoggerService } from '../logger/logger.service.interface';
import { TYPES } from '../constants/types';
import { IConfigService } from './config.service.interface';

@injectable()
class ConfigService implements IConfigService {
	private config: dotenv.DotenvParseOutput;

	constructor(@inject(TYPES.ILoggerService) private loggerService: ILoggerService) {
		const JOI_SHEME = joi.object().keys({
			APP_ENV: joi.string().valid('development', 'test', 'production').required(),
			APP_PORT: joi.string().length(4).required(),
			POSTGRES_USER: joi.string().required(),
			POSTGRES_PASSWORD: joi.string().required(),
			POSTGRES_DB: joi.string().required(),
			PGADMIN_DEFAULT_PASSWORD: joi.string().valid('admin', 'guest').required(),
			PGADMIN_DEFAULT_EMAIL: joi.string().required(),
			DATABASE_URL: joi.string().required(),
			JWT_ACCESS_TOKEN_SECRET: joi.number().required(),
			JWT_ACCESS_TOKEN_EXPIRATION_TIME: joi.number().required(),
			JWT_REFRESH_TOKEN_SECRET: joi.number().required(),
			JWT_REFRESH_TOKEN_EXPIRATION_TIME: joi.number().required(),
			SALT: joi.string().required(),
			CLIENT_URL: joi.string().required(),
			HOST_NODEMAILER: joi.string().required(),
			HOST_NODEMAILER_PORT: joi.number().required(),
			ROOT_EMAIL: joi.string().required(),
			ROOT_EMAIL_PASSWORD: joi.string().required(),
		});

		const result = dotenv.config();
		const { error } = JOI_SHEME.validate(process.env, { allowUnknown: true });

		if (result.error || error) {
			this.loggerService.error('[ConfigService] The .env file could not be read or is missing');
		} else {
			this.loggerService.log('[ConfigService]: .env file is loaded');
			this.config = result.parsed as dotenv.DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}

export { ConfigService };
