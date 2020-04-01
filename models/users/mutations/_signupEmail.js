import { Types } from 'mirkwood-graphql';

export default {
	name: 'UserSignupEmail',
	internal: true,
	resolve: 'email.send',
};
