exports = module.exports = function(keyring) {
  var redis = require('redis');
  
  
  var api = {};
  
  api.createConnection = function(options, connectListener) {
    var client = redis.createClient(options.port, options.cname);
    if (connectListener) { client.once('connect', connectListener); }
    
    // TODO: Handle initial errors somehow...
    
    keyring.get(options.cname, function(err, cred) {
      // TODO: Error handling
      client.auth(cred.password);
    });
    
    return client;
  }
  
  return api;
};

exports['@singleton'] = true;
exports['@implements'] = [
  'http://i.bixbyjs.org/redis',
  'http://i.bixbyjs.org/IService'
];
exports['@name'] = 'redis';
exports['@require'] = [
  'http://i.bixbyjs.org/security/CredentialsStore'
];
