module.exports = function (config){
  config.prepend('routing', __dirname + '/mongo/mongo-route.js');
};

module.exports.getDatabase = require('./mongo/mongo-promise').getDatabase;
