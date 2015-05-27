var MongoQ = require('../mongo-promise'),
debug = require('debug')('rupert:mongo:insert'),
util = require('../../util')
;

module.exports = function(server){
  var url = util.collectionUrl();
  debug("Attaching INSERT handler for " + url);
  server.post(url, function (req, res, next) {
    debug('POST insert request: ' + req.params.collection);
    if (req.params) {
      MongoQ.collection(server.mongo.db, req.params.collection)
      .then(function(collection){
        collection.insert(req.body, function (err, docs) {
          res.header('Location', '/' + req.params.collection + '/' + docs.ops[0]._id.toHexString());
          res.set('content-type', 'application/json; charset=utf-8');
          res.status(201).json({'ok': 1});
        });
      })
      .catch(next)
      ;
    } else {
      res.set('content-type', 'application/json; charset=utf-8');
      res.json(200, {'ok': 0});
    }
  });
};
