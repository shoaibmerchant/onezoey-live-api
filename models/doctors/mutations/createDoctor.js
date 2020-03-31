import { Authenticator } from '@actonate/mirkwood';


const createDoctorMutation = `
mutation createNewDoctor($input : DoctorInputType!){
  doctors{
    database{
      create(input:$input) {
        _id
        first_name
        last_name
        email
        mobile
        token
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
`;


const mobileUniqueCheckMutation = ` 
query getUniqueMobileCount($mobile : String!){
  doctors{
    database{
      count(find : {
        mobile:$mobile
      })
    }
  }
}
`
const emailUniqueCheckMutation = ` 
query getUniqueEmailCount($email : String!){
  doctors{
    database{
      count(find : {
        email: $email
      })
    }
  }
}
`


export default {
  name: 'createDoctor',
  args: {
    input: {
      type: "DoctorInputType"
    }
  },
  resolve: (_, { input }, { gql, req }) => {
    return new Promise((resolve, reject) => {

      checkUniqueMobileDoctor(input, gql)
        .then(res => {
          return checkUniqueEmailDoctor(input, gql)
            .then(resp => {

              if (res > 0 && resp > 0) {
                reject({ message: "MOBILE_AND_EMAIL_ALREADY_REGISTERED" })
              }

              else if (res > 0) {
                reject({ message: "MOBILE_ALREADY_REGISTERED" })
              }

              else if (resp > 0) {
                reject({ message: "EMAIL_ALREADY_REGISTERED" })
              }

              else {

                const rocketChatInput = {
                  name: input.first_name + " " + input.last_name,
                  username: getDoctorName(input),
                  password: getPassword(input),
                  email: input.email,
                  roles: ['doctor'],
                  verified: true,
                }


                return gql.mutation(createDoctorMutation,
                  'doctors.database.create', queryVariables
                ).then(response => {

                  console.log("CREATE DOCTOR RESPONSE", response)

                  const token = Authenticator.token({ role: 'doctor', user: response });

                  let newResponse = { ...response, token };

                  resolve(newResponse)
                })
                  .catch(err => {
                    console.log("CREATE DOCTOR ERROR", JSON.stringify(err))
                    reject(err)
                  })

              }
            })
            .catch(err => {
              reject(JSON.stringify(err))
            })

        })
        .catch(err => {
          reject(err)
        })

    })
  }
}


const checkUniqueMobileDoctor = (input, gql) => {
  return gql.query(mobileUniqueCheckMutation, 'doctors.database.count', {
    variables: {
      mobile: input.mobile,
    }
  })
}


const checkUniqueEmailDoctor = (input, gql) => {
  return gql.query(emailUniqueCheckMutation, 'doctors.database.count', {
    variables: {
      email: input.email,
    }
  })
}

// Register in chat
function registerInChat(input, gql) {
  return new Promise((resolve, reject) => {
    gql.mutation(`
				mutation RegisterDoctorInChat ($input: registerUser_inputInputType!) {
					rocket_chat {
						registerUser(input: $input)
					}
				}
			`, 'rocket_chat.registerUser', {
      variables: {
        input
      }
    })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        console.log('RegisterInChat(ERR)--------------------', err);
        reject(err);
      })
  })
}

function getDoctorName(input) {
  return (input.first_name + "_" + input.last_name + "_" + input.mobile);
}

function getPassword(input) {
  return (input.first_name + input.last_name + input.mobile);
}

