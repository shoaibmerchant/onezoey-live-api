/**
 * The Session configuration will be specified below, use express-session config
 */

const session = {
	local: {
		store: 'file',
		secret: process.env.SESSION_SECRET,
		path: './tmp/sessions',
		cookie: { maxAge: 604800000 },
		connection: {
			host: process.env.SESSION_REDIS_HOST,
			port: process.env.SESSION_REDIS_PORT
		}
	},
	development: {
		store: 'file',
		secret: process.env.SESSION_SECRET,
		path: './tmp/sessions',
		cookie: {
			maxAge: 604800000,
			domain: process.env.SESSION_DOMAIN
		},
		connection: {
			host: process.env.SESSION_REDIS_HOST,
			port: process.env.SESSION_REDIS_PORT
		}
	},
	production: {
		store: 'file',
		secret: process.env.SESSION_SECRET,
		path: './tmp/sessions',
		cookie: {
			maxAge: 604800000,
			domain: process.env.SESSION_DOMAIN
		},
		connection: {
			ost: process.env.SESSION_REDIS_HOST,
			port: process.env.SESSION_REDIS_PORT
		}
	}
};

export default session;
