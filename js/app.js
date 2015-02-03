angular.module('app', ['ui.router', 'uiGmapgoogle-maps', 'ngLodash', 'app.controllers', 'app.services', 'app.directives'])

    .run(['$rootScope', '$window', 'User', function ($rootScope, $window, User) {

        // TODO set parse api key here
        Parse.initialize('dj2Rcjb9bvAmYWJvKLlDpj1WasLwn5mcum3yktCP','viset42LCn1piYJEFblISpZLmi2egYJZvy0AskEi');

        $rootScope.sessionUser = User.current();

    }])
    .value('globals', function(){
        var globals = {
            // TODO add any globals here and reference with 'globals'
        };
        return globals;
    }())
    .config(['$logProvider', function ($logProvider) {
        $logProvider.debugEnabled(true);
    }])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        // fallback route
        $urlRouterProvider
            .when('/from/fb/:userId/:idType/:id', ['$match', '$stateParams', function ($match, $stateParams) {
                // TODO redirect to a path page centered on the post (and/or post highlighted in feed and map)
                // where :idType = "post" and :id is the postId of the post
                // if no post with postId found then redirect to user page
                return "/user/" + $match.userId;
            }])
            .otherwise('/');

        $stateProvider
            .state('app', {
                abstract: true,
                template: '<ui-view/>',
                controller: "AppCtrl"
            })
            .state('app.home', {
                url: "/",
                templateUrl: "templates/home.html",
                controller: "HomeCtrl"  
            })
            .state('app.user', {
                url: "/user/:userId",
                templateUrl: "templates/path.html",
                controller: "PathCtrl"
            });
    }])
    .config(['uiGmapGoogleMapApiProvider', function (uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.19',
            libraries: 'weather,geometry,visualization'
        });
    }]);
    // .config(['$httpProvider', '$log', function ($httpProvider, $log) {
    //     $httpProvider.defaults.transformRequest.push(function (data, headerGetter) {
    //         $log.debug("globally transform Request: possibly put lawnchair for offline caching here.");
    //         return data;
    //     });
    //     $httpProvider.defaults.transformResponse.push(function (data, headerGetter) {
    //         $log.debug("globally transform Response: possibly put lawnchair for offline caching here.");
    //         return data;
    //     });
    // }])
    // .config(['$provide', '$httpProvider', '$log', function ($provide, $httpProvider, $log) {
    //   $log.debug('adding interception logic');
    //   // Intercept http calls.
    //   $provide.factory('LoggingHttpInterceptor', function ($q) {
    //     return {
    //       // On request success
    //       request: function (config) {
    //         $log.debug(JSON.stringify(config)); // Contains the data about the request before it is sent.
    //         $log.debug("successful http request to: " + config.url 
    //             + " with auth headers: " + config.headers.Authorization
    //             + " and params: " + JSON.stringify(config.params));
     
    //         // Return the config or wrap it in a promise if blank.
    //         return config || $q.when(config);
    //       },
     
    //       // On request failure
    //       requestError: function (rejection) {
    //         $log.debug(JSON.stringify(rejection)); // Contains the data about the error on the request.
            
    //         // Return the promise rejection.
    //         return $q.reject(rejection);
    //       },
     
    //       // On response success
    //       response: function (response) {
    //         $log.debug(JSON.stringify(response)); // Contains the data from the response.
    //         $log.debug("response success with status: " + response.status 
    //             + " and statusText: " + response.statusText
    //             + " and data: " + JSON.stringify(response.data));
            
    //         // Return the response or promise.
    //         return response || $q.when(response);
    //       },
     
    //       // On response failture
    //       responseError: function (rejection) {
    //         $log.debug(JSON.stringify(rejection)); // Contains the data about the error.
    //         $log.debug("http response failure: " + JSON.stringify(rejection));
            
    //         // Return the promise rejection.
    //         return $q.reject(rejection);
    //       }
    //     };
    //   });
     
    //   // Add the interceptor to the $httpProvider.
    //   $httpProvider.interceptors.push('LoggingHttpInterceptor');
     
    // }]);
