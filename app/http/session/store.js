exports = module.exports = function(redis, location) {
  var session = require('express-session');
  var RedisStore = require('connect-redis')(session);
  
  
  var client = redis.createConnection(location);
  var store = new RedisStore({ client: client });
  return store;
};

exports['@singleton'] = true;
exports['@implements'] = 'http://i.bixbyjs.org/http/SessionStore';
exports['@service'] = 'sess-redis';
exports['@port'] = 6379;
exports['@require'] = [
  'http://i.bixbyjs.org/redis',
  '$location'
];
