exports = module.exports = function(redis) {
  var session = require('express-session');
  var RedisStore = require('connect-redis')(session);
  
  
  var api = {};
  
  api.createConnection = function(options, connectListener) {
    var client = redis.createConnection(options);
    
    var store = new RedisStore({ client: client });
    if (connectListener) { store.once('connect', connectListener); }
    return store;
  };
  
  return api;
};

exports['@singleton'] = true;
exports['@implements'] = [
  'http://i.bixbyjs.org/IService',
  'http://i.bixbyjs.org/http/ISessionStore'
];
exports['@name'] = 'sess-redis';
exports['@port'] = 6379;
exports['@protocol'] = 'tcp';
exports['@require'] = [
  'http://i.bixbyjs.org/redis'
];
