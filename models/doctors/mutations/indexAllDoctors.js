import { Types } from '@actonate/mirkwood';
import async from 'async';

const getAllDoctorsQuery = `
query getDoctors{
  doctors{
    database{
      all(
      limit: 200
      ) {
        _id
        first_name
        last_name
      }
    }
  }
}
`;

const indexDoctorsMutation = `
mutation indexItem($id: ID!) {
  doctors {
    doctorsIndex(id: $id) {
      _id
    }
  }
}
`;
export default {
  name: 'indexAllDoctors',
  args: {},
  resolve: (_, args, { gql, req }) => {
    return new Promise((resolve, reject) => {

      getAllDoctors(gql)
        .then(resp => {
          return indexAll(gql, resp);
        })
        .then(resp => {
          console.log("All data proceeds.");
          resolve(resp);
        })
        .catch(err => {
          console.log("Error: ", err);
          reject(err);
        });


    });
  }
}

//=-=-=-=-=-
function getAllDoctors(gql) {
  return new Promise ((resolve, reject) => {
    gql.query(
      getAllDoctorsQuery,
      'doctors.database.all'
    )
    .then(resp => {
      resolve(resp);
    })
    .catch(err => {
      console.log("Error: ", err);
      reject(err);
    });
  });
}

//=-=-=-=-=-=-
function indexAll(gql, resp) {
  return new Promise ((resolve, reject) => {
    
    async.eachOf(resp, (row, idx, callback) => {
      gql.mutation(
        indexDoctorsMutation,
        'doctors.doctorsIndex',
        {
          variables: {
            id: row._id
          }
        })
        .then(resp => {
          console.log("Record indexed.");
          callback();
        })
        .catch(err => {
          console.log("Error: ", err);
          callback();
        });
    }, (err) => {
      if (err) {
        console.log("Some Error Occured! ", err);
        reject(err);
      } else {
        console.log("All records proceeds.");
        resolve(true);
      }
    });

  });
}