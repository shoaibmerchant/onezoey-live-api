import { Types } from "mirkwood-graphql";
// import {Address} from './types';
export default {
  name: "Patient",
  datasource: {
    collection: "patients",
    timestamps: true,
    skip_deleted: true
  },
  fields: {
    _id: {
      type: Types.ID,
      hidden: true
    },
    name: {
      type: Types.String,
      required: true,
      label: "Name"
    },
    email: {
      type: Types.String,
      required: true,
      label: "Email"
    },
    mobile: {
      type: Types.String,
      label: "Mobile",
      required: true
    },
    age: {
      type: Types.Int,
    },
    sex: {
      type: Types.String,
    },
    display_picture_url: {
      type: Types.String
    }
  },
  relations: {
    children: [
      {
        name: "econsultation",
        model: "econsultations",
        type: "EconsultationType",
        field: "patient_id",
        joinBy: "_id"
      }
    ]
  }
};
