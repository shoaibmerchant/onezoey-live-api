import {
  Types
} from 'mirkwood-graphql';

export default {
  name: 'User',
  datasource: {
    collection: 'Users',
    timestamps: true
  },
  fields: {
    _id: {
      type: Types.ID,
    },
    first_name: {
      type: Types.String,
      required: true
    },
    last_name: {
      type: Types.String,
      required: true
    },
    email: {
      type: Types.String,
      required: true
    },
    mobile: {
      type: Types.String,
    },
    password: {
      type: Types.String
    },
    country: {
      type: Types.String,
      label: "Country",
      filter: true
    },
    gender: {
      type: Types.String
    },
    loyalty_points_balance: {
      type: Types.Float,
      max: 999999
    },
    wallet_balance: {
      type: Types.Float,
      label: "Wallet"
    },
    is_mobile_verified: {
      type: Types.Boolean,
    },
  },
  relations: {}
};
