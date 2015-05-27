module.exports = function (config){
  config.prepend('routing', __dirname + '/mongo/mongo-route.js');
};
