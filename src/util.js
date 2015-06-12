/**
 * Copyright 2013 Ricard Aspeljung via crest
 */

function InvalidArgumentError(message){
  Error.call(this, message);
}

var config;

module.exports = {
  setConfig: function(_conf){
    config = _conf;
  },
  /*
   * flavorize - Changes JSON based on flavor in configuration
   */
  flavorize: function (doc, direction) {
    var flavor = config.find('flavor', 'normal');
    if (direction === 'in') {
      if (flavor === 'normal') {
        delete doc.id;
      }
    } else {
      if (flavor === 'normal') {
        var id = doc._id.toHexString();
        delete doc._id;
        doc.id = id;
      } else {
        doc._id = doc._id.toHexString();
      }
    }
    return doc;
  },
  parseJSON: function (data, next) {
    var json;
    try {
      json = JSON.parse(data);
    } catch (e) {
      return next(new InvalidArgumentError('Not valid JSON data.'));
    }
    return json;
  },
  connectionConfig: function(dbName){
    if(!config){
      throw new Error(
        "Rupert Mongo Plugin has not been initialized!" +
        "Wait for Rupert Plugins to run before attempting a connection!"
      );
    }
    return {
      username: config.find('mongo.username', 'MONGO_USERNAME', ''),
      password: config.find('mongo.password', 'MONGO_PASSWORD', ''),
      host: config.find('mongo.host', 'MONGO_HOST', config.find('hostname')),
      port: config.find('mongo.port', 'MONGO_PORT', 27017),
      dbName: dbName || config.find('mongo.database', 'MONGO_DATABASE', config.find('name')),
      uri: config.find('mongo.uri', 'MONGO_URI', null),
      rest: {
        open: config.find('mongo.rest', false),
        prefix: config.find('mongo.rest.prefix', '/api'),
        version: config.find('mongo.rest.version', '/v1'),
      },
      db: { native_parser: true },
      server: { poolSize: 5 },
      server: {
        socketOptions: {
          keepAlive: 1
        }
      }
    };
  },
  connectionUrl: function(dbName){
    var c = this.connectionConfig(dbName);
    if(c.uri && c.uri.match(/^mongodb:/)){
      return c.uri;
    }
    var auth = (c.username && c.password) ? (c.username + ':' + c.password + '@') : '';
    var address = c.host + ':' + c.port;
    var connectionString = 'mongodb://' + auth + address + '/' + c.dbName;
    c.uri = connectionString;
    return connectionString;
  },
  collectionUrl: function(id){
    var conf = this.connectionConfig();
    var path = conf.rest.prefix + conf.rest.version +'/:collection';
    if(id){
      path += '/:id';
    }
    return path;
  },
  idUrl: function(){
    return this.collectionUrl(true);
  }
};
