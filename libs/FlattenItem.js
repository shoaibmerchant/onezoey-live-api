import {
  get,
  map,
  set,
  split,
  trim
} from 'lodash'


const getDoctorQuery = `
query getDoctors($id: ID!){
  doctors{
    database{
      one(find:{
        _id: $id
      }) {
        _id
        first_name
        last_name
        email
        mobile
        token
        gender
        is_active
        designation
        practicing_from
        description
        address
        area
        lat_lng
        age
        nationality
        years_of_experience
        display_picture
        average_rating
        qr_code
        date_of_birth
        license_number
        is_a_teacher
        city
        state
        _children{
          doctor_addresses {
            _id
            doctor_id
            name
            line_1
            line_2
            landmark
            zipcode
            city
            province
            lat_lon
            country
            
            address_type
            zone
            _created_at
            _updated_at
          }
          qualification{
            _id
            doctor_id
            qualification_name
            institute_name
            completed_year
            _created_at
            _updated_at
            
          }
          doctor_charges{
            _id
            doctor_id
            charges_type
            charges
            _created_at
            _updated_at
            
          }
          institute_doctor_mapping {
            _id
            institute_id
            doctor_id
            _parent{
              institutes{
                _id
                institute_name
              }
            }
            _created_at
            _updated_at
          }
          doctor_achievements{
            _id
            doctor_id
            title
            description
            month
            year
            type
            _created_at
            _updated_at
          }
          specializations{
            _id
            doctor_id
            name
            keywords
            category
          }
        }
        _created_at
        _updated_at
        }
      }
	  }
  }
`;



let _formattedDoctorsArray = function (resp) {

  console.log("RESPONSE IN _FORMATTEDARRAY =========>>>" , resp);

  
  let tmp = {

    doctor_id: get(resp, '_id'),
    name: get(resp, 'first_name') +" "+ get(resp, 'last_name'),
    display_picture: get(resp, 'display_picture'),
    email: get(resp, 'email'),
    mobile: get(resp, 'mobile'),
    area: get(resp,'area'),            
    designation: get(resp, 'designation'),
    practicing_from: get(resp, "practicing_from"),
    description: get(resp, "description"),
    years_of_experience: get(resp, "years_of_experience"),
    average_rating: get(resp, "average_rating"),

    // date_of_birth : get(resp,"date_of_birth"),
    qr_code: get(resp, "qr_code"),
    // license_number : get(resp,"license_number"),
    lat_lng: {
      pin :{
        location : {
          lat : get(resp, "lat_lng[0]"),
          lon : get(resp, "lat_lng[1]")
        }
      }
    },
    
    
    addresses: {
      _id: resp._children.doctor_addresses.map(itm => itm._id),
      city: resp._children.doctor_addresses.map(itm => itm.city),
      landmark: resp._children.doctor_addresses.map(itm => itm.landmark),
      name: resp._children.doctor_addresses.map(itm => itm.name),
      line_1: resp._children.doctor_addresses.map(itm => itm.line_1),
      line_2: resp._children.doctor_addresses.map(itm => itm.line_2),
      zipcode: resp._children.doctor_addresses.map(itm => itm.zipcode),
    },

    institute: {
      _id: resp._children.institute_doctor_mapping.map(item => item._parent.institutes._id),
      institute_name: resp._children.institute_doctor_mapping.map(itm => itm._parent.institutes.institute_name),
    },
    qualifications: {
      _id: resp._children.qualification.length > 0 ? resp._children.qualification.map(item => item._id) : null,
      institute_name: resp._children.qualification.length > 0 ? resp._children.qualification.map(item => item.institute_name) : null,
    },
    specialization: {
      _id: resp._children.specializations.map(item => item._id),
      name: resp._children.specializations.map(item => item.name),
    },
    achievements :{
      _id: resp._children.doctor_achievements.map(item => item._id),
      title: resp._children.doctor_achievements.map(item => item.title),
      description:resp._children.doctor_achievements.map(item => item.description),
      month : resp._children.doctor_achievements.map(item => item.month),
      year :resp._children.doctor_achievements.map(item => item.year),
      type :resp._children.doctor_achievements.map(item => item.type)
    },
    consultation_charges :{
      _id: resp._children.doctor_charges.map(item => item._id),
      charges_type: resp._children.doctor_charges.map(item => item.charges_type),
      charges:resp._children.doctor_charges.map(item => item.charges),
    }
  };

  console.log("RESP", tmp)
  return tmp;

}


const getInstituteQuery = `
query getinstitutes($id: ID!){
  institutes{
    database{
      one(find:{
        _id: $id
      }) {
        _id
        institute_name
        token
        is_active
        description
        address
        area
        logo
        website_url
        type
        lat_lng
        average_rating
        city
        state
        country
        medical_director
        fax_number
        zip_code
        _created_at
        _updated_at
        _children{
          institute_addresses {
            _id
            institute_id
            name
            line_1
            line_2
            landmark
            zipcode
            city
            province
            lat_lon
            country
            address_type
            zone
            _created_at
            _updated_at
          }
          institute_doctor_mapping {
            _id
            institute_id
            doctor_id
            _parent{
              doctors {
                _id
                first_name
                last_name
                email
                mobile
                token
                gender
                is_active
                designation
                practicing_from
                description
                address
                area
                age
                nationality
                years_of_experience
                display_picture
                average_rating
                qr_code
                date_of_birth
                license_number
                is_a_teacher
                city
                state
                _created_at
                _updated_at
              }
            }
            _created_at
            _updated_at
          }
          institute_achievements {
            _id
            institute_id
            title
            description
            month
            year
            type
            _created_at
            _updated_at
          }
        }
      } 
     }
	}
}`;





let _formattedInstitutesArray = function (resp) {
  console.log("Response in institute", resp)
  let tmp = {

    institute_id: get(resp, '_id'),
    institute_name: get(resp, 'institute_name'),
    logo: get(resp, 'logo'),
    description: get(resp, "description"),
    average_rating: get(resp, "average_rating"),
    lat_lng: {
      pin :{
        location : {
          lat : get(resp, "lat_lng[0]"),
          lon : get(resp, "lat_lng[1]")
        }
      }
    },
    type : get(resp, 'type'),
    area : get(resp, 'area'),
    addresses: {
      _id: resp._children.institute_addresses.map(itm => itm._id),
      city: resp._children.institute_addresses.map(itm => itm.city),
      landmark: resp._children.institute_addresses.map(itm => itm.landmark),
      name: resp._children.institute_addresses.map(itm => itm.name),
      line_1: resp._children.institute_addresses.map(itm => itm.line_1),
      line_2: resp._children.institute_addresses.map(itm => itm.line_2),
      zipcode: resp._children.institute_addresses.map(itm => itm.zipcode),
    },

    doctors_institute: {
      _id: resp._children.institute_doctor_mapping.map(item => item._parent.doctors._id),
      first_name: resp._children.institute_doctor_mapping.map(itm => itm._parent.doctors.first_name),
      last_name: resp._children.institute_doctor_mapping.map(itm => itm._parent.doctors.last_name),
      display_picture: resp._children.institute_doctor_mapping.map(itm => itm._parent.doctors.display_picture)
    },
    achievements: {
      _id: resp._children.institute_achievements.map(item => item._id),
      title: resp._children.institute_achievements.map(item => item.title),
      description: resp._children.institute_achievements.map(item => item.description),
      month: resp._children.institute_achievements.map(item => item.month),
      year: resp._children.institute_achievements.map(item => item.year),
      type: resp._children.institute_achievements.map(item => item.type),
    }
  };

  console.log("RESP", tmp)
  return tmp;

}


const indexInstituteMutation = `

mutation indexItem($_id: ID!, $input: InstituteElasticsearchInputType!){
  institutes_elasticsearch{
    elasticsearch{
      index(_id: $_id, input: $input)
    }
  }
}
`;


const indexDoctorMutation = `

mutation indexItem($_id: ID!, $input: DoctorsElasticsearchInputType!){
  doctors_elasticsearch{
    elasticsearch{
      index(_id: $_id, input: $input)
    }
  }
}
`;



const indexSuggestMutation = `

mutation indexSuggest($_id: ID!, $input: SuggestInputType!){
  suggest{
    elasticsearch{
      index(_id: $_id, input: $input)
    }
  }
}

`;

let _getDoctor = function (gql, doctor_id) {
  console.log("DOCTOR ID is here ================>>>>", doctor_id)
  return new Promise((resolve, reject) => {
    gql.query(
        getDoctorQuery,
        'doctors.database.one', {
          variables: {
            id: doctor_id,
          }
        }
      )
      .then(resp => {
        // console.log("RESPONSE: ", resp);
        let formatted_resp = _formattedDoctorsArray(resp);
        resolve({
          actual_resp: resp,
          formatted_resp
        });
      })
      .catch(err => {
        reject(err);
      });
  });
}


let _getInstitute = function (gql, institute_id) {
  console.log("INSTITUTE ID ", institute_id)
  return new Promise((resolve, reject) => {
    gql.query(
        getInstituteQuery,
        'institutes.database.one', {
          variables: {
            id: institute_id,
          }
        }
      )
      .then(resp => {
        // console.log("RESPONSE: ", resp);
        let formatted_resp = _formattedInstitutesArray(resp);
        resolve({
          actual_resp: resp,
          formatted_resp
        });
      })
      .catch(err => {
        reject(err);
      });
  });
}

let _indexDoctor = function (gql, doctor) {
  return new Promise((resolve, reject) => {
    console.log("ITEM_FLATTEN_ARRAY: ", doctor);
    // resolve(doctor);
    gql.mutation(
        indexDoctorMutation,
        'doctors_elasticsearch.elasticsearch.index', {
          variables: {
            _id: doctor.doctor_id,
            input: doctor
          }
        })
      .then(resp => {
        console.log("SUCCESS_RESPONSE: ", resp);
        resolve(true);
      })
      .catch(err => {
        console.log("ERROR: ", err);
        reject(err);
      });
  });

}


let _indexInstitute = function (gql, institute) {
  return new Promise((resolve, reject) => {
    console.log("ITEM_FLATTEN_ARRAY: ", institute);
    // resolve(institute);
    gql.mutation(
        indexInstituteMutation,
        'institutes_elasticsearch.elasticsearch.index', {
          variables: {
            _id: institute.institute_id,
            input: institute
          }
        })
      .then(resp => {
        console.log("SUCCESS_RESPONSE: ", resp);
        resolve(true);
      })
      .catch(err => {
        console.log("ERROR: ", err);
        reject(err);
      });
  });

}


//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// Suggestion Index

//==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=======--=-=-

let _formattedSuggest = function (doctor, type) {

  let tmp = {

    type: type,

    search: [],

    text: '',
    
    name :'',

    doctor_specialization :''

  }


  // console.log("DOCTOR"  , doctor)
  let specialization = get(doctor, '_children.specializations[0].name', null);
  // let tmp_name = city !== null ? get(doctor, 'first_name') + " " + get(doctor, 'last_name') + " in " + city : get(doctor, 'first_name') + " " + get(doctor, 'last_name');

  //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  let name = specialization !== null ? get(doctor, 'first_name') + " " + get(doctor, 'last_name') +" "+ specialization : get(doctor, 'first_name') + " " + get(doctor, 'last_name');

  tmp.text = name;


  tmp.name = get(doctor, 'first_name') +" "+get(doctor, "last_name");

  tmp.doctor_specialization = specialization !== null ? specialization : "";

  let tmp_name = split(name, " ");

  let tmp_search = [];

  const name_len = tmp_name.length;

  for (let i = 0; i < name_len; i++) {

    let name_part = "";

    for (let j = i; j < name_len; j++) {

      name_part += tmp_name[j] + " ";

    }



    tmp_search.push({

      input: trim(name_part),

      weight: name_len - i

    });

  }



  console.log("");

  console.log("TmpSearch: ", tmp_search);

  console.log("");

  tmp.search = tmp_search;

  return tmp;

}


let _formattedInstitutesSuggest = function (institute, type) {

  let tmp = {

    type: type,

    search: [],

    text: '',

  }


  // console.log("DOCTOR"  , doctor)
  let city = get(institute, '_children.institute_addresses[0].city', null);
  // let tmp_name = city !== null ? get(institute, 'first_name') + " " + get(institute, 'last_name') + " in " + city : get(institute, 'first_name') + " " + get(institute, 'last_name');

  //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  let name = city !== null ? get(institute, 'institute_name') + " in " + city : get(institute, 'institute_name');


  tmp.text = name;

  
  let tmp_name = split(name, " ");

  let tmp_search = [];

  const name_len = tmp_name.length;

  for (let i = 0; i < name_len; i++) {

    let name_part = "";

    for (let j = i; j < name_len; j++) {

      name_part += tmp_name[j] + " ";

    }



    tmp_search.push({

      input: trim(name_part),

      weight: name_len - i

    });

  }



  console.log("");

  console.log("TmpSearch: ", tmp_search);

  console.log("");

  tmp.search = tmp_search;

  return tmp;

}


let _indexSuggestDoctors = function (gql, doctor) {

  return new Promise((resolve, reject) => {

    const index_data = _formattedSuggest(doctor, "DOCTOR");

    console.log("INDEX_DATA:", index_data);

    gql.mutation(

        indexSuggestMutation,

        'suggest.elasticsearch.index',

        {

          variables: {

            _id: doctor._id,

            input: index_data

          }

        })

      .then(resp => {

        console.log("SUCCESS_RESPONSE_SUGGEST: ", resp);

        resolve(true);

      })

      .catch(err => {

        console.log("ERROR: ", err);

        reject(err);

      });



    resolve(true);

  });

}


let _indexSuggestInstitutes = function (gql, institute) {

  return new Promise((resolve, reject) => {

    const index_data = _formattedInstitutesSuggest(institute, "INSTITUTE");

    console.log("INDEX_DATA:", index_data);

    gql.mutation(

        indexSuggestMutation,

        'suggest.elasticsearch.index',

        {

          variables: {

            _id: institute._id,

            input: index_data

          }

        })

      .then(resp => {

        console.log("SUCCESS_RESPONSE_SUGGEST: ", resp);

        resolve(true);

      })

      .catch(err => {

        console.log("ERROR: ", err);

        reject(err);

      });



    resolve(true);

  });

}


export {

  _getDoctor as getItem,

  _formattedDoctorsArray as formattedDoctorsArray,

  _indexDoctor as indexDoctor,

  _formattedSuggest as formattedSuggest,

  _indexSuggestDoctors as indexSuggestProduct,

  _getInstitute as getInstitute,

  _formattedInstitutesArray as formattedInstitutesArray,

  _indexInstitute as indexInstitute,

  _formattedInstitutesSuggest as formattedInstitutesSuggest,

  _indexSuggestInstitutes as indexInstituteSuggest
}