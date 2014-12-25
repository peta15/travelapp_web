angular.module('app.services', [])

.factory('User', function(globals) {

  return {
    getById: function() {
      return null;
    }
  }
})
.factory('Post', function(User, globals, $cachedResource) {

  return {
    all: function() {
      return null;
    }
  }

});
