angular.module('travelapp', ['travelapp.controllers', 'travelapp.services', 'travelapp.directives'])

    .run(function ($rootScope, $window) {

        // TODO set parse api key here

    })
    .value('globals', function(){
        var globals = {
            // TODO add any globals here and reference with 'globals'
        };
        return globals;
    }())

    .config(function ($stateProvider, $urlRouterProvider) {
        // fallback route
        $urlRouterProvider.otherwise('/home');        

        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "templates/login.html",
                controller: "HomeCtrl"
            })
            .state('path', {
                url: "/path/aaron", // TODO change to :pathId
                templateUrl: "templates/path.html",
                controller: "PathCtrl"
            });
    })
    // .config(function ($httpProvider) {
    //     $httpProvider.defaults.transformRequest.push(function (data, headerGetter) {
    //         console.log("globally transform Request: possibly put lawnchair for offline caching here.");
    //         return data;
    //     });
    //     $httpProvider.defaults.transformResponse.push(function (data, headerGetter) {
    //         console.log("globally transform Response: possibly put lawnchair for offline caching here.");
    //         return data;
    //     });
    // })
    .config(function ($provide, $httpProvider) {
      console.log('adding interception logic');
      // Intercept http calls.
      $provide.factory('LoggingHttpInterceptor', function ($q) {
        return {
          // On request success
          request: function (config) {
            console.log(JSON.stringify(config)); // Contains the data about the request before it is sent.
            console.log("successful http request to: " + config.url 
                + " with auth headers: " + config.headers.Authorization
                + " and params: " + JSON.stringify(config.params));
     
            // Return the config or wrap it in a promise if blank.
            return config || $q.when(config);
          },
     
          // On request failure
          requestError: function (rejection) {
            console.log(JSON.stringify(rejection)); // Contains the data about the error on the request.
            
            // Return the promise rejection.
            return $q.reject(rejection);
          },
     
          // On response success
          response: function (response) {
            console.log(JSON.stringify(response)); // Contains the data from the response.
            console.log("response success with status: " + response.status 
                + " and statusText: " + response.statusText
                + " and data: " + JSON.stringify(response.data));
            
            // Return the response or promise.
            return response || $q.when(response);
          },
     
          // On response failture
          responseError: function (rejection) {
            console.log(JSON.stringify(rejection)); // Contains the data about the error.
            console.log("http response failure: " + JSON.stringify(rejection));
            
            // Return the promise rejection.
            return $q.reject(rejection);
          }
        };
      });
     
      // Add the interceptor to the $httpProvider.
      $httpProvider.interceptors.push('LoggingHttpInterceptor');
     
    });
