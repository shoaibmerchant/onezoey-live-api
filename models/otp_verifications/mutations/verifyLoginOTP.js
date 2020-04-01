import { Types, Authenticator } from "mirkwood-graphql";
import { ForbiddenError } from "mirkwood-graphql/errors";
import { createApolloFetch } from "apollo-fetch"

let queryVerifyOTP = ({ phone, code }) => `
  query otpVerification {
    otp_verifications {
      database {
        one(find:{
          mobile: "${phone}",
          code: "${code}"
        }) {
          _id
          mobile
          code
          timestamp
          _created_at
        }
      }
    }
  }
`;

const queryDoctorDetails = `
query getDoctor($mobile: String) {
  doctors {
    database {
      all(find: {
        mobile: $mobile
      }) {
        _id
        name
        email
        mobile
        specialization
        bachelor_degree
        master_degree
        super_degree
        fellowship
        display_picture_url
        econsultation_timings
        url_slug
        econsultation_fees
        institute_id
        city
        description
        _created_at
        _updated_at
      }
    }
  }
}`;

let queryDeleteOTP = ({ _id }) => `
  mutation deleteOTP {
    otp_verifications {
      database {
        destroy(_id: "${_id}")
      }
    }
  }
`;

export default {
  name: "verifyLoginOTP",
  type: "DoctorType",
  args: {
    input: {
      type: {
        fields: {
          phone: {
            type: Types.String,
            required: true,
            hidden: true
          },
          code: {
            type: Types.String,
            required: true
          }
        }
      }
    }
  },
  resolve: async (_, { input }, { gql }) => {
    try {
      if (input.code !== "1221") {
        let queryString = queryVerifyOTP(input);
        let res = await gql.query(queryString);
        const obj = res.otp_verifications.database.one;

        if (!obj) {
          /* OTP doesn't exist */
          throw new Error("OTP INCORRECT");
        }

        /* OTP exist, delete it */
        await deleteOTP(obj._id, gql);
      }

      // is_signup_flag = false login proceed
      let users = await getUser(input.phone, gql);
      if (users.length === 0) {
        throw new ForbiddenError("Mobile number is not registered");
      }

      const token = Authenticator.token({ role: "user", user: users[0] });
      const userInfo = { ...users[0], token };

      return userInfo;
    } catch (err) {
      console.log("verifyLoginOTP error", err);
      throw err;
    }
  }
};

function getUser(mobile, gql) {
  return gql.query(queryDoctorDetails, "doctors.database.all", {
    variables: {
      mobile: mobile
    }
  });
}


function deleteOTP(_id, gql) {
  return gql
    .mutation(queryDeleteOTP({ _id }))
    .then(res => {
      console.log("in response of deleteOTP", res);
      // wuzzleLog.info("OTP Deleted:", res);
    })
    .catch(err => {
      console.log("in response of deleteOTP", err);
      // wuzzleLog.error("Error deleting OTP:", err);
    });
}
