import _ from './env'
import {MirkwoodServer} from 'mirkwood-graphql';
import express from 'express';
import bodyParser from 'body-parser';
import * as config from './config';
import * as models from './models';
import paymentHandler from './routes/payment';

const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

const FRONT_END_URL = process.env['WEBSITE_URL'];

server.post('/payment/rzp/:txnId', paymentHandler);

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
