import {Types} from '@actonate/mirkwood';
export default {
    name : "OtpVerifications",
    datasource : {
        collection: "OtpVerifications",
        timestamps: true
    },
    fields : {
        _id: {
            type: Types.ID
        },
        phone: {
            type: Types.String
        },
        code: {
            type: Types.String
        },
        time_stamp: {
            type: Types.String
        }
    }
}
