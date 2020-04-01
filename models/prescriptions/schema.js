import { Types } from "mirkwood-graphql";
// import {Address} from './types';
export default {
  name: "Prescription",
  datasource: {
    collection: "prescriptions",
    timestamps: true,
    skip_deleted: true
  },
  fields: {
    _id: {
      type: Types.ID,
      hidden: true
    },
    econsultation_id: {
      type: Types.ID
    },
    medicines: {
      type: Types.String
    },
    tests_required: {
      type: Types.String
    },
    medical_advice: {
      type: Types.String
    },
    export_url: {
      type: Types.String
    }
  },
  relations: {
    parent: [
      {
        name: "econsultation",
        model: "econsultations",
        type: "EconsultationType",
        field: "_id",
        joinBy: "econsultation_id"
      }
    ]
  }
};
