import { Types } from 'mirkwood-graphql';

export default {
	name: 'ForgotPasswordEmail',
	internal: true,
  resolve: 'email.send',
  args : {
    input: {
      type: {
        fields: {
          name: {
            type: Types.String
          },
          link: {
            type: Types.String
          },
          baseUrl: {
            type: Types.String
          }
        }
      }
    }
  },
};
