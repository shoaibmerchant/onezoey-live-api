import sha1 from 'sha1';
import { Types } from '@actonate/mirkwood';
import { Authenticator } from '@actonate/mirkwood';
import { UnknownError } from '@actonate/mirkwood/errors';
import fetch from "isomorphic-unfetch";

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
          patient_name: {
            type: Types.String,
          },
          patient_mobile: {
            type: Types.String
          },
          patient_sex: {
            type: Types.String,
          },
          patient_age: {
            type: Types.String
          },
          patient_problem: {
            type: Types.String,
          },
          doctor_id: {
            type: Types.String,
          },
          institute_id: {
            type: Types.ID,
          },
          appointment_date: {
            type: Types.String
          },
          appointment_time: {
            type: Types.String
          },
          amount: {
            type: Types.Int,
            required: true,
          },
        }
      }
    }
  },
  type: {
    name: 'EConsultationOrder',
    fields: () => ({
      pg_order_id: {
        type: Types.String
      },
      econsultation_id: {
        type: Types.ID,
      },
      econsultation_code: {
        type: Types.String,
      }
    })
  },
  resolve: async (_, { input }, { gql, req }) => {
    try {
      const patient = {
        name: input.patient_name,
        mobile: input.patient_mobile,
        age: parseInt(input.patient_age),
        sex: input.patient_sex,
      };
      const patientResult = await createPatient(patient, gql);

      const econsult = {
        institute_id: input.institute_id || null,
        doctor_id: input.doctor_id,
        appointment_date: input.appointment_date,
        appointment_time: input.appointment_time,
        amount: input.amount,
        status: "PENDING",
        patient_id: patientResult._id,
        code: getRandomCode(),
        patient_problem: input.patient_problem,
      };

      const econsultResult = await createEConsultation(econsult, gql);
      const order = await createRazorpayOrder(input.amount)
      console.log('Order created from rzp', order);

      return {
        pg_order_id: order.id,
        econsultation_id: econsultResult._id,
        econsultation_code: econsult.code,
      };
    } catch(err) {
      console.log("Error creating econsultation", err);
      throw new UnknownError("Cannot create econsultation");
    }
  }
};

const createPatient = async (input, gql) => {
  return await gql.mutation(`
    mutation createPatient($input: PatientInputType) {
      patients {
        database {
          create(input: $input) {
            _id
          }
        }
      }
    }
  `, 'patients.database.create', {
    variables: {
      input,
    }
  });
}

const createEConsultation = async (econsult, gql) => {
  return await gql.mutation(`
    mutation createEConsultation($input: EconsultationInputType) {
      econsultations {
        database {
          create(input: $input) {
            _id
          }
        }
      }
    }
  `, 'econsultations.database.create', {
    variables: {
      input: econsult,
    }
  });
}


const createRazorpayOrder = (amount) => {
  console.log("Creating order", amount);
  const url = "https://api.razorpay.com/v1/orders";
  var options = {
    method: "POST",
    headers: {
      "cache-control": "no-cache",
      "content-type": "application/json",
      authorization: `Basic ${Buffer.from(
        `${process.env.RZP_KEY}:${process.env.RZP_SECRET}`
      ).toString("base64")}`
    },
    body: JSON.stringify({
      amount: amount * 100, // convert to paiisa
      currency: "INR",
      payment_capture: true,
      notes: {}
    }),
    json: true
  };
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(response => response.json())
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
}
