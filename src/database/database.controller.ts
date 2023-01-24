import mysql, { Pool } from 'mysql2';

import { PORT } from '../constants';

const pool = mysql.createPool({
	host: 'localhost',
	port: Number(PORT),
	user: 'root',
	database: 'nodejslearning',
	password: 'Zz080992Zz',
});

export const db = pool.promise();
