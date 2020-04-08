const VoiceResponse = require("twilio").twiml.VoiceResponse;

const CallCustomerRequest = (request, response) => {  console.log("Request", request.body);


  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new VoiceResponse();

  const encodedOptions = request.query.options;
  const options = Buffer.from(encodedOptions, "base64").toString();

  const { doctorName, patientMobileNumber } = JSON.parse(options);

  const sayOptions = { voice: "Polly.Aditi", language: "en-IN" };

  // check if the user has entered
  // If the user entered digits, process their request
  
  twiml.say(
    sayOptions,
    `Hi ${doctorName}, I am calling from OneZoey Live. Connecting you to your patient`,
  );

  twiml.dial(patientMobileNumber);
  twiml.say('Goodbye');

  // Render the response as XML in reply to the webhook request
  response.type("text/xml");
  response.send(twiml.toString());
};

module.exports = CallCustomerRequest;
