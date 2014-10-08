/**
 * Module dependencies.
 */
var redis = require('redis');


exports = module.exports = function(settings, logger) {
	var config = settings.toObject();
	if (!config.host) { throw new Error('Redis host not set in config'); }
	var host = config.host;
	var port = config.port || 6379;

  var client = redis.createClient(port, host);
  
  // NOTE: By default, if the connection to Redis is closed, the process will
  //       exit.  In accordance with a microservices architecture, it is
  //       expected that a higher-level monitor will detect process termination
  //       and restart as necessary.
  client.on('close', function() {
    logger.error('Redis connection closed');
    process.exit(-1);
  });
  
  // NOTE: By default, if an error is encountered from Redis it will be
  //       rethrown.  This will cause an `uncaughtException` within Node and the
  //       process will exit.  In accordance with a microservices architecture,
  //       it is expected that a higher-level monitor will detect process
  //       failures and restart as necessary.
  client.on('error', function(err) {
    logger.error('Unexpected error from Redis: %s', err.message);
    logger.error(err.stack);
    throw err;
  });
  
  return client;
}

/**
 * Component annotations.
 */
exports['@singleton'] = true;
exports['@require'] = ['settings', 'logger'];
