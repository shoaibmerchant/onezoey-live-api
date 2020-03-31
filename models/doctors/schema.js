import { Types } from "@actonate/mirkwood";
// import {Address} from './types';
export default {
  name: "Doctor",
  datasource: {
    collection: "doctors",
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
    specialization: {
      type: Types.String
    },
    bachelor_degree: {
      type: Types.String
    },
    master_degree: {
      type: Types.String
    },
    super_degree: {
      type: Types.String
    },
    fellowship: {
      type: Types.String
    },
    display_picture_url: {
      type: Types.String
    },
    econsultation_timings: {
      type: Types.String
    },
    url_slug: {
      type: Types.String
    },
    econsultation_fees: {
      type: Types.Float
    },
    institute_id: {
      type: Types.ID
    },
    city: {
      type: Types.String
    },
    description: {
      type: Types.String
    },
    token: {
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
      }
    ],
    children: [
      {
        name: "econsultation",
        model: "econsultations",
        type: "EconsultationType",
        field: "doctor_id",
        joinBy: "_id"
      }
    ]
  }
};
