import { createApolloFetch } from 'apollo-fetch';
import { get } from 'lodash';

const { WEBSITE_URL, GRAPHQL_ENDPOINT } = process.env;

const completeEConsultationMutation = `
mutation completeEConsultation($transactionRef: String!, $econsultCode: String!) {
  econsultations {
    completeEConsultation(input: {
      transaction_ref: $transactionRef,
      econsultation_code: $econsultCode
    })
  }
}`;

export default (req, res) => {
  console.log('Completing econsultation', req.body, req.params);
  const response = req.body;

  // check for error
  if (response.error) {
    res.redirect(`${WEBSITE_URL}/?failure=true&message=${response.error.description}`);
    return;
  }

  const txnId = req.params.txnId;

  const apolloFetch = createApolloFetch({ uri: GRAPHQL_ENDPOINT });
  const variables = {
    econsultCode: txnId,
    transactionRef: req.body.razorpay_payment_id,
  };

  console.log('Completing econsultation (payment handler)', variables);

  apolloFetch({
    query: completeEConsultationMutation,
    variables,
  })
    .then((result) => {
      const econsultResponse = get(result, 'data.econsultations.completeEConsultation');
      console.log(econsultResponse);
      res.redirect(`${WEBSITE_URL}/econsult/confirm/${txnId}`);
    })
    .catch((err) => {
      console.log(err);
      res.redirect(`${WEBSITE_URL}/?failure=server`);
    });
};
