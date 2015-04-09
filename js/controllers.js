angular.module('app.controllers', [])

    .controller('AppCtrl', ['$scope', 'User', '$rootScope', '$log', function ($scope, User, $rootScope, $log) {

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

        $scope.setBackgroundImage = function(){
            BACKGROUNDS = ["/img/guatemala.jpg", "/img/intro-bg.jpg"];
            // Duration is the amount of time in between slides,
            // and fade is value that determines how quickly the next image will fade in
            var bg = BACKGROUNDS[Math.floor(Math.random()*BACKGROUNDS.length)]; // choose a random background image
            $.backstretch(bg); // can rotate every few seconds - see http://srobbin.com/jquery-plugins/backstretch/
        };

    }])

    .controller('HomeCtrl', ['$scope', 'globals', 'User', function ($scope, globals, User) {
        //jQuery for page scrolling feature - requires jQuery Easing plugin - TODO maybe replace with ngScrollTo
        $('.page-scroll a').bind('click', function(event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top
            }, 1500, 'easeInOutExpo');
            event.preventDefault();
        });

        //jQuery to collapse the navbar on scroll
        $(window).scroll(function() {
            if ($(".navbar-home").offset().top > 50) {
                $(".navbar-fixed-top").addClass("top-nav-collapse");
            } else {
                $(".navbar-fixed-top").removeClass("top-nav-collapse");
            }
        });

        $.backstretch("/img/guatemala.jpg");

    }])

    .controller('PathCtrl', ['$scope', '$log', 'Post', 'User', 'globals', '$stateParams', 'uiGmapGoogleMapApi', 'uiGmapLogger', 'lodash', function ($scope, $log, Post, User, globals, $stateParams, uiGmapGoogleMapApi, uiGmapLogger, lodash) {
        $scope.setBackgroundImage();

        var i = 0;

        var check_null_location = function(post) {
            if (post.location != null) {
                return post;
            } else {
                return null;
            }
        }

        var compile_map_data = function(post) {
            var map_data = {
                id: i++, 
                latitude: post.location.latitude, 
                longitude: post.location.longitude
            };
            if (post.locationName != null) {
                map_data['options'] = {
                    labelContent: post.locationName,
                    labelAnchor: "22 0", 
                    labelClass: "marker-labels"
                };
            }
            return map_data;
        }

        var user = User.getById($stateParams.userId).then(function(user) {
            $scope.user = user;
            Post.listByUser(user).then(function(posts) {
                $scope.posts = posts;
                angular.extend(
                    $scope.map,
                    {
                        path: lodash.chain(posts).pluck('location').filter(function(location){ return location != null && location.latitude != 0.0 && location.longitude != 0.0 }).map(function(location) { return {latitude: location.latitude, longitude: location.longitude}; }).valueOf(),
                        markers: lodash.chain(posts).map(check_null_location).compact().map(compile_map_data).valueOf(),
                        show: lodash.any(posts, 'location')
                    }); 
            }, function(error) {
                // TODO handle posts error
                $log.error(error);
            });
        }, function(error) {
            // TODO handle user error
            $log.error(error);
        });

        // google maps logic

        uiGmapLogger.doLog = true;
        $scope.map = {
            center: { latitude: 0, longitude: 0 },
            zoom: 8,
            stroke: {
                color: '#FF0000',
                weight: 3,
                opacity: 1
            },
            path: [],
            markers: [],
            show: false
        };
        // uiGmapGoogleMapApi is a promise.
        // The "then" callback function provides the google.maps object.
        uiGmapGoogleMapApi.then(function(maps) {

        });

    }])

    .controller('SiteCtrl', ['$scope', 'globals', 'User', function ($scope, globals, User) {
        $scope.setBackgroundImage();
    }]);