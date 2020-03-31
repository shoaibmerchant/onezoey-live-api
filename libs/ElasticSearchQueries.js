import gql from 'graphql-tag';
import {withApollo} from 'react-apollo';
import {Types} from '@actonate/mirkwood';
import {map , get} from 'lodash'
// import  'cosmetize-prod'  from '../app-config/constants/ImagePaths'

export class ElasticSearchQueries {

  static searchSuggestion(client, name) {
    return new Promise((resolve, reject) => {
      client
        .search({
        index: "one-zoey",
        type: "Suggest",
        body: {
          "suggest": {
            "search-suggest": {
              "prefix": name,
              "completion": {
                "field": "search",
                "fuzzy" : {
                  "fuzziness" : 2
                }
              }
            }
          }
        }
      })
        .then(res => {
          console.log(JSON.stringify(res));
          
          const response = {
            total: res.hits.total,
            maxScore: res.hits.max_score,
            hits: get(res,'suggest.search-suggest[0]').options.map(hit => ({_id: hit._id, source:{text:hit.text, ...hit._source} , score: hit._score}))
          };
          console.log(JSON.stringify(response));

          resolve(response);
        })
        .catch(err => {
          console.log("err", err)
          reject(err);
        })
    })
  }

  static getDoctorProfile(client, doctor_id){
    return new Promise((resolve, reject) => {
      client
        .search({
        index: "one-zoey",
        type: "DoctorsElasticsearch",
        body:{
          "query": {
              "bool": {
                  "must": [{
                      "term": {
                          "doctor_id": doctor_id
                      }
                  }],
                  "must_not": [],
                  "should": []
              }
          },
          "from": 0,
          "size": 10,
          "sort": [],
          "aggs": {},
        }
      })
        .then(res => {
          console.log(JSON.stringify(res));
          
          const response = {
            total: res.hits.total,
            maxScore: res.hits.max_score,
            hits: res
              .hits
              .hits
              .map(hit => ({_id: hit._id, source: hit._source, score: hit._score}))
          };
          console.log(JSON.stringify(response));

          resolve(response);
        })
        .catch(err => {
          console.log("err", err)
          reject(err);
        })
    })
    
  }

  static getInstituteProfile(client, institute_id){
    return new Promise((resolve, reject) => {
      client
        .search({
        index: "one-zoey",
        type: "InstituteElasticsearch",
        body:{
          "query": {
              "bool": {
                  "must": [{
                      "term": {
                          "institute_id": institute_id
                      }
                  }],
                  "must_not": [],
                  "should": []
              }
          },
          "from": 0,
          "size": 10,
          "sort": [],
          "aggs": {},
        }
      })
        .then(res => {
          console.log(JSON.stringify(res));
          
          const response = {
            total: res.hits.total,
            maxScore: res.hits.max_score,
            hits: res
              .hits
              .hits
              .map(hit => ({_id: hit._id, source: hit._source, score: hit._score}))
          };
          console.log(JSON.stringify(response));

          resolve(response);
        })
        .catch(err => {
          console.log("err", err)
          reject(err);
        })
    })
    
  }

  static getDoctorbyName(client, args){
    return new Promise((resolve, reject) => {
      client
        .search({
        index: "one-zoey",
        type: "DoctorsElasticsearch",
        body:{
            "query": {
              "fuzzy": {
                "text": {
                  "value": "vishal",
                  "fuzziness": "AUTO"
                }
              }
            }
          } 
      })
        .then(res => {
          console.log(JSON.stringify(res));
          
          const response = {
            total: res.hits.total,
            maxScore: res.hits.max_score,
            hits: res
              .hits
              .hits
              .map(hit => ({_id: hit._id, source: hit._source, score: hit._score}))
          };
          console.log(JSON.stringify(response));

          resolve(response);
        })
        .catch(err => {
          console.log("err", err)
          reject(err);
        })
    })
  }


  static getDoctorsByAreaName(client, args){
    return new Promise((resolve, reject) => {
      client
        .search({
        index: "one-zoey",
        type: "DoctorsElasticsearch",
        body:{
          "query": {
            "match": {
                "area": {
                  "query": args,
                  "fuzziness": 2,
                  "prefix_length": 1  
                }
              },
          },
          "from": 0,
          "size": 10,
          "sort": [],
          "aggs": {},
          } 
      })
        .then(res => {
          console.log(JSON.stringify(res));
          
          const response = {
            total: res.hits.total,
            maxScore: res.hits.max_score,
            hits: res
              .hits
              .hits
              .map(hit => ({_id: hit._id, source: hit._source, score: hit._score}))
          };
          console.log(JSON.stringify(response));

          resolve(response);
        })
        .catch(err => {
          console.log("err", err)
          reject(err);
        })
    })
  }

  static getDoctorsByLatLon(client, lat , lon){
    return new Promise((resolve, reject) => {
      client
        .search({
        index: "one-zoey",
        type: "DoctorsElasticsearch",
        body:{
            "query": {
                "bool" : {
                    "must" : {
                        "match_all" : {}
                    },
                    "filter" : {
                        "geo_distance" : {
                            "distance" : "15km",
                            "lat_lng.pin.location" : {
                                "lat" : lat,
                                "lon" : lon
                            }
                        }
                    }
                }
            }
          }           
      })
        .then(res => {
          console.log(JSON.stringify(res));
          
          const response = {
            total: res.hits.total,
            maxScore: res.hits.max_score,
            hits: res
              .hits
              .hits
              .map(hit => ({_id: hit._id, source: hit._source, score: hit._score}))
          };
          console.log(JSON.stringify(response));

          resolve(response);
        })
        .catch(err => {
          console.log("err", err)
          reject(err);
        })
    })
  }

  static getInstitutesByLatLon(client, lat , lon){
    return new Promise((resolve, reject) => {
      client
        .search({
        index: "one-zoey",
        type: "InstituteElasticsearch",
        body:{
            "query": {
                "bool" : {
                    "must" : {
                        "match_all" : {}
                    },
                    "filter" : {
                        "geo_distance" : {
                            "distance" : "15km",
                            "lat_lng.pin.location" : {
                                "lat" : lat,
                                "lon" : lon
                            }
                        }
                    }
                }
            }
          }           
      })
        .then(res => {
          console.log(JSON.stringify(res));
          
          const response = {
            total: res.hits.total,
            maxScore: res.hits.max_score,
            hits: res
              .hits
              .hits
              .map(hit => ({_id: hit._id, source: hit._source, score: hit._score}))
          };
          console.log(JSON.stringify(response));

          resolve(response);
        })
        .catch(err => {
          console.log("err", err)
          reject(err);
        })
    })
  }
  static getInstituteByAreaName(client , args){
    return new Promise((resolve, reject) => {
      client
        .search({
        index: "one-zoey",
        type: "InstituteElasticsearch",
        body:{
          "query": {
            "match": {
                "area": {
                  "query": args,
                  "fuzziness": 2,
                  "prefix_length": 1  
                }
              },
          },
          "from": 0,
          "size": 10,
          "sort": [],
          "aggs": {},
        }
      })
        .then(res => {
          console.log(JSON.stringify(res));
          
          const response = {
            total: res.hits.total,
            maxScore: res.hits.max_score,
            hits: res
              .hits
              .hits
              .map(hit => ({_id: hit._id, source: hit._source, score: hit._score}))
          };
          console.log(JSON.stringify(response));

          resolve(response);
        })
        .catch(err => {
          console.log("err", err)
          reject(err);
        })
    })
       
  }
}



