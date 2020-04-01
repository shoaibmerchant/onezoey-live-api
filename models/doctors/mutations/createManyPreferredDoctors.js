import { Types, Authenticator } from 'mirkwood-graphql';
import async from 'async';


const createDoctorProfileMutation = `
mutation createDoctorsMutation($input : DoctorInputType!){
    doctors{
      database{
        create(input: $input) {
					_id
				}
      }
    }
  }
`
const getCountMobileNumberQuery = `
query getCountMobileNumberUnique($mobile: String!){
	doctors{
		database{
			count(find : {
				mobile: $mobile
			})
		}
	}
}
`

const createUserPreferredDoctorMutation = `
mutation createUserPreferredDoctorMutation($input: UserPreferredDoctorInputType!) {
	user_preferred_doctors{
		database{
			create(input : $input){
				_id
			}
		}
	}
}
`

export default {
  name: 'createManyPreferredDoctors',
  args: {
    input: {
        type: ['DoctorInputType']
    }
	},
  resolve: (_, args, { gql, req }) => {
		console.log("ARGUMENTS: ", args);
	
		const session = Authenticator.user(req);
	
		console.log("Request from client", session);

			if (!session) {
				throw new AuthenticationRequiredError();
		}
		
		const { user } = session;

    return new Promise((resolve, reject) => {

			createManyDoctorsFunc(args.input, user, gql)
				.then(res => {
					resolve(true);
				})
				.catch(err => {
					reject(false);
				})
    });
  }
}


function createManyDoctorsFunc(input, user, gql) {
	return new Promise((resolve, reject) =>{
		async.eachLimit(input, 1, (row, callback) => {
			console.log("ROW", row);
			gql.query(getCountMobileNumberQuery, 'doctors.database.count', {
				variables : {
					mobile: row.mobile
				}
			})
			.then(res =>{
				console.log('Count', res);
				if(res > 0){
					callback()
					return;
				}

				createDoctorsProfileInDB(row, gql)
				 .then(res => {
					 console.log('RESPONSE WHILE CREATING PROFILE', res);
					 createPreferredDoctorWithUser(res._id, user._id, gql)
					  .then(res =>{
							console.log('PREFERRED DOCTORS RES' ,  res)
							callback();
						})
						.catch(err => {
							console.log('ERROR WHILE ADDING AS PREFERRED', err);
							callback()
						})
				 })
				 .catch(err => {
					console.log('ERROR WHILE CREATING PROFILE', err);
					 callback()
				 });
			});
		}, (err) => {
      if (err) {
        console.log("ERROR: ", JSON.stringify(err));
        reject(false);
      } else {
        console.log("ALL CONTACTS Processed.");
				resolve(true);
			}
		});
	 });
}


function createDoctorsProfileInDB(doctor, gql){
	return gql.mutation(createDoctorProfileMutation,'doctors.database.create', {
		variables : {
			input : doctor
		}
	})
}

function createPreferredDoctorWithUser(doctor_id, user_id, gql){
	return gql.mutation(createUserPreferredDoctorMutation,'user_preferred_doctors.database.create', {
		variables : {
			input : {
				doctor_id : doctor_id,
				user_id: user_id
			}
		}
	})
}