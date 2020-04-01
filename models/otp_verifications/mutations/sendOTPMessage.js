import { Types } from "mirkwood-graphql";
import { SmsRequest } from "../types";
export default {
  name: "sendOTPMessage",
  internal: true,
  resolve: "http.request",
  args: {
    body: {
      type: SmsRequest
    }
  },
  type: Types.String
};
