import { Types, Authenticator } from '@actonate/mirkwood';

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
  name: 'VerifyOTP',
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
  type: Types.String,
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
          console.log('reolving');

            resolve(true);
          
        }
      })
      .catch(err => {
        reject(err)
      })
    })

    
  }
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
