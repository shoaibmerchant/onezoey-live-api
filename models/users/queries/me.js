import sha1 from 'sha1';
import { Types } from 'mirkwood-graphql';
import { Authenticator } from 'mirkwood-graphql';
import { UnknownError, ForbiddenError, AuthenticationRequiredError } from 'mirkwood-graphql/errors';

export default {
	name: 'UserMe',
	args: {
  },
  type: {
    name: 'UserAuthSession',
    fields: () => ({
      role: {
        type: Types.String
      },
      user: {
        type: Types.get('UserType')
      }
    })
  },
  resolve: (_, { }, { gql, req }, { cacheControl }) => {
    cacheControl.setCacheHint({ maxAge: 0 });

    let session = Authenticator.session(req);
    if (!session) {
      throw new AuthenticationRequiredError();
    }
    let { role, user } = session;
    return { role, user };
	}
};
