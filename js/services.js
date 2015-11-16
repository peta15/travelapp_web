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
        // enrich current user with FB data
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

    // get objectId with .id

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
.factory('Path', ['User', 'globals', '$q', function(User, globals, $q) {

  var Path = Parse.Object.extend("Path", {
      // Instance methods
    }, {
      // Class methods
      getById: function(id) {
        var defer = $q.defer();
 
        var query = new Parse.Query(this);
        var query2 = new Parse.Query(this);
        query.get(id, {
          success : function(path) {
            defer.resolve(path);
          },
          error : function(error) {
            query2.equalTo("pathId", id);
            query2.first().then(function(result) {
              defer.resolve(result);
            });
          }
        });
 
        return defer.promise;
      },

      listByUser : function(user) {
        var defer = $q.defer();

        var query = new Parse.Query(this);
        query.equalTo("creator", user);
        query.descending("userCreatedAt");
        query.find({
          success : function(paths) {
            defer.resolve(paths);
          },
          error : function(error) {
            defer.reject(error);
          }
        });

        return defer.promise;
      }
    });

    // get objectId with .id

    Object.defineProperty(Path.prototype, "name", {
      get: function() {
        return this.get("name");
      },
      set: function(aValue) {
        this.set("name", aValue);
      }
    });

    Object.defineProperty(Path.prototype, "userUpdatedAt", {
      get: function() {
        return this.get("userUpdatedAt");
      },
      set: function(aValue) {
        this.set("userUpdatedAt", aValue);
      }
    });

    Object.defineProperty(Path.prototype, "userCreatedAt", {
      get: function() {
        return this.get("userCreatedAt");
      },
      set: function(aValue) {
        this.set("userCreatedAt", aValue);
      }
    });

    // Object.defineProperty(Path.prototype, "experienceType", {
    //   get: function() {
    //     return this.get("experienceType");
    //   },
    //   set: function(aValue) {
    //     this.set("experienceType", aValue);
    //   }
    // });

    Object.defineProperty(Path.prototype, "creator", {
      get: function() {
        var defer = $q.defer();
        this.get("creator").fetch({
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

    return Path;

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
      },

      listByPath : function(path) {
        var defer = $q.defer();

        var query = new Parse.Query(this);
        query.equalTo("path", path);
        query.include("photo");
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

    // get objectId with .id

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

    Object.defineProperty(Post.prototype, "photo", {
      get: function() {
        return this.get("photo");
      },
      set: function(aValue) {
        this.set("photo", aValue);
      }
    });

    Object.defineProperty(Post.prototype, "userCreatedAt", {
      get: function() {
        return this.get("userCreatedAt");
      }
    });

    Object.defineProperty(Post.prototype, "hasPhoto", {
      get: function() {
        if (this.get("photo")) {
          return true;
        } else {
          return false;
        }
      }
    });

    Object.defineProperty(Post.prototype, "author", {
      get: function() {
        return this.get("author");
      },
      set: function(aValue) {
        this.set("author", aValue);
      }
    });

    Object.defineProperty(Post.prototype, "path", {
      get: function() {
        return this.get("path");
      },
      set: function(aValue) {
        this.set("path", aValue);
      }
    });

    return Post;

}])
.factory('Photo', [function() {

  var Photo = Parse.Object.extend("Photo", {
      // Instance methods
    }, {
      // Class methods
    });

    // get objectId with .id

    Object.defineProperty(Photo.prototype, "file1280", {
      get: function() {
        return this.get("file1280").url();
      }
    });

    Object.defineProperty(Photo.prototype, "width1280", {
      get: function() {
        return this.get("width1280");
      },
      set: function(aValue) {
        this.set("width1280", aValue);
      }
    });

    Object.defineProperty(Photo.prototype, "height1280", {
      get: function() {
        return this.get("height1280");
      },
      set: function(aValue) {
        this.set("height1280", aValue);
      }
    });

    Object.defineProperty(Photo.prototype, "file640", {
      get: function() {
        return this.get("file640").url();
      }
    });

    Object.defineProperty(Photo.prototype, "width640", {
      get: function() {
        return this.get("width640");
      },
      set: function(aValue) {
        this.set("width640", aValue);
      }
    });

    Object.defineProperty(Photo.prototype, "userCreatedAt", {
      get: function() {
        return this.get("userCreatedAt");
      }
    });

    Object.defineProperty(Photo.prototype, "userUpdatedAt", {
      get: function() {
        return this.get("userUpdatedAt");
      }
    });

    Object.defineProperty(Photo.prototype, "hasFile1280", {
      get: function() {
        if (this.get("file1280")) {
          return true;
        } else {
          return false;
        }
      }
    });

    Object.defineProperty(Photo.prototype, "hasFile640", {
      get: function() {
        if (this.get("file640")) {
          return true;
        } else {
          return false;
        }
      }
    });

    Object.defineProperty(Photo.prototype, "deleted", {
      get: function() {
        return this.get("deleted");
      },
      set: function(aValue) {
        this.set("deleted", aValue);
      }
    });

    return Photo;

}]);