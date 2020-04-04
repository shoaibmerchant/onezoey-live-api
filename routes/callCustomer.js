const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

const callCustomer = async (options, socket) => {
  const encodedOptions = Buffer.from(JSON.stringify(options)).toString(
    "base64"
  );
  const callInstance = await client.calls.create({
    url: `${process.env.API_URL}/callCustomerRequest?options=${encodedOptions}`,
    to: `+91${options.mobileNumber}`,
    from: "+918000402996"
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Call placed successfully"
    })
  };
};

module.exports = async (request, response) => {
  try {
    const callResponse = await callCustomer(request.body, socket);

    response.send({ status: 200, message: "Call placed successfully" });
    return;
  } catch (err) {
    console.log("Error calling customer", err);

    response.statusCode = 400;
    response.send({ error: true, message: err });
  }
};
