
import { Types } from 'mirkwood-graphql';
import { Authenticator } from 'mirkwood-graphql';
import bcrypt from 'bcrypt';
// import { UserAuth } from '../../../libs/UserAuth';
// import {CartData} from '../../../libs/CartData'
import { UnknownError, ForbiddenError, AuthenticationRequiredError } from 'mirkwood-graphql/errors';
// import { concat } from 'async';


const getpasswordhash = `
  query getpasswordhash($email:String!){
    users{
      database{
        all(find:{
          email:$email
        }){
          _id
          first_name
          email
          password
          last_name
          wallet_balance
        }
      }
    }
  }`;

export default {
  name: 'UserLogin',
  args: {
    input: {
      type: {
        fields: {
          email: {
            type: Types.String,
            required: true
          },
          password: {
            type: Types.String,
            password: true,
            descriptor: 'password',
            required: true
          }

        }
      }
    }
  },
  resolve: (_, { input }, { gql, req }) => {
    const password = input.password;
    //console.log("email",req.session.auth)
    return new Promise((resolve, reject) => {
      gql.query(getpasswordhash,
        'users.database.all',
        {
          variables: {
            email: input.email
          }
        }
      )
        .then((res) => {
          if (res && res[0].password) {
            bcrypt.compare(password, res[0].password, function (err, resp) {

              if (resp == true) {
                Authenticator.authenticate({ role: 'user', user: res[0] }, req);
                delete res[0].password;
                resolve(res[0]);
              }
              else {
                console.log('login error', err);
                resolve(null);
              }
            });
          }
          else {
            console.log('login error');
            resolve(null);
          }
        })
        .catch((err) => {
          console.error("login error", err);
          reject(new UnknownError(err));

        });
    });
  }
};
