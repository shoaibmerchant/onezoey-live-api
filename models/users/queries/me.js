import sha1 from 'sha1';
import { Types } from '@actonate/mirkwood';
import { Authenticator } from '@actonate/mirkwood';
import { UnknownError, ForbiddenError, AuthenticationRequiredError } from '@actonate/mirkwood/errors';

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
