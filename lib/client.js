/**
 * Module dependencies.
 */
var redis = require('redis')
  , bootable = require('bootable');


exports = module.exports = function(settings, logger) {
  var config = settings.toObject();
  if (!config.host) { throw new Error('Redis host not set in config'); }
  var host = config.host;
  var port = config.port || 6379;
  var db = config.db;

  var client = redis.createClient(port, host);
  if (db) {
    logger.debug('Selecting Redis database %d', db);
    client.select(db);
  }
  
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

  client = bootable(client);
  client.phase(require('./init/connect')(logger));
  return client;
}

/**
 * Component annotations.
 */
exports['@singleton'] = true;
exports['@require'] = ['settings', 'logger'];
