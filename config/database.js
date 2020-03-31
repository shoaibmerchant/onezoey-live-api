/**
 * The database configuration will be specified below
 */

const database = {
  local: {
		adapter: 'postgresql',
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		database: process.env.DB_NAME,
		password: process.env.DB_PASSWORD,
	},
	development: {
		adapter: 'postgresql',
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		database: process.env.DB_NAME,
		password: process.env.DB_PASSWORD,
  },
  production: {
		adapter: 'postgresql',
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		database: process.env.DB_NAME,
		password: process.env.DB_PASSWORD,
	}
};


export default database;
