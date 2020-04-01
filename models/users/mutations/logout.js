

import { Types } from 'mirkwood-graphql';

import { Authenticator } from 'mirkwood-graphql';

import { UnknownError, ForbiddenError, AuthenticationRequiredError } from 'mirkwood-graphql/errors';



export default {

	name: 'UserLogout',

	args: {

    role: {

      type: Types.String

    }

  },

  type: Types.Boolean,

  resolve: (_, { role }, { gql, req }) => {
		//console.log("UserLogout done");
    return new Promise((resolve, reject) => {

      try {

        Authenticator.unauthenticate({ role }, req);

        resolve(true);

      } catch (err) {

        reject(new UnknownError(err));

      }

    });

	}

};
