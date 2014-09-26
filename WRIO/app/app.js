'use strict';

var aps = angular.module('aps', ['ui.router', 'ngSanitize'])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        $urlRouterProvider.when('/app', '/app/plus');
       // $urlRouterProvider.when('/hub', 'hub.feed');
       // $urlRouterProvider.otherwise("/login");
        $urlRouterProvider.otherwise("/app/plus");

        $stateProvider
            .state('error', {
                url: "/error",
                views: {
                    '@': {
                        templateUrl: '/app/views/index.html',
                        controller: 'ErrorCtrl',
                        scope: {}
                    },
                    'leftview@error': {
                        templateUrl: '/app/views/hub-lv.html'
                    },
                    'centerview@error': {
                        templateUrl: '/app/views/error/error-view.html'
                    },
                    'rightview@error': {
                        templateUrl: '/app/views/error/error-rv.html'
                    }
                },
                permission: 'All'
            })
            .state('app', {
                url: "/app/{app}",
                views: {
                    '@': {
                        templateUrl: '/app/views/index.html',
                        controller: 'AppCtrl',
                        scope: {}
                    },
                    'leftview@app': {
                        templateUrl: '/app/views/hub-lv.html'
                    },
                    'centerview@app': {
                        templateUrl: '/app/views/app/center-view.html'
                    },
                    'rightview@app': {
                        templateUrl: '/app/views/app/right-view.html'
                    }
                },
                permission: 'All'
            })
            .state('plus', {
                url: "/app/plus/{page}",
                views: {
                    '@': {
                        templateUrl: '/app/views/index.html',
                        controller: 'PlusCtrl',
                        scope: {}
                    },
                    'leftview@plus': {
                        templateUrl: '/app/views/hub-lv.html'
                    },
                    'centerview@plus': {
                        templateUrl: '/app/views/plus/center-view.html'
                    },
                    'rightview@plus': {
                        templateUrl: '/app/views/plus/right-view.html'
                    }
                },
                permission: 'All'
            })
            .state('wrio', {
                url: "/wrio",
                views: {
                    '@': {
                        templateUrl: '/app/views/index.html',
                        controller: 'WrioCtrl',
                        scope: {}
                    },
                    'leftview@wrio': {
                        templateUrl: '/app/views/hub-lv.html'
                    },
                    'centerview@wrio': {
                        templateUrl: '/app/views/app/WRIO/wrio-view.html'
                    },
                    'rightview@wrio': {
                        templateUrl: '/app/views/app/WRIO/wrio-rv.html'
                    }
                },
                permission: 'All'
            })
            .state('hub', {
                url: "/hub/{hubTag}",
                abstract: true,
                template: '<ui-view/>',
                permission: 'All'
            })
            .state('hub.feed', {
                url: "/feed/{numPage}",
                views: {
                    '@': {
                        templateUrl: '/app/views/index.html',
                        controller: 'HubFeedCtrl',
                        scope: {}
                    },
                    'leftview@hub.feed': {
                        templateUrl: '/app/views/hub-lv.html'
                    },
                    'centerview@hub.feed': {
                        templateUrl: '/app/views/hub/center-view.html'
                    },
                    'rightview@hub.feed': {
                        templateUrl: '/app/views/hub/right-view.html'
                    }
                },
                permission: 'All'
            })
            .state('hub.create', {
                url: "/create",
                views: {
                    '@': {
                        templateUrl: '/app/views/index.html',
                        controller: 'CreateCtrl',
                        scope: {}
                    },
                    'leftview@hub.create': {
                        templateUrl: '/app/views/hub-lv.html'
                    },
                    'centerview@hub.create': {
                        templateUrl: '/app/views/hub/compose/compose-view.html'
                    },
                    'rightview@hub.create': {
                        templateUrl: '/app/views/hub/compose/hub-compose-rv.html'
                    }
                },
                permission: 'All'
            })
            .state('hub.details', {
                url: "/details",
                views: {
                    '@': {
                        templateUrl: '/app/views/index.html',
                        controller: 'DetailsCtrl',
                        scope: {}
                    },
                    'leftview@hub.details': {
                        templateUrl: '/app/views/hub-lv.html'
                    },
                    'centerview@hub.details': {
                        templateUrl: '/app/views/hub/compose/details-view.html'
                    },
                    'rightview@hub.details': {
                        templateUrl: '/app/views/hub/compose/hub-compose-rv.html'
                    }
                },
                permission: 'All'
            })
            .state('hub.contact', {
                url: "/contact",
                views: {
                    '@': {
                        templateUrl: '/app/views/index.html',
                        controller: 'ContactCtrl',
                        scope: {}
                    },
                    'leftview@hub.contact': {
                        templateUrl: '/app/views/hub-lv.html'
                    },
                    'centerview@hub.contact': {
                        templateUrl: '/app/views/contact/contact-view.html'
                    },
                    'rightview@hub.contact': {
                        templateUrl: '/app/views/contact/hub-contact-rv.html'
                    }
                }
            })
            .state('post', {
                url: "/post/{post}",
                views: {
                    '@': {
                        templateUrl: '/app/views/index.html',
                        controller: 'PostCtrl',
                        scope: {}
                    },
                    'leftview@post': {
                        templateUrl: '/app/views/hub-lv.html'
                    },
                    'centerview@post': {
                        templateUrl: '/app/views/post/center-view.html'
                    },
                    'rightview@post': {
                        templateUrl: '/app/views/post/right-view.html'
                    }
                },
                permission: 'All'
            })
            .state('edit', {
                url: "/post/{post}/edit",
                views: {
                    '@': {
                        templateUrl: '/app/views/index.html',
                        controller: 'EditCtrl',
                        scope: {}
                    },
                    'leftview@edit': {
                        templateUrl: '/app/views/hub-lv.html'
                    },
                    'centerview@edit': {
                        templateUrl: '/app/views/post/compose/edit-view.html'
                    },
                    'rightview@edit': {
                        templateUrl: '/app/views/post/compose/post-compose-rv.html'
                    }
                },
                permission: 'All'
            })
            .state('comments', {
                url: "/post/{post}/comments",
                views: {
                    '@': {
                        templateUrl: '/app/views/index.html',
                        controller: 'CommentsCtrl',
                        scope: {}
                    },
                    'leftview@comments': {
                        templateUrl: '/app/views/hub-lv.html'
                    },
                    'centerview@comments': {
                        templateUrl: '/app/views/post/compose/comments-view.html'
                    },
                    'rightview@comments': {
                        templateUrl: '/app/views/post/compose/post-compose-rv.html'
                    }
                },
                permission: 'All'
            })
            .state('invite', {
                url: "/post/{post}/invite",
                views: {
                    '@': {
                        templateUrl: '/app/views/index.html',
                        controller: 'InviteCtrl',
                        scope: {}
                    },
                    'leftview@invite': {
                        templateUrl: '/app/views/hub-lv.html'
                    },
                    'centerview@invite': {
                        templateUrl: '/app/views/post/compose/invite-view.html'
                    },
                    'rightview@invite': {
                        templateUrl: '/app/views/post/compose/post-compose-rv.html'
                    }
                },
                permission: 'All'
            })
            .state('invitation', {
                url: "/post/{post}/invitation",
                views: {
                    '@': {
                        templateUrl: '/app/views/index.html',
                        controller: 'InvitationCtrl',
                        scope: {}
                    },
                    'leftview@invitation': {
                        templateUrl: '/app/views/hub-lv.html'
                    },
                    'centerview@invitation': {
                        templateUrl: '/app/views/post/compose/invitation-view.html'
                    },
                    'rightview@invitation': {
                        templateUrl: '/app/views/post/compose/post-compose-rv.html'
                    }
                },
                permission: 'All'
            })
            .state('share', {
                url: "/post/{post}/share",
                views: {
                    '@': {
                        templateUrl: '/app/views/index.html',
                        controller: 'ShareCtrl',
                        scope: {}
                    },
                    'leftview@share': {
                        templateUrl: '/app/views/hub-lv.html'
                    },
                    'centerview@share': {
                        templateUrl: '/app/views/post/compose/share-view.html'
                    },
                    'rightview@share': {
                        templateUrl: '/app/views/post/compose/post-compose-rv.html'
                    }
                },
                permission: 'All'
            })
            .state('login', {
                url: "/login",
                views: {
                    '@': {
                        templateUrl: '/app/views/index.html',
                        controller: 'LoginInCtrl',
                        scope: {}
                    },
                    'leftview@login': {
                        templateUrl: '/app/views/login_in/left-view.html'
                    },
                    'centerview@login': {
                        templateUrl: '/app/views/login_in/center-view.html'
                    },
                    'rightview@login': {
                        templateUrl: '/app/views/login_in/right-view.html'
                    }
                }
            });

        $httpProvider.interceptors.push('requestInterceptor');
        $locationProvider.html5Mode(true);
    })
    .factory('requestInterceptor', ['$location', '$q', function($location, $q) {
        return {
            'request': function(config) {
                return config || $q.when(config);
            },
            'response': function(response) {
                if (response.status === 403 || response.status === 401) {
                    $location.path('/login');
                    return $q.reject(response);
                }
                return response || $q.when(response);
            }
        };
    }])
    .controller('ApsCtrl', ['$scope','$state','profileSrv','LoginInService','userAppSrv',
        function($scope,$state,profileSrv,LoginInService,userAppSrv) {
        $('#id-loading-page').hide().remove();

        $scope.$on('$stateChangeStart', function (scope, next, current) {
            var permission = next.permission;

            if (permission && profileSrv.checkUser()==null) {
                window.location.assign('/login');
            }
        });
        $scope.signout = function () {
            LoginInService.signout(function (isSignout) {
                if (isSignout) {
                    $state.go('login');
                }
            });
        };
        $scope.contact=function(){
            userAppSrv.getApps(function(apps){
                userAppSrv.setCurrApp('webRunes');
                userAppSrv.setCurrTab('');
                var ind=userAppSrv.getAppByTag(apps,'webrunes');
                if(ind+1){
                    userAppSrv.setHubState('webrunes','hub.contact',null);

                }else{
                    userAppSrv.addTempAppTab('webRunes');
                }
                $state.go('hub.contact',{hubTag: 'webrunes'});
            });


        };


    }]);