import { Types } from '@actonate/mirkwood';
import { Authenticator } from '@actonate/mirkwood';
import { UnknownError } from '@actonate/mirkwood/errors';
import fetch from "isomorphic-unfetch";

const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomCode() {
  let otp = Math.floor(getRandomArbitrary(100000, 999999));
  return otp;
}

export default {
  name: 'createEConsultation',
  args: {
    input: {
      type: {
        fields: {
          econsult_code: {
            type: Types.String,
          },
          patient_id: {
            type: Types.ID,
          }
        }
      }
    }
  },
  type: {
    name: 'EConsultationToken',
    fields: () => ({
      token: {
        type: Types.String
      },
      token_type: {
        type: Types.String,
      },
    })
  },
  resolve: async (_, { input }, { gql, req }) => {
    try {
      const { econsult_code, patient_id } = input;
      const session = Authenticator.user(req);

      // for logged in (doctors)
      if (session && session.user) {
        const token = createTwilioToken(econsult_code, "DOCTOR");
        return { token, token_type: "DOCTOR" };
      } else {
        // for patients
        const token = createTwilioToken(econsult_code, "PATIENT");
        return { token, token_type: "PATIENT" };
      }
    } catch (err) {
      console.log("Error creating econsultation token", err);
      throw new UnknownError("Cannot create econsultation token");
    }
  }
};

const createTwilioToken = (roomName, identity) => {
  // Used when generating any kind of Access Token
  const twilioAccountSid = process.env.TWILIO_SID;
  const twilioApiKey = process.env.TWILIO_API_KEY;
  const twilioApiSecret = process.env.TWILIO_API_SECRET;

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret);
  token.identity = identity;

  // Create a Video grant which enables a client to use Video 
  // and limits access to the specified Room (DailyStandup)
  const videoGrant = new VideoGrant();

  // Add the grant to the token
  token.addGrant(videoGrant);

  return token.toJwt();
}
