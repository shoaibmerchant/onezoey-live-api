import { Types } from '@actonate/mirkwood';


import _sendOTPSMS from "./_sendOTPSMS";
// import _sendSMS from './_sendSMS';



function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomOtp() {
	let otp = Math.floor(getRandomArbitrary(1000, 9999));
	return otp;
}

function getTimeStamp(){
	let stamp = new Date().getTime();
	return stamp;
}


export default {
	name: 'VerificationOtp',
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
	resolve: (_, {input }, { gql }) => (
		 new Promise((resolve, reject) => {
			console.log('OTP VERIFICATION  - 1');
			let otp = getRandomOtp();
			console.log('OTP VERIFICATION  - 2', otp);

			let timeStamp = getTimeStamp();
			console.log('OTP VERIFICATION  - 3', timeStamp);

      let countryMobile = input.phone.startsWith('+') ? input.phone : `+91${input.phone}`
			gql
			.mutation(`
			mutation otp_verification {
				otp_verifications {
						database {
							create(input:{
								phone: "${input.phone}",
								code: "${otp}",
								time_stamp: "${timeStamp}"
							}) {
								_id
								code
								phone
								time_stamp
								}
						}
						_sendOTPSMS(body:
							{
								mobiles: "${input.phone}",
								sender: "ONEZOEY",
								message: "Your OTP for One Zoey is ${otp}"
							},
							url: "https://control.msg91.com/api/sendhttp.php"
						)
					}
			}
			`, 'otp_verifications.database.create')
			.then((res) => {
				console.log('OTP VERIFICATION  - 4 res', res);
				resolve(res);
			})
			.catch((err) => {
				console.log('OTP VERIFICATION  - 4 err', err);
				reject(err);
			});
		})
	)
};

// MSG91
// _sendOTPSMS(body:
//   {
//     mobiles: "${input.phone}",
//     sender: "NEOGAM",
//     message: "Your OTP for Neon Gaming Studio is ${otp}"
//   },
// url: "https://control.msg91.com/api/sendhttp.php"
// )



// _sendSMS(input: {
// 	message:"Your OTP for Rao Groups is ${otp}"
// 	mobile: "${countryMobile}"
// 	}) {
// 		_id
// 		phone
// 		code
// 	time_stamp
// 	_created_at
// 	_updated_at
// }