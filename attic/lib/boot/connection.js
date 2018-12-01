exports = module.exports = function(client, settings, logger) {
  
  return function connection(done) {
    if (client.ready) {
      logger.debug('Already connected to Redis %s', client.address);
      return process.nextTick(done);
    }
    
    client.once('ready', function() {
      logger.debug('Connected to Redis %s', client.address);
      done();
    });
  }
};


/**
 * Component annotations.
 */
exports['@require'] = [ '../client', 'settings', 'logger' ];
