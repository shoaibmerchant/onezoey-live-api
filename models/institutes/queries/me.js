import sha1 from 'sha1';
import { Types } from 'mirkwood-graphql';
import { Authenticator } from 'mirkwood-graphql';

export default {
  name: 'UserMe',
  args: {
  },
  type: {
    name: 'InstituteAuthSession',
    fields: () => ({
      role: {
        type: Types.String
      },
      user: {
        type: Types.get('InstituteType')
      }
    })
  },
  resolve: (_, { }, { gql, req }) => {
    let session = Authenticator.user(req);
    if (!session) {
      return { role: 'institute_admin', user: null };
    }
    let { role, user } = session;
    return { role, user };
  }
};
