import { Types } from '@actonate/mirkwood';

export default {
	name: 'UserSignupEmail',
	internal: true,
	resolve: 'queue.push',
};
