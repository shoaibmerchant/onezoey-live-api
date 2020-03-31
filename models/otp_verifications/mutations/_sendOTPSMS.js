// import { Types } from '@actonate/mirkwood';
// import { SmsRequest } from '../types';

// export default {
// 	name: 'mobileVerification',
// 	internal: true,
// 	resolve: 'http.request',
// 	args: {
// 		body: {
// 			type: SmsRequest
// 		}
// 	},
// 	url: {
// 		type: Types.SmsRequest,
// 		defaultValue: "http://control.msg91.com/api/sendhttp"
// 	},
// 	headers: {
// 		type: {
// 			fields: {
// 				'Accept': {
// 					type: Types.String
// 				}
// 			}
// 		}
// 	},
//   type: Types.String
// };

import { Types } from '@actonate/mirkwood';
import { SmsRequest } from '../types';

export default {
	name: 'mobileVerification',
	internal: true,
	resolve: 'http.request',
	args: {
		body: {
			type: SmsRequest
		}
	},
  type: Types.String
};

