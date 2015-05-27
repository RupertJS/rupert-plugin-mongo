var
  debug = require('debug')('rupert:mongo:remove'),
  MongoQ = require('../mongo-promise'),
  ObjectID = require('mongodb').ObjectID,
  util = require('../../util');

module.exports = function(server){
  server.delete(util.idUrl(), function (req, res, next) {
    debug('DELETE-request recieved on ' + req.params.id);
    MongoQ.collection(server.mongo.db, req.params.collection)
    .then(function(collection){
      collection.remove({ '_id': new ObjectID(req.params.id) }, function (err) {
        if(err){return next(err);}
        res.set('content-type', 'application/json; charset=utf-8');
        res.json({'ok': 1});
      });
    })
    .catch(next);
  });
};
