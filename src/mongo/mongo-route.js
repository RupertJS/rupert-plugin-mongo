var
  MongoQ = require('./mongo-promise'),
  debug = require('debug')('rupert:mongo'),
  util = require('../util');

debug('rest.js is loaded');

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

  if(server.configuration.openrest){
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
