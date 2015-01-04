angular.module('app.services', [])

.factory('User', ['globals', '$q', function(globals, $q) {

  var User = Parse.User.extend("User", {
      // Instance methods
    }, {
      // Class methods
      getById: function(id) {
        var defer = $q.defer();
 
        var query = new Parse.Query(this);
        query.get(id, {
          success : function(user) {
            defer.resolve(user);
          },
          error : function(error) {
            defer.reject(error);
          }
        });
 
        return defer.promise;
      }
    });

    // Name property
    Object.defineProperty(User.prototype, "name", {
      get: function() {
        return this.get("name");
      },
      set: function(aValue) {
        this.set("name", aValue);
      }
    });
 
    // fbProfileImage100x75 property
    Object.defineProperty(User.prototype, "fbProfileImage100x75", {
      get: function() {
        return this.get("fbProfileImage100x75").url();
      }
    });
 
    return User;
}])
.factory('Post', ['User', 'globals', '$q', function(User, globals, $q) {

  var Post = Parse.Object.extend("Post", {
      // Instance methods
    }, {
      // Class methods
      listByUser : function(user) {
        var defer = $q.defer();
 
        var query = new Parse.Query(this);
        query.equalTo("author", user);
        query.descending("userCreatedAt");
        query.find({
          success : function(posts) {
            defer.resolve(posts);
          },
          error : function(error) {
            defer.reject(error);
          }
        });
 
        return defer.promise;
      }
    });
 
    // author, text, rating, locationLatitude, locationLongitude, locationName, image, userCreatedAt, userUpdatedAt

    // Text property
    Object.defineProperty(Post.prototype, "text", {
      get: function() {
        return this.get("text");
      },
      set: function(aValue) {
        this.set("text", aValue);
      }
    });

    // Rating property
    Object.defineProperty(Post.prototype, "rating", {
      get: function() {
        return this.get("rating");
      },
      set: function(aValue) {
        this.set("rating", aValue);
      }
    });

    // LocationName property
    Object.defineProperty(Post.prototype, "locationName", {
      get: function() {
        return this.get("locationName");
      },
      set: function(aValue) {
        this.set("locationName", aValue);
      }
    });
 
    // Image property
    Object.defineProperty(Post.prototype, "image640", {
      get: function() {
        return this.get("image640").url();
      }
    });

    // UserCreatedAt property
    Object.defineProperty(Post.prototype, "userCreatedAt", {
      get: function() {
        return this.get("userCreatedAt");
      }
    });

    Object.defineProperty(Post.prototype, "hasImage640", {
      get: function() {
        if (this.get("image640")) {
          return true;
        } else {
          return false;
        }
      }
    });

    return Post;

}]);
