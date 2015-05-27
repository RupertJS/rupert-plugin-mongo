/**
 * Returns a supertest request with a base Rupert app using the provided route.
 */
global.superroute = function superroute(route, config){
  var Config = require('rupert').Config;
  config = new Config(config || {});
  var app = require('rupert/src/base')(config);
  route(app, config);
  var request = require('supertest')(app);
  request.app = app;
  return request;
};
