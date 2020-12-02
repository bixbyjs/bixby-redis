/**
 * Redis.
 *
 * This component provides an API for querying [Redis][1], a data structure
 * store used as a database, cache, and message broker.
 *
 * Internally, the implementation uses the [`redis`][2] module.  The intent of
 * this API is to provide a wrapper that conforms more closely to Node.js'
 * [`'net`][3] module.
 *
 * [1]: https://redis.io/
 * [2]: https://github.com/NodeRedis/node-redis
 * [3]: https://nodejs.org/api/net.html
 */
exports = module.exports = function(keyring) {
  var redis = require('redis');
  
  
  var API = {};
  
  API.connect =
  API.createConnection = function(options, connectListener) {
    var client = redis.createClient(options.port, options.address || options.name);
    if (connectListener) { client.once('connect', connectListener); }
    
    // TODO: Handle initial errors somehow...
    
    // FIXME: put this back
    /*
    keyring.get(options.name, function(err, cred) {
      // TODO: Error handling
      client.auth(cred.password);
    });
    */
    
    return client;
  };
  
  return API;
};

exports['@singleton'] = true;
exports['@implements'] = 'http://i.bixbyjs.org/redis';
exports['@require'] = [
  'http://i.bixbyjs.org/security/Keyring'
];
