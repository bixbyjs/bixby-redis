


exports = module.exports = function(settings, logger) {
  var redis = require('redis');
  
  var config = settings.toObject();
  if (!config.host) { throw new Error('Redis host not set in config'); }
  var host = config.host;
  var port = config.port || 6379;
  var opts = {
    auth_pass: config.password
  };
  
  var db = config.db;

  var client = redis.createClient(port, host, opts);
  
  // TODO: Factor this into an initializer
  /*
  if (db) {
    logger.debug('Selecting Redis database %d', db);
    client.select(db);
  }
  */
  
  // NOTE: By default, if the connection to Redis is closed, the process will
  //       exit.  In accordance with a microservices architecture, it is
  //       expected that a higher-level monitor will detect process termination
  //       and restart as necessary.
  // FIXME: Determine if there is a better pattern for this behavior.
  /*
  client.on('close', function() {
    logger.error('Redis connection closed');
    process.exit(-1);
  });
  */
  
  // If an error is encountered from Redis it will be logged and rethrown.  This
  // will cause an `uncaughtException` within Node and the process will exit. 
  // It is expected that a higher-level process monitor will detect process
  // termination and restart as necessary.
  client.on('error', function(err) {
    logger.error('Unexpected error from Redis: %s', err.message);
    logger.error(err.stack);
    throw err;
  });
 
  
  return client;
}


exports['@singleton'] = true;
exports['@require'] = [ '$settings', 'http://i.bixbyjs.org/Logger' ];

exports['@implements'] = 'http://i.bixbyjs.org/redis/Client';
