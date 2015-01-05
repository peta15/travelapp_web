angular.module('app.controllers', [])

    .controller('AppCtrl', ['$scope', function ($scope) {

        $scope.timeSince = function(date) {
            if (typeof date !== 'object') {
                date = new Date(date);
            }

            var seconds = Math.floor((new Date() - date) / 1000);
            var intervalType;

            var interval = Math.floor(seconds / 31536000);
            if (interval >= 1) {
                intervalType = 'year';
            } else {
                interval = Math.floor(seconds / 2592000);
                if (interval >= 1) {
                    intervalType = 'month';
                } else {
                    interval = Math.floor(seconds / 86400);
                    if (interval >= 1) {
                        intervalType = 'day';
                    } else {
                        interval = Math.floor(seconds / 3600);
                        if (interval >= 1) {
                            intervalType = "hour";
                        } else {
                            interval = Math.floor(seconds / 60);
                            if (interval >= 1) {
                                intervalType = "minute";
                            } else {
                                intervalType = "second";
                            }
                        }
                    }
                }
            }

            if (interval > 1) {
                intervalType += 's';
            }

            if (intervalType == "second") {
                return 'just now'
            }

            return interval + ' ' + intervalType + ' ago';
        };

    }])

    .controller('HomeCtrl', ['$scope', 'globals', function ($scope, globals) {
 

    }])

    .controller('PathCtrl', ['$scope', '$log', 'Post', 'User', 'globals', '$stateParams', 'uiGmapGoogleMapApi', 'uiGmapLogger', function ($scope, $log, Post, User, globals, $stateParams, uiGmapGoogleMapApi, uiGmapLogger) {
        var user = User.getById($stateParams.userId).then(function(user) {
            $scope.user = user;
            Post.listByUser(user).then(function(posts) {
                $scope.posts = posts;
            }, function(error) {
                // TODO handle posts error
            });
        }, function(error) {
            // TODO handle user error
        });

        // google maps logic

        uiGmapLogger.doLog = true;
        $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
        // Do stuff with your $scope.
        // Note: Some of the directives require at least something to be defined originally!
        // e.g. $scope.markers = []

        // uiGmapGoogleMapApi is a promise.
        // The "then" callback function provides the google.maps object.
        uiGmapGoogleMapApi.then(function(maps) {

        });

    }]);