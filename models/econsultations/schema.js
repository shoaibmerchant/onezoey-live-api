import { Types } from "@actonate/mirkwood";
// import {Address} from './types';
export default {
  name: "Econsultation",
  datasource: {
    collection: "econsultations",
    timestamps: true,
    skip_deleted: true
  },
  fields: {
    _id: {
      type: Types.ID,
      hidden: true
    },
    transaction_ref: {
      type: Types.String
    },
    amount: {
      type: Types.String
    },
    patient_id: {
      type: Types.ID
    },
    doctor_id: {
      type: Types.ID
    },
    institute_id: {
      type: Types.ID
    },
    remarks: {
      type: Types.String
    },
    conclusion: {
      type: Types.String
    },
    notes: {
      type: Types.String
    },
    start_time: {
      type: Types.String
    },
    end_time: {
      type: Types.String
    },
    doctor_rating: {
      type: Types.String
    },
    doctor_rating_feedback: {
      type: Types.String
    },
    patient_rating: {
      type: Types.String
    },
    patient_rating_feedback: {
      type: Types.String
    }
  },
  relations: {
    parent: [
      {
        name: "institute",
        model: "institutes",
        type: "InstituteType",
        field: "_id",
        joinBy: "institute_id"
      },
      {
        name: "patient",
        model: "patients",
        type: "PatientType",
        field: "_id",
        joinBy: "patient_id"
      },
      {
        name: "doctor",
        model: "doctors",
        type: "DoctorType",
        field: "_id",
        joinBy: "doctor_id"
      }
    ]
  }
};
