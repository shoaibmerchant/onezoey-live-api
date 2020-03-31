import { Types } from '@actonate/mirkwood';
import AWS from 'aws-sdk';
var sns = new AWS.SNS({
  region: 'us-east-1',
  accessKeyId: process.env['NGS_PROD_AWS_ACCESS_KEY'],
  secretAccessKey: process.env['NGS_PROD_AWS_SECRET']
});
// let setParams = {
//   attributes: { /* required */
//     'DefaultSenderID': 'NEOGAM',
//     'DefaultSMSType': 'Transactional'
//   }
// };
// sns.setSMSAttributes(setParams, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log("SET PARAMS", data);           // successful response
// });

export default {
	name: 'sendSMS',
	args: {
		input: {
      type: {
        fields: {
          message: {
            type: Types.String
          },
          mobile: {
            type: Types.String
          }
        }
      }
    }
  },
  resolve: (_, { input } ) => {
    return new Promise((resolve, reject) => {
      var params = {
        Message: input.message,
        MessageStructure: 'string',
        PhoneNumber: input.mobile
      };
      // sns.publish(params, function(err, data) {
      //   if (err) console.log(err, err.stack); // an error occurred
      //   else {
      //     console.log('*****sending sms*****', data);
      //     resolve(data);
      //   } // successful response
      // });
      resolve(true)
    })
  }
};
