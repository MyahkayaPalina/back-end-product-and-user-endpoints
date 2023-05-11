export const getParsedLimit = (limit: number, defaultValue: number, maxValue: number): number => {
	return limit ? (limit > maxValue ? maxValue : limit) : defaultValue;
};
