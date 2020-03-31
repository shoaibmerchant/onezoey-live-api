import { Types } from '@actonate/mirkwood';
import bcrypt from 'bcrypt';

const changePasswordMutation = `
mutation updatepassword($user_id: ID!, $password: String!) {
  users {
    database {
      update(_id: $user_id, input: {password: $password})
    }
  }
}`;
export default {
	name: 'resetPassword',
  args: {
    user_id: {
      type: Types.ID
    },
    password: {
      type: Types.String
    }
  },
  resolve: (_, { user_id, password }, { gql, req }) => {
    //console.log("USER_ID: ", user_id);
    //console.log("PASSWORD:", password);

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(password, salt);

    return new Promise ((resolve, reject) => {

      changePassword(gql, user_id, passwordHash)
        .then(resp => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });

    });
  }

}

function changePassword(gql, user_id, password) {
  return new Promise((resolve, reject) => {
    gql.mutation(
      changePasswordMutation,
      'users.database.update',
      {
        variables: {
          user_id: user_id,
          password: password
        }
      })
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
}
