var mongo = require('mongodb'),
  MongoQ = require('../mongo-promise'),
  ObjectID = mongo.ObjectID,
  debug = require('debug')('rupert:mongo:retrieve'),
  util = require('../../util');

module.exports = function(server){
  server.get(util.idUrl(), function handleGet(req, res, next) {
    debug('GET-request recieved');
    var query = {
      '_id': new ObjectID(req.params.id)
    };

    debug('Query is ' + JSON.stringify(query));

    MongoQ.collection(server.mongo.db, req.params.collection)
    .then(function(collection){
      collection.findOne(query, {}, function (err, doc) {
        if(err){return next(err);}
        var result;
        res.set('content-type', 'application/json; charset=utf-8');
        if (doc) {
          result = util.flavorize(doc, 'out');
          res.send(result);
        } else {
          res.status(404).send();
        }
      });
    })
    .catch(next);
  });
};
