import { Types } from "@actonate/mirkwood";

const MSG91_SENDER = process.env.MSG91_SENDER;
const MSG91_URL = process.env.MSG91_URL;

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomOtp() {
  let otp = Math.floor(getRandomArbitrary(1000, 9999));
  return otp;
}

function getTimeStamp() {
  let stamp = new Date();
  return stamp.toISOString();
}

export default {
  name: "generateOTP",
  args: {
    input: {
      type: {
        fields: {
          phone: {
            type: Types.String
          }
        }
      }
    }
  },
  resolve: (_, { input }, { gql }) =>
    new Promise(async (resolve, reject) => {
      try {
        console.log("Generating OTP");

        await deleteOTP(input.phone, gql);

        let otp;

        otp = getRandomOtp();

        const otpMessage = `Your OTP for OneZoey for Doctor App is ${otp}.`;
        console.log("otpMessage ", otpMessage);

        const userPhone = `+91${input.phone}`;

        gql
          .mutation(
            `mutation createOTPVerification {
                  otp_verifications {
                      database {
                          create(input: {
                              mobile: "${input.phone}",
                              code: "${otp}",
                          }) {
                              _id
                              code
                              mobile
                          }
                      }
              }
            }`,
            "otp_verifications.database.create"
          )
          .then(async res => {
            console.log("OTP created in database", res);

            // call mutation for send otp via MSG91
            var resOfSendOtpMsg = await sendOTPMSGTroughMSG91(
              userPhone,
              otpMessage,
              gql
            );

            console.log('Response from SMS Gateway', resOfSendOtpMsg);

            resolve(res);
          })
          .catch(err => {
            console.log('Error sending OTP', err);
            reject(err);
          });
      } catch (error) {
        console.log("Error in generating OTP", error);
      }
    })
};

let queryDeleteOTP = ({ phone }) => `
  mutation deleteOTP {
    otp_verifications {
      database {
        destroy(find:{
          mobile: "${phone}"
        })
      }
    }
  }
`;

function deleteOTP(phone, gql) {
  return gql
    .mutation(queryDeleteOTP({ phone }))
    .then(res => {
      console.log("in response of deleteOTP", res);
    })
    .catch(err => {
      console.log("error in response of deleteOTP", err);
    });
}

let mutationSendOTPMSGTroughMSG91 = ({ phone, otpMessage }) => `
mutation SendOTPMSG {
  otp_verifications {
      sendOTPMessage(body: {
              mobiles: "${phone}",
              sender: "${MSG91_SENDER}",
              message: "${otpMessage}"
          },
          url: "${MSG91_URL}"
      )
  }
}
`;

function sendOTPMSGTroughMSG91(phone, otpMessage, gql) {
  console.log("params send to MSG91", phone, otpMessage);

  return gql
    .mutation(mutationSendOTPMSGTroughMSG91({ phone, otpMessage }))
    .then(res => {
      console.log("in response of sendotp via MSG91", res);
    })
    .catch(err => {
      console.log("error in response of sendotp via MSG91", err);
    });
}

