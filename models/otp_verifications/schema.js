import {Types} from '@actonate/mirkwood';
export default {
    name : "OtpVerifications",
    datasource : {
        collection: "otp_verifications",
        timestamps: true
    },
    fields : {
        _id: {
            type: Types.ID
        },
        mobile: {
            type: Types.String
        },
        code: {
            type: Types.String
        },
        timestamp: {
            type: Types.String
        }
    }
}
