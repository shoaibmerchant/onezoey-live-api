
import { Types } from '@actonate/mirkwood';
import { Authenticator } from '@actonate/mirkwood';
import bcrypt from 'bcrypt';
import { UnknownError, ForbiddenError, AuthenticationRequiredError } from '@actonate/mirkwood/errors';

const getpasswordhash=`
  query getpasswordhash($email:User_FindInputType!){
    users{
      database{
        all(find:{
          email:$emial
        }){
          first_name  
          email
          password               
        }
      }
    }
  }
  `;
  const login=`
  query getloginuser($email:String, $pswd: String){
    users{
      database{
        one(find:{
          email:$email
          password:$pswd
        }){
          first_name
          _id   
          email
          
        }
      }
    }
  } 
  `;
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
  type: Types.Boolean,
  resolve: (_, { input }, { gql, req }) => {
    const password = input.password;
  
	
    return new Promise((resolve, reject) => {
			gql.query(getpasswordhash,
				'users.database.all',
				{
					variables: {
						email:input.email
					}
				}
			)
        .then((res) => {
          if (res && res[0]) {
            bcrypt.compare(password, res[2], function(err, res) {
              //console.log('compared true: ' + res);
              //console.log('compared true cb end: ' + (Date.now() - start) + 'ms');
            });

          //  Authenticator.authenticate({ role: 'user', user: res[0] }, req);
            resolve(true);
          } else {
            resolve(false);
          }
        })
				.catch((err) => {
					//console.error(err);
					reject(new UnknownError(err));
				});
    });
	}
};
