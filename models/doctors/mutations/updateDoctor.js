import { Types } from 'mirkwood-graphql';
import { Authenticator } from 'mirkwood-graphql';
import { UnknownError, ForbiddenError, AuthenticationRequiredError } from 'mirkwood-graphql/errors';


const updateDoctorMutation = `
mutation updateNewDoctor($_id : ID!, $input : Doctor_UpdateInputType!){
  doctors{
    database{
      update(_id : $_id , input:$input)
    }
  }
}
`;

const getDoctor = `
	query getDoctor($find : Doctor_FindInputType!){
		doctors{
			database{
				one(find : $find){
          _id
          first_name
          last_name
          email
          mobile
          gender
          is_active
          designation
          practicing_from
          description
          address
          area
          age
          nationality
          years_of_experience
          display_picture
          average_rating
          qr_code
          date_of_birth
          license_number
          is_a_teacher
          city
          state
          chat_id
          chat_password
          chat_username
          _created_at
          _updated_at
				}
			}
		}
	}
`

export default {
  name: 'UpdateDoctor',
  args: {
    input: {
      type: "Doctor_UpdateInputType"
    }
  },
  resolve: (_, { _id, input }, { gql, req }) => {

    const session = Authenticator.user(req);
    console.log("Request from client", session);

    if (!session) {
      throw new AuthenticationRequiredError();
    }

    const { user } = session;

    return new Promise((resolve, reject) => {
      const queryVariables = {
        variables: {
          _id : user._id,
          input: input
        }
      }
      gql.mutation(updateDoctorMutation,
        'doctors.database.update', queryVariables
      ).then(res => {

        gql.query(getDoctor, "doctors.database.one", {
          variables: {
            find: {
              _id : user._id,
            }
          }
        })
          .then(response => {
            console.log("GET DOCTOR RESPONSE", response)

            if (response) {
              const token = Authenticator.token({ role: 'user', user: response });

              let newResponse = { ...response, token };

              resolve(newResponse)
            }
            else {
              reject(new ForbiddenError("User not found"));
            }

          })
          .catch(err => {
            console.log("ERROR WHILE GENERATING TOKEN", JSON.stringify(err))
            reject(err);
          })

      })
        .catch(err => {
          console.log("CREATE USER ERROR", JSON.stringify(err))
          reject(err)
        })
    })
  }
}