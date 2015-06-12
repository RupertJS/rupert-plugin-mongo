var
  MongoClient = require('mongodb').MongoClient,
  util = require('../util');

module.exports = {
  connect: function(url){
    return new Promise(function(s, j){
      MongoClient.connect(url, function(err, connection){
        if(err){
          j(err);
        } else {
          s(connection);
        }
      });
    });
  },
  collection: function(db, collectionName){
    return new Promise(function(resolve, reject){
      db.collection(collectionName, function (err, collection) {
        if(err){
          return reject(err);
        } else {
          return resolve(collection);
        }
      });
    });
  },
  getDatabase: function(){
    var url = util.connectionUrl();
    return module.exports.connect(url);
  }
};
