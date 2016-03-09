exports = module.exports = function redis(id) {
  var map = {
    'client': './client'//,
    //'boot/connection': './boot/connection'
  };
  
  var mid = map[id];
  if (mid) {
    return require(mid);
  }
};

exports.used = function(container) {
  container.register('client');
};
