var
  MongoQ = require('./mongo-promise'),
  debug = require('debug')('rupert:mongo:rest'),
  util = require('../util');

debug("Loading Mongo REST routes.");

module.exports = function(server, config){

  util.setConfig(config);
  server.mongo = {
    configuration: util.connectionConfig()
  };

  MongoQ.connect(util.connectionUrl()).then(function(connection){
    server.mongo.db = connection;
  }).catch(function(err){
    debug('Error attaching routes: ' + err)
  });

  if(server.mongo.configuration.rest){
    debug('Attaching rest handlers');
    ['update', 'insert', 'list', 'remove', 'retrieve']
    .map(function(op){
      return './operations/' + op;
    }).forEach(function(path){
      debug('Attaching ' + path);
      var handler = require(path);
      handler(server, config);
    });
  }

};
