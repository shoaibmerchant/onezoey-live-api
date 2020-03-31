import { Types, Authenticator } from '@actonate/mirkwood';
import { ForbiddenError } from '@actonate/mirkwood/errors';

let queryVerifyOTP = ({phone, code}) => `
  query otpVerification {
    otp_verifications {
      database {
        one(find:{
          phone:"${phone}",
          code:"${code}"
        }) {
          _id
          phone
          code
          time_stamp
          _created_at
          _updated_at
        }
      }
    }
  }
`;

const getUserDetails=`
  query getUserDetails($mobile : String){
    users{
      database{
        all(find:{
          mobile : $mobile
        }){
          _id
          email
          mobile
          first_name
          last_name
          date_of_birth
          is_mobile_verified
          is_email_verified
          smoking_level
          alcohol_level
          workout_level
          has_qrcode_linked
          chat_username
          chat_password
          chat_id
          _created_at
          _updated_at
        }
      }
    }
  }`

let deleteOTPQuery = ({_id}) => `
  mutation DeleteOTP {
    otp_verifications {
      database {
        destroy(_id:"${_id}")
      }
    }
  }
`

export default {
  name: 'VerifyLoginOTP',
  args: {
    input: {
      type: {
        fields: {
          phone: {
            type: Types.String,
            hidden:true
          },
          code: {
            type: Types.String
          }
        }
      }
    }
  },
  type: 'UserType',
  resolve: (_, { input }, { gql }) => {
    let variables = {
      variables: {
        phone: input.phone,
        code: input.code
      }
    };
    console.log('input', variables);

    return new Promise((resolve, reject) => {
      // gql.mutation(queryVerifyOTP, 'opt_verifiactions.database.one', variables)
      let q = queryVerifyOTP(input);
      console.log('q', q);
      gql.query(q)
      .then(res => {
        const obj = res.otp_verifications.database.one;
        if(!obj) {
          reject(obj);
        }
        const created_at = new Date(obj._created_at);
        const now = new Date();
        const diff = getDuration(created_at, now);
        let minutesPast = 30;
        try {
          minutesPast = diff.diffMins + ((diff.diffDays * 24) * 60) + (diff.diffHrs * 60);
        } catch(err) {
          console.log(err);
        }
        if(minutesPast > 15) {
          deleteOTP(obj._id, gql);
          console.log('rejecting')
          reject({result:false});
        } else {
          deleteOTP(obj._id, gql);
          console.log('resolving');

          getUser(input.phone, gql)
          .then(response=>{
            console.log('getUser Response', response);
            if (response.length === 0) {
              reject(new ForbiddenError("User not registered"));
              // reject({result: false});
              // return;
            } else {
              const token = Authenticator.token({ role: 'user', user: response[0] })
              const newResponse =  { ...response[0], token };
              resolve(newResponse);
            }
          })

        }
      })
      .catch(err => {
        reject(err)
      })
    })

  }
}


function getUser(mobile, gql){
  return gql.query(getUserDetails,
   'users.database.all', {
     variables:{
       mobile : mobile
     }
   })
 }




/**
 * To get difference between two dates
 *
 * @param {Date} prevDate
 * @param {Date} upcomingDate
 * @returns
 */
function getDuration(prevDate, upcomingDate) {
  var diffMs = (upcomingDate - prevDate); // milliseconds between now & Christmas
  var diffDays = Math.floor(diffMs / 86400000); // days
  var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
  var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
  console.log(diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes =)");
  return {
    diffMs,
    diffDays,
    diffHrs,
    diffMins
  };
}

function deleteOTP(_id, gql) {
  gql.mutation(deleteOTPQuery({_id}))
  .then(res => {
    console.log('OTP Deleted', res);
  })
  .catch(err => {
    console.log('Got error while deleting OTP ', err)
  })
}
