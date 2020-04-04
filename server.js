import _ from './env'
import {MirkwoodServer} from 'mirkwood-graphql';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as config from './config';
import * as models from './models';
import paymentHandler from './routes/payment';
import uploadHandler from "./routes/upload";
import pusherAuthHandler from "./routes/pusherauth";
const callCustomerRequestHandler = require("./routes/callCustomerRequest");
const callCustomerHandler = require("./routes/callCustomer");

const server = express();

server.set('forceSSLOptions', {
  enable301Redirects: true,
  trustXFPHeader: false,
  httpsPort: 443,
  sslRequiredMessage: 'SSL Required.'
});
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use("/upload", uploadHandler);


const FRONT_END_URL = process.env['WEBSITE_URL'];

server.post('/pusher/auth', pusherAuthHandler);
server.post('/payment/rzp/:txnId', paymentHandler);
server.get("/callCustomerRequest", callCustomerRequestHandler);
server.post("/callCustomer", callCustomerHandler);


const mirkwoodServer = new MirkwoodServer({
  config,
  models,
  opts: {
    port: process.env.PORT,
    cors: {
      origin: FRONT_END_URL,
      credentials: true
    }
  }
});

mirkwoodServer.start(server);

// let PORT = process.env.PORT || 3000;
// console.log('PORT: ', PORT);

// server.listen(PORT, (err) => {
  // if (err) {
  //  throw(err);
  // }
  //
  // console.log('> Ready on http://localhost:' + PORT);
// });
