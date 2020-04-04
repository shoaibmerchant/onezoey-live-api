import { Types } from 'mirkwood-graphql';
import { Authenticator } from 'mirkwood-graphql';
import { UnknownError } from 'mirkwood-graphql/errors';

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

const callCustomer = async (options) => {
  const encodedOptions = Buffer.from(JSON.stringify(options)).toString(
    "base64"
  );
  const callInstance = await client.calls.create({
    url: `${process.env.API_URL}/callCustomerRequest?options=${encodedOptions}`,
    to: `+91${options.mobileNumber}`,
    from: "+918000402996"
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Call placed successfully"
    })
  };
};

export default {
  name: 'connectCall',
  args: {
    input: {
      type: {
        fields: {
          econsultation_code: {
            type: Types.String,
          }
        }
      }
    }
  },
  type: Types.Boolean,
  resolve: async (_, { input }, { gql, req }) => {
    try {
      const econsult = await getEConsult(input.econsultation_code, gql);
      const call = await callCustomer({ 
        mobileNumber: econsult._parent.doctor.mobile,
        doctorName: econsult._parent.doctor.name.slice(3),
        patientMobileNumber: econsult._parent.patient.mobile,
      })
      return true;
    } catch (err) {
      console.log("Error placing call token", err);
      throw new UnknownError("Error placing call");
    }
  }
};


const getEConsult = async (econsultCode, gql) => {
  const res = await gql.query(`
    query getEConsultation($econsultCode: String!) {
      econsultations {
        database {
          one(find: {
            code: $econsultCode
          }) {
            _id
            code
            amount
            patient_id
            doctor_id
            institute_id
            remarks
            conclusion
            notes
            start_time
            end_time
            doctor_rating
            doctor_rating_feedback
            patient_rating
            patient_rating_feedback
            appointment_date
            appointment_time
            status
            _created_at
            _updated_at
            _parent {
              doctor {
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
                token
                _created_at
                _updated_at
              }
              patient {
                _id
                name
                email
                mobile
                age
                sex
                display_picture_url
                _created_at
                _updated_at
              }
            }
          }
        }
      }
    }
  `, 'econsultations.database.one', {
    variables: {
      econsultCode: econsultCode,
    }
  });

  return res;
}
