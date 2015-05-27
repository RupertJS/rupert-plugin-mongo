var MongoQ = require('../mongo-promise'),
  debug = require('debug')('rupert:mongo:list'),
  util = require('../../util');

module.exports = function(server){

  server.get(util.collectionUrl(), function(req, res, next) {
    debug('GET-request recieved');
    var query = req.query.query ? util.parseJSON(req.query.query, next) : {};

    var options = req.params.options || {};

    var test = ['limit', 'sort', 'fields', 'skip', 'hint', 'explain', 'snapshot', 'timeout'];

    for (var v in req.query) {
      if (test.indexOf(v) !== -1) {
        options[v] = req.query[v];
      }
    }

    debug('Query is ' + JSON.stringify(options));
    MongoQ.collection(server.mongo.db, req.params.collection)
    .then(function(collection){
      collection.find(query, options, function (err, cursor) {
        if(err){return next(err);}
        cursor.toArray(function (err, docs) {
          if(err){return next(err);}
          var result = [];
          res.set('content-type', 'application/json; charset=utf-8');
          docs.forEach(function (doc) {
            result.push(util.flavorize(doc, 'out'));
          });
          res.send(result);
        });
      });
    });
  });
};
