var mongo = require('mongodb'),
  MongoQ = require('../mongo-promise'),
  ObjectID = mongo.ObjectID,
  debug = require('debug')('rupert:mongo:update'),
  util = require('../../util');

debug('Loaded');

module.exports = function(server){
  var route = util.idUrl();
  debug('Attaching UPDATE (put and post) at ' + route);
  server.put(route, update);
  server.post(route, update);

  function update(req, res, next) {
    debug('PUT-request recieved');
    var spec = {
      '_id': new ObjectID(req.params.id)
    };
    MongoQ.collection(server.mongo.db, req.params.collection)
    .then(function(collection){
      collection.update(spec, req.body, true, function (err) {
        if(err){return next(err);}
        res.set('content-type', 'application/json; charset=utf-8');
        res.json({'ok': 1});
      });
    })
    .catch(next);
  }
};
