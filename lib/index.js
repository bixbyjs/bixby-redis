exports = module.exports = function redis(id) {
  var map = {
    'client': './client',
    'boot/connection': './boot/connection'
  };
  
  var mid = map[id];
  if (mid) {
    return require(mid);
  }
};

exports.scope = function (id, obj, $scope) {
  if (id == 'settings') {
    var prefix = $scope.prefix || 'statsd';
    if ($scope.options && $scope.options['#']) {
      prefix = $scope.options['#'];
    }
    return obj.isolate(prefix);
  }
  return obj;
}
