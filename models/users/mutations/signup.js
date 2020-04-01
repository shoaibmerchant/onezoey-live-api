import { Types } from 'mirkwood-graphql';
import bcrypt from 'bcrypt';
import { Authenticator } from 'mirkwood-graphql'
import { error } from 'util';

const welcomeEmail = `mutation sendEmail($template:String, $options:UserSignupEmail_optionsInputType){
  users{
    signupEmail(template:$template options:$options)
  }
}`

export default {
  name: 'signup',
  args: {
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
          email: {
            type: Types.String,
            required: true
          },
          password: {
            type: Types.String,
            required: true
          }
        }
      }
    }
  },
  resolve: (_, {
    input
  }, { gql, req }) => {

    const password = input.password;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(password, salt);

    // update password hash
    input.password = passwordHash;

    const createUserMutation = `
			mutation createUser($user: UserInputType!) {
				users {
					database {
						create(input: $user) {
              _id
              first_name
              last_name
              email
              password
              mobile
              wallet_balance
						}
					}
				}
			}
		`;

    const Existing = `
		query getloginuser($email:String!){
			users{
				database{
					all(find:{
						email:$email
					}){
						_id
            first_name
            last_name
            email
            password
            mobile
            wallet_balance
					}
				}
			}
		}
    `;
    function createUser(gql, input) {
      return new Promise((resolve, reject) => {
        gql
          .mutation(createUserMutation, 'users.database.create', {
            variables: {
              user: input
            }
          })
          .then(resp => {
            Authenticator.authenticate({
              role: 'user',
              user: resp
            }, req)
            // resolve(true);
            resolve(resp);
          })
          .catch(err => {
            console.log("create user ERROR:", err);
            reject(err);
          });
      });
    }

    return new Promise((resolve, reject) => {
      gql
        .query(Existing, 'users.database.all', {
          variables: {
            email: input.email
          }
        })
        .then(res => {
          if (res && res[0]) {
            // user already exists
            reject(new Error('USER_EXISTS'));
          } else {
            return createUser(gql, input)
              .then(resp => {
                delete resp.password;
                resolve(resp);
              })
              .catch(err => {
                console.log("SIGNUP_CATCH_ERROR: ", err);
                reject(err);
              });
          } //end of else

        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
