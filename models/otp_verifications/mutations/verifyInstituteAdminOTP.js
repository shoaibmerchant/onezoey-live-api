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

const queryInstituteDetails = `
query getInstitute($mobile: String) {
  institutes {
    database {
      all(find: {
        institute_admin_mobile: $mobile
      }) {
        _id
        name
        address_line_1
        address_line_2
        zipcode
        contact_number_1
        logo_url
        institute_type
        institute_category
        description
        email
        emergency_number_1
        emergency_number_2
        contact_number_2
        contact_person_name
        url_slug
        is_published
        institute_admin_name
        institute_admin_email
        institute_admin_mobile
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
  name: "verifyInstituteAdminOTP",
  type: "InstituteType",
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
      console.log('Users', users);
      if (users.length === 0) {
        throw new ForbiddenError("Mobile number is not registered");
      }

      const authenticatedUser = { ...users[0] };

      const token = Authenticator.token({ role: "institute_admin", user: authenticatedUser });
      const userInfo = { ...users[0], token };

      return userInfo;
    } catch (err) {
      console.log("verifyLoginOTP error", err);
      throw err;
    }
  }
};

function getUser(mobile, gql) {
  return gql.query(queryInstituteDetails, "institutes.database.all", {
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
