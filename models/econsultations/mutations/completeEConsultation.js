import sha1 from 'sha1';
import dayjs from 'dayjs';
import { Types } from 'mirkwood-graphql';
import { Authenticator } from 'mirkwood-graphql';
import { UnknownError } from 'mirkwood-graphql/errors';
import fetch from "isomorphic-unfetch";

export default {
  name: 'createEConsultation',
  args: {
    input: {
      type: {
        fields: {
          econsultation_code: {
            type: Types.String,
          },
          transaction_ref: {
            type: Types.String
          },
        }
      }
    }
  },
  type: Types.Boolean,
  resolve: async (_, { input }, { gql, req }) => {
    console.log('GQL Completingg econsulation', input);
    try {
      const econsultUpdate = {
        transaction_ref: input.transaction_ref,
        status: "CONFIRMED",
      };

      console.log('Completing econsultation', input.econsultation_code);
      const updateResult = await updateEConsultation(input.econsultation_code, econsultUpdate, gql);

      if (updateResult) {
        const econsult = await getEConsult(input.econsultation_code, gql);
        console.log('Econsult found', econsult);
        await sendSMSToDoctor(econsult, gql);
        await sendSMSToPatient(econsult, gql);
      }

      return true;
    } catch (err) {
      console.log("Error updating econsultation", err);
      throw new UnknownError("Cannot update econsultation");
    }
  }
};


const updateEConsultation = async (econsultCode, input, gql) => {
  const res = await gql.mutation(`
    mutation updateEConultation($econsultCode: String!, $input: Econsultation_UpdateInputType!) {
      econsultations {
        database {
          update(find: {
            code: $econsultCode
            status: "PENDING"
          }, input: $input)
        }
      }
    }
  `, 'econsultations.database.update', {
    variables: {
      econsultCode: econsultCode,
      input,
    }
  });
  return res;
}

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

const sendSMSToPatient = async (econsult, gql) => {
  const { doctor } = econsult._parent;
  const { patient } = econsult._parent;

  const phone = patient.mobile;

  const econsultUrl = `${process.env.WEBSITE_URL}/econsult/confirm/${econsult.code}`;
  const message = `Your appointment with ${doctor.name} is confirmed. Your appointment time is ${econsult.appointment_time} on ${dayjs(econsult.appointment_date).format("D MMM YYYY")}. Open ${econsultUrl} on your phone to connect with your doctor.`;
  console.log("params send to MSG91", phone, message);

  return gql
    .mutation(sendSMSMutation({ phone, message }))
    .then(res => {
      console.log("in response of sending via MSG91", res);
    })
    .catch(err => {
      console.log("error in response of sending via MSG91", err);
    });
}

const sendSMSToDoctor = async (econsult, gql) => {
  const { doctor } = econsult._parent;
  const { patient } = econsult._parent;

  const phone = doctor.mobile;
  const message = `You have a new econsultation appointment on OneZoey. Patient Name is ${patient.name} (${patient.age}, ${patient.sex}), and appointment time is ${econsult.appointment_time} on ${dayjs(econsult.appointment_date).format("D MMM YYYY")}. Open live.onezoey.com to view more information.`;
  console.log("params send to MSG91", phone, message);

  return gql
    .mutation(sendSMSMutation({ phone, message }))
    .then(res => {
      console.log("in response of sending via MSG91", res);
    })
    .catch(err => {
      console.log("error in response of sending via MSG91", err);
    });
}

let sendSMSMutation = ({ phone, message }) => `
mutation SendOTPMSG {
  otp_verifications {
      sendOTPMessage(body: {
              mobiles: "${phone}",
              sender: "${process.env.MSG91_SENDER}",
              message: "${message}"
          },
          url: "${process.env.MSG91_URL}"
      )
  }
}
`;  