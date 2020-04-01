import { Types } from 'mirkwood-graphql';
import { Authenticator } from 'mirkwood-graphql'
import { error } from 'util';

export default {
  name: 'getUserData',
  type: 'UserType',
  args: {
    userId: {
      type: Types.ID,
      required: true,
    }
  },
  resolve: (_, { userId }, { gql, req }, { cacheControl }) => {
    cacheControl.setCacheHint({ maxAge: 0 });
    // check for authentication
    if (!req.session.auth) {
      return Promise.resolve([]);
    }
    const user_id = userId;

    const getUserDetailsQuery = `
    query getUserDetails($user_id: ID!) {
      users {
        database {
          one(find: {
            _id: $user_id
          }) {
            _id
            first_name
            last_name
            email
            mobile
            country
            gender
            loyalty_points_balance
            wallet_balance
            is_mobile_verified
            _created_at
            _updated_at
          }
        }
      }
    }
    `;

    return new Promise((resolve, reject) => {
      gql.query(getUserDetailsQuery,
        'users.database.one',
        {
          variables: {
            user_id: user_id
          }
        }
      )
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          console.error("get user data error ", err);
          reject(err);
        });
    });
  }
};
