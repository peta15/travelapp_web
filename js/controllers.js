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
        $scope.title = "Hop a Path"
 

    }])

    .controller('PathCtrl', ['$scope', '$log', 'Post', 'User', 'globals', function ($scope, $log, Post, User, globals) {
        $scope.title = "Hop a Path > Aaron Path"


    }]);