angular.module('app.services', [])

.factory('User', ['globals', '$q', '$log', '$rootScope', function(globals, $q, $log, $rootScope) {

  var User = Parse.User.extend("User", {
      // Instance methods

      fbProfileImage: function(type) {
        // type: square,small,normal,large
        return 'https://graph.facebook.com/' + this.fbId + '/picture?type='+type;
      }
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
      },

      enrichCurrentUser: function() {
        var self = User;
        FB.getLoginStatus(function(loginResponse) {
          $log.debug('loginResponse: ');
          $log.debug(loginResponse);
          $log.debug('current user: ');
          $log.debug(self.current());
          if (loginResponse.status === 'connected' && self.current() != null) {
              FB.api('/me', function(response) {
                $log.debug(response);
                $log.debug('Updating user ' + response.name + ' with FB profile data.');
                self._updateCurrentUser(self.current(), response);
                self.current().save(null, {
                  success: function(user) {
                    $log.debug("Found and enriched current user");
                    // $rootScope.currentUser = user; // replaced with current user observer
                    $rootScope.$apply();
                  }, error: function(user, error) {
                    alert("Error: " + error.code + " " + error.message);
                  }
                });
              });
            } else {
              $log.debug('not connected to FB or no current user so logging out to ensure parse user and FB are in sync');
              self.logOut();
            }
        });
      },

      fbLogin: function() {
        var self = User;
        $log.debug('calling fb login');
        Parse.FacebookUtils.logIn("publish_actions", {
          success: function(user) {
            if (!user.existed()) {
              $log.debug("User signed up and logged in through Facebook");
            } else {
              $log.debug("User logged in through Facebook");
            }
            self.enrichCurrentUser(self); // TODO should we only do this upon signup or every time in case we need to update data?
          },
          error: function(user, error) {
            $log.debug("User cancelled the Facebook login or did not fully authorize.");
          }
        });
      },

      // helper for setCurrentUser
      _updateCurrentUser: function(currentUser, response) {
        currentUser.set("name", response.name);
        currentUser.set("username", response.email || response.name); // TODO change to string like v554iKo7ey46TPGaUxzjCSdOP
        currentUser.set("password", "temp_" + Math.random()); // TODO change to string like v554iKo7ey46TPGaUxzjCSdOP
        currentUser.set("email", response.email);
        currentUser.set("fbId", response.id);
        currentUser.set("firstName", response.first_name);
        currentUser.set("lastName", response.last_name);
        currentUser.set("fbUpdatedAt", new Date());
        $log.debug("setting user info from facebook with" +
            " name: " + response.name +
            " email: " + response.email +
            " fbId: " + response.id +
            " firstName: " + response.first_name +
            " lastName: " + response.last_name);
        return currentUser;
      }
    });

    Object.defineProperty(User.prototype, "name", {
      get: function() {
        return this.get("name");
      },
      set: function(aValue) {
        this.set("name", aValue);
      }
    });

    Object.defineProperty(User.prototype, "firstName", {
      get: function() {
        return this.get("firstName");
      },
      set: function(aValue) {
        this.set("firstName", aValue);
      }
    });

    Object.defineProperty(User.prototype, "lastName", {
      get: function() {
        return this.get("lastName");
      },
      set: function(aValue) {
        this.set("lastName", aValue);
      }
    });

    Object.defineProperty(User.prototype, "fbId", {
      get: function() {
        return this.get("fbId");
      },
      set: function(aValue) {
        this.set("fbId", aValue);
      }
    });

    Object.defineProperty(User.prototype, "fbUpdatedAt", {
      get: function() {
        return this.get("fbUpdatedAt");
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

    Object.defineProperty(Post.prototype, "text", {
      get: function() {
        return this.get("text");
      },
      set: function(aValue) {
        this.set("text", aValue);
      }
    });

    Object.defineProperty(Post.prototype, "rating", {
      get: function() {
        return this.get("rating");
      },
      set: function(aValue) {
        this.set("rating", aValue);
      }
    });

    Object.defineProperty(Post.prototype, "locationName", {
      get: function() {
        return this.get("locationName");
      },
      set: function(aValue) {
        this.set("locationName", aValue);
      }
    });

    // Location property (Parse GeoPoint)
    Object.defineProperty(Post.prototype, "location", {
      get: function() {
        return this.get("location");
      },
      set: function(aValue) {
        this.set("location", aValue);
      }
    });

    Object.defineProperty(Post.prototype, "image640", {
      get: function() {
        return this.get("image640").url();
      }
    });

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
