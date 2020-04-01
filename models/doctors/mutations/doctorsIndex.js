import { Types } from 'mirkwood-graphql';
import { getItem, indexDoctor, indexSuggestProduct } from '../../../libs/FlattenItem';
  
export default {
  name: 'DoctorsIndex',
  args: {
    id: {
      type: Types.ID
    }
  },
  resolve: (_, args, { gql, req }) => {
    console.log("ARGUMENTS are HERE =====================================================+<>>>>>>>>>: ", args);
    return new Promise((resolve, reject) => {

      let item = null
      getItem(gql, args.id)
        .then(resp => {
          item = resp.actual_resp;
          console.log("FlattenItem: ");
          return indexDoctor(gql, resp.formatted_resp);
        })
        .then(resp => {

          console.log("Item Indexed.");
          return indexSuggestProduct(gql, item);
        })
        .then(resp => {
          console.log("FORMATTED_SUGGEST.");
          resolve(resp);          
        })
        .catch(err => {
          console.log("ERROR: ", err);
          reject(err);
        });

    });

  }
}