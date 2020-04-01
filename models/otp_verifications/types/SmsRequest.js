import { Types } from 'mirkwood-graphql';

export default {
  name: 'SmsRequest',
  fields: {
    authkey: {
      type: Types.String,
      defaultValue: process.env['MSG91_AUTHKEY']
    },
    sender: {
      type: Types.String,
      defaultValue: "GRAPST"
    },
    mobiles: {
      type: Types.String,
      required: true
    },
    message: {
      type: Types.String,
      required: true
    },
    route: {
      type: Types.String,
      defaultValue: '4'
    },
    country: {
      type: Types.String,
      defaultValue: '91'
    }
  }
}
