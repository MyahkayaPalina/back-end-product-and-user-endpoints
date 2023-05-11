import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import { inject, injectable } from 'inversify';

import { TYPES } from '../constants/types';
import { IMailerService } from './mailer.service.interface';
import { IConfigService } from '../config/config.service.interface';
import { ILoggerService } from '../logger/logger.service.interface';

@injectable()
class MailerService implements IMailerService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.ILoggerService) private logger: ILoggerService,
	) {}

	private async getMailSender(): Promise<{ user: string; pass: string }> {
		if (this.configService.get('APP_ENV') === 'development') {
			return await nodemailer.createTestAccount();
		}

		return {
			user: this.configService.get('ROOT_EMAIL'),
			pass: this.configService.get('ROOT_EMAIL_PASSWORD'),
		};
	}

	private getTemplate({ url }: { url: string }): string {
		const file = fs.readFileSync(
			path.join(__dirname, '../templates/restore-password.template.hbs'),
			'utf8',
		);
		const template = handlebars.compile(file);

		return template({ url });
	}

	async sendRestorePasswordLinkToEmail(email: string, url: string): Promise<void> {
		const { user, pass } = await this.getMailSender();

		const transporter = nodemailer.createTransport({
			host: this.configService.get('HOST_NODEMAILER'),
			port: Number(this.configService.get('HOST_NODEMAILER_PORT')),
			secure: false,
			auth: { user, pass },
		});

		const mailOptions = {
			from: this.configService.get('ROOT_EMAIL'),
			to: `${email}`,
			subject: 'Restore your passoword',
			html: this.getTemplate({ url }),
		};

		const info = await transporter.sendMail(mailOptions);

		this.logger.log(
			`Send restore password email to: ${email} with link: ${nodemailer.getTestMessageUrl(info)}`,
		);
	}
}
export { MailerService };
