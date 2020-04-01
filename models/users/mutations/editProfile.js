
import { Types } from 'mirkwood-graphql';
import { Authenticator } from 'mirkwood-graphql';

import { UnknownError, ForbiddenError, AuthenticationRequiredError } from 'mirkwood-graphql/errors';
// import { concat } from 'async';

  const Updateprofile=`
  mutation updateprofile($_id: ID!,$user: User_UpdateInputType!){
  users{
    database{
      update(
        _id:$_id
        input:$user
      )
    }
  }
}

  `;
export default {
	name: 'editProfile',
  args : {
    input: {
      type: {
	      fields: {
          first_name: {
						type: Types.String,
						required: true
					},
					last_name: {
						type: Types.String,
						required: true
          },
          gender: {
            type: Types.String,
            required: true
          },
	        mobile: {
	          type: Types.String,
						required: true
	        },

	      }
	    }
    }
  },
  type: Types.Boolean,
  resolve: (_, { input }, { gql, req }) => {
    const { user } = req.session.auth;
    return new Promise((resolve, reject) => {
			gql.mutation(Updateprofile,
				'users.database.all', {
					variables: {
            _id: user._id,
						user:input
					}
				}
			)
        .then((res) => {
          Authenticator.authenticate({ role: 'user', user: {
            ...user,
            ...input,
          } }, req);
          resolve(true);
        })
				.catch((err) => {
          console.error(err);
          reject(new UnknownError(err));
				});
    });
	}
};
