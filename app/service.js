exports = module.exports = function(keyring) {
  var redis = require('redis');
  
  
  var api = {};
  
  api.createConnection = function(options, connectListener) {
    var client = redis.createClient(options.port, options.cname);
    
    client.on('ready', function() {
      console.log('READY');
    });
    
    // TODO: setup connect listener from arguments
    client.on('connect', function() {
      console.log('CONNECT');
    });
    
    client.on('reconnecting', function() {
      console.log('RECONNECTING');
    });
    
    client.on('error', function(err) {
      console.log('ERROR!');
      console.log(err)
    });
    
    process.nextTick(function() {
      keyring.get(client.address.split(':')[0], function(err, cred) {
        console.log(err);
        console.log(cred)
        
        client.auth(cred.password);
      });
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
