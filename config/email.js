/**
 * The Email configuration will be specified below, uses nodemailer service
 */

const email = {
  local: {
    transport: 'smtp',
		host: process.env['EMAIL_HOST'],
		auth: {
			user: process.env['EMAIL_USER'],
	    pass: process.env['EMAIL_PASS']
		},
    from: 'Cosmetize <noreply@cosmetize.com>'
  },
	development: {
    transport: 'smtp',
		host: process.env['EMAIL_HOST'],
		auth: {
			user: process.env['EMAIL_USER'],
			pass: process.env['EMAIL_PASS']
		},
    from: 'Cosmetize <noreply@cosmetize.com>'
  }, 
  production: {
    transport: 'smtp',
		host: process.env['EMAIL_HOST'],
		auth: {
			user: process.env['EMAIL_USER'],
			pass: process.env['EMAIL_PASS']
		},
    from: 'Cosmetize <noreply@cosmetize.com>'
	}
};

export default email;