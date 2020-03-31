import sha1 from 'sha1';
import { Types } from '@actonate/mirkwood';
import { Authenticator } from '@actonate/mirkwood';

export default {
  name: 'UserMe',
  args: {
  },
  type: {
    name: 'DoctorAuthSession',
    fields: () => ({
      role: {
        type: Types.String
      },
      user: {
        type: Types.get('DoctorType')
      }
    })
  },
  resolve: (_, { }, { gql, req }) => {
    let session = Authenticator.user(req);
    if (!session) {
      return { role: 'user', user: null };
    }
    let { role, user } = session;
    return { role, user };
  }
};
