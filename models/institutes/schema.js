import { Types } from "mirkwood-graphql";
// import {Address} from './types';
export default {
  name: "Institute",
  datasource: {
    collection: "institutes",
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
    address_line_1: {
      type: Types.String
    },
    address_line_2: {
      type: Types.String
    },
    zipcode: {
      type: Types.String
    },
    contact_number_1: {
      type: Types.String
    },
    logo_url: {
      type: Types.String
    },
    institute_type: {
      type: Types.String
    },
    institute_category: {
      type: Types.String
    },
    description: {
      type: Types.String
    },
    email: {
      type: Types.String
    },
    emergency_number_1: {
      type: Types.String
    },
    emergency_number_2: {
      type: Types.String
    },
    contact_number_2: {
      type: Types.String
    },
    contact_person_name: {
      type: Types.String
    }
  },
  relations: {
    children: [
      {
        name: "doctor",
        model: "doctors",
        type: "DoctorType",
        field: "institute_id",
        joinBy: "_id"
      }
    ]
  }
};
