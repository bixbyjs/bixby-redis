exports = module.exports = function(logger) {
  
  return function connection(done) {
    var self = this;
    if (self.ready) {
      logger.debug('Already connected to Redis %s', self.address);
      return process.nextTick(done);
    }
    
    self.once('ready', function() {
      logger.debug('Connected to Redis %s', self.address);
      done();
    });
  }
};
