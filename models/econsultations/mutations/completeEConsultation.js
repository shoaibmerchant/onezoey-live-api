import sha1 from 'sha1';
import { Types } from '@actonate/mirkwood';
import { Authenticator } from '@actonate/mirkwood';
import { UnknownError } from '@actonate/mirkwood/errors';
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
    try {
      const econsultUpdate = {
        transaction_ref: input.transaction_ref,
        status: "CONFIRMED",
      };

      console.log('Completing econsultation', input.econsultation_code);
      const updateResult = await updateEConsultation(input.econsultation_code, econsultUpdate, gql);

      // if (updateResult) {
      //   const econsult = await getEConsult(input.econsultation_code);
      //   await sendSMSToDoctor(input.econsultation_code);
      //   await sendSMSToPatient(input.econsultation_code);
      // }

      return true;
    } catch (err) {
      console.log("Error updating econsultation", err);
      throw new UnknownError("Cannot update econsultation");
    }
  }
};


const updateEConsultation = async (econsultCode, input, gql) => {
  return await gql.mutation(`
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
}


// const sendMessageMutation = ({ phone, message }) => `
// mutation SendOTPMSG {
//   otp_verifications {
//       sendOTPMessage(body: {
//               mobiles: "${phone}",
//               sender: "${MSG91_SENDER}",
//               message: "${message}"
//           },
//           url: "${MSG91_URL}"
//       )
//   }
// }
// `;

// const sendSMSToDoctor = async (phone, econsult, gql) => {
//   const message = `You have a new econsultation appointment on OneZoey. Patient Name is Shoaib Merchant (24, Male), and appointment time is 10:15 AM on 21st March`;
//   console.log("params send to MSG91", phone, otpMessage);

//   return gql
//     .mutation(mutationSendOTPMSGTroughMSG91({ phone, otpMessage }))
//     .then(res => {
//       console.log("in response of sendotp via MSG91", res);
//     })
//     .catch(err => {
//       console.log("error in response of sendotp via MSG91", err);
//     });
// }
