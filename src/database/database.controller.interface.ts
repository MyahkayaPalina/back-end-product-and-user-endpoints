export type paramType = string | number | undefined;
export type executeDatabaseType = (comand: string, params?: paramType[]) => Promise<unknown>;

export interface IDatabaseController {
	execute: executeDatabaseType;
	connect: () => Promise<void>;
}
