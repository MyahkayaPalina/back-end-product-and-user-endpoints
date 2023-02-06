import * as dotenv from 'dotenv';
import joi from 'joi';
import { inject, injectable } from 'inversify';

import { ILoggerService } from './logger/logger.service.interface';
import { TYPES } from './constants/types';

@injectable()
export class Config {
	@inject(TYPES.ILoggerService) private _logger: ILoggerService;

	init(): void {
		const JOI_SHEME = joi.object().keys({
			APP_ENV: joi.string().valid('development', 'test', 'production').required(),
			APP_PORT: joi.string().length(4).required(),
			DB_HOST: joi.string().required(),
			DB_PORT: joi.string().length(4).required(),
			DB_NAME: joi.string().required(),
			DB_USERNAME: joi.string().valid('root', 'guest').required(),
			DB_PASSWORD: joi.string().min(8).max(30).required(),
		});

		dotenv.config();

		const { error } = JOI_SHEME.validate(process.env, { allowUnknown: true });

		if (error) {
			this._logger.error(new Error(error.details[0].message));
		}
	}
}
