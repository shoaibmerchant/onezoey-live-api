import {Types} from '@actonate/mirkwood';
// import {Address} from './types';
export default {
  name : "Doctor",
  datasource : {
    collection: "Doctors",
    timestamps: true,
    skip_deleted: true
  },
  fields : {
    _id: {
      type: Types.ID,
      hidden: true
    },
    first_name: {
      type: Types.String,
      required: true,
      label: 'First Name'
    },
    last_name: {
      type: Types.String,
      required: true,
      label: 'Last Name'
    },
    email: {
      type: Types.String,
      required: true,
      label: 'Email'
    },
    mobile: {
      type: Types.String,
      label: 'Mobile',
      required: true
    },
    token: {
      type: Types.String
      /* Virtual Field */
    },
    gender:{
      type : Types.Enum("DOCTOR_GENDER",{
        "MALE":{value:"MALE"},
        "FEMALE":{value:"FEMALE"},
        "OTHER":{value:"OTHER"},
      })
    },
    is_active :{
      type : Types.Boolean
    },
    designation :{
      type : Types.String
    },
    practicing_from :{
      type : Types.String
    },
    description :{
      type : Types.String
    },
    address :{
      type : Types.String
    },
    area :{
      type : Types.String
    },
    age :{
      type : Types.Int,
      max : 200
    },
    tags :{
      type : [Types.String]
    },
    nationality :{
      type : Types.String
    },
    years_of_experience :{
      type : Types.Int,
      max : 999
    },
    lat_lng :{
      type : [Types.String]
    },
    specialization :{
      type : [Types.String]
    },
    display_picture :{
      type : Types.String
    },
    average_rating :{
      type : Types.Float,
      max : 5      
    },
    qr_code :{
      type : Types.String
    },
    date_of_birth :{
      type : Types.String
    },
    license_number :{
      type : Types.String
    },
    is_a_teacher :{
      type : Types.Boolean,
      defaultValue : false
    },
    city :{
      type : Types.String
    },
    state :{
      type : Types.String
    },
    institutes :{
      type : [Types.ID]
      //Virtual Field for Elastic Search
    },
    chat_id: {
      type: Types.String
    },
    chat_password: {
      type: Types.String
    },
    chat_username: {
      type: Types.String
    }
  },
  relations: {
    
  }
}
