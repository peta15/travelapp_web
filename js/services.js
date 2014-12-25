angular.module('app.services', [])

.factory('User', ['globals', function(globals) {

  return {
    getById: function() {
      return null;
    }
  }
}])
.factory('Post', ['User', 'globals', function(User, globals) {

  return {
    all: function() {
      return null;
    }
  }

}]);
