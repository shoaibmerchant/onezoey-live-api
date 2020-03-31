import {Types} from '@actonate/mirkwood';
import {map} from 'lodash'
import {ElasticSearchQueries} from '../../../libs/ElasticSearchQueries'
export default {
  name : 'doctor_filter',
  type : 'DoctorElastic_SearchType',
  args : {
    doctor :{
      type : [Types.generateInputType({
      name: "doctor_input",
      fields: {
        first_name :{
          type : Types.String
        },
        last_name :{
         type : Types.String
        }
      }
    })]
  },
    
   search:{
    type : Types.String
   },
   range:{
     type : Types.Int
   }
  },
  resolve : (_, args, {gql, req, utils}) => {
    return new Promise((resolve, reject) => {
      const connection = utils.elasticsearch.connection;
      const client = connection.client; // elasticsearch.js client
      console.log(args);
      const query = getCategoryfilter(args.doctor, args.search, args.range, args.size ,args.sort);
      console.log("query",JSON.stringify(query));
      
      ElasticSearchQueries
        .searchSuggestion(client, "vishal")
        .then(res => {
          console.log("RESPONSE" , res);
          resolve(res);
        })
        .catch(err => {
          console.log(err);
        })
    })
  }
}

function getCategoryfilter(attribute, data, range, size,sort) {

  let sortData=[];
  let doctor={
    "first_name": {
      "order": sort
    }
  }
  sortData.push(doctor);
  if(doctor){
    let storeData={
      "_created_at":{
        "order":"desc"
      }
    }
    sortData.push(storeData);

  }
  const query = {
    "query": {
      "dis_max": {
        "tie_breaker": 0.7,
        "boost": 1.2,
        "queries": queries(attribute, data)
      }
    }
  };
  return query;
}
function termMatch(name, array) {
  let term = [];
  let termName = {
    "term": {
      "doctor.first_name": name
    }
  };
  term.push(termName);
  let bool = {
    "bool": {
      "should": []
    }
  }
  
  term.push(bool);
  return term;
}

function nested_match(name, array) {
  let nested_term = {
    "nested": {
      "path": "attributes",
      "query": {
        "bool": {
          "must": termMatch(name, array)
        }
      }
    }
  }
  return nested_term;
}
function bool_must(attributeArray) {
  let bool_must = {
    "must": []
  }
  map(attributeArray, data => {
    if (Array.isArray(data.value) && data.value.length > 0) {
      let a = nested_match(data.attribute_id, data.value);
      bool_must
        .must
        .push(a);
    }
  });

  return bool_must;

}
function match_query(data) {
  let match_query = {
    "multi_match": {
      "query": data,
      "fields": ["name", "title"]
    }
  };
  return match_query;
};
function range_query(data) {
  let range_query = {
    "range": {
      "discounted_price": {
        "gte": data.min,
        "lte": data.max

      }
    }
  };
  return range_query;
}
function queries(attributeArray, data, range,store, sub_category, category, brand) {
  let queries = [
    {
      "bool": {
        must: []
      }
    }
  ];
  let bool = {
    bool: bool_must(attributeArray)
  }

  let categoryData = {
    "term": {
      "item_category_url_slugs": category
    }
  };
  let subCategoryData = {
    "term": {
      "item_sub_category_ids": sub_category
    }
  };
  let storeData = {
    "term": {
      "store_ids": store
    }
  };
  let sort = {
    "sort": [
      {
        "discounted_price": {
          "order": "asc"
        }
      }
    ]
  };
  let match_query_brand = {
    "term": {
      "brand_id": brand
    }
  };
  
  if (brand) {
    queries[0]
      .bool
      .must
      .push(match_query_brand)
  }
 
  // queries[0]   .bool   .must   .push(sort);
  if (sub_category) {
    queries[0]
      .bool
      .must
      .push(subCategoryData)
  }
  if (category) {
    queries[0]
      .bool
      .must
      .push(categoryData);
  }
  if(store){
    queries[0]
    .bool
    .must
    .push(storeData);
  }
  // queries[0]
  //   .bool
  //   .must
  //   .push(range_query(range));
  if (data) {
    queries[0]
      .bool
      .must
      .push(match_query(data));
  }
  queries[0]
    .bool
    .must
    .push(bool);
  return queries;
}
