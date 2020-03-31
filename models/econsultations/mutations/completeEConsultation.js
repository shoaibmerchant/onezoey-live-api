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
          econsultation_id: {
            type: Types.ID,
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

      await updateEConsultation(input.econsultation_id, econsultUpdate, gql);
      return true;
    } catch (err) {
      console.log("Error updating econsultation", err);
      throw new UnknownError("Cannot update econsultation");
    }
  }
};


const updateEConsultation = async (econsultId, input, gql) => {
  return await gql.mutation(`
    mutation updateEConultation($econsultId: ID, $input: Econsultation_UpdateInputType) {
      econsultations {
        database {
          update(find: {
            _id: $econsultId
            status: "PENDING"
          }, input: $input)
        }
      }
    }
  `, 'econsultations.database.update', {
    variables: {
      econsultId: econsultId,
      input,
    }
  });
}
