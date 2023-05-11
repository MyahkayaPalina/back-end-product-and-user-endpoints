interface IMailerService {
	sendRestorePasswordLinkToEmail: (email: string, url: string) => Promise<void>;
}

export { IMailerService };
