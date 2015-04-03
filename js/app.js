angular.module('app', ['ui.router', 'uiGmapgoogle-maps', 'ngLodash', 'app.controllers', 'app.services', 'app.directives'])

    .run(['$rootScope', '$window', 'User', '$log', function ($rootScope, $window, User, $log) {

        Parse.initialize('dj2Rcjb9bvAmYWJvKLlDpj1WasLwn5mcum3yktCP','viset42LCn1piYJEFblISpZLmi2egYJZvy0AskEi');
        User.enableRevocableSession();
        $rootScope.User = User;

        window.fbAsyncInit = function() {
            Parse.FacebookUtils.init({ // this line replaces FB.init({
              appId      : '1494625380826955', // Facebook App ID
              status     : true,  // check Facebook Login status
              cookie     : true,  // enable cookies to allow Parse to access the session
              xfbml      : true,  // initialize Facebook social plugins on the page
              version    : 'v2.2' // point to the latest Facebook Graph API version
            });

            // update current user with FB data if logged in
            User.enrichCurrentUser();
        };
        // retrieve Facebook sdk
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
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
                if ($match.idType == "post") {
                    return /path/ + $match.id;
                } else {
                    return "/user/" + $match.userId;
                }
            }])
            .when('/support', ['$match', '$stateParams', function ($match, $stateParams) {
                return "/faq";
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
                templateUrl: "templates/user.html",
                controller: "UserCtrl"
            })
            .state('app.path', {
                url: "/path/:pathId",
                templateUrl: "templates/path.html",
                controller: "PathCtrl"
            })
            .state('app.privacy', {
                url: "/privacy",
                templateUrl: "templates/privacy.html",
                controller: "SiteCtrl"
            })
            .state('app.faq', {
                url: "/faq",
                templateUrl: "templates/faq.html",
                controller: "SiteCtrl"
            })            
            .state('app.terms', {
                url: "/terms",
                templateUrl: "templates/terms.html",
                controller: "SiteCtrl"
            });
    }])
    .config(['uiGmapGoogleMapApiProvider', function (uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyC00uu2O8qAoSN9yeN6Yb9qdpf3qiq8XNY',
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
