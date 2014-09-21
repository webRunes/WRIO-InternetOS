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
                        templateUrl: '/vertical/views/index.html',
                        controller: 'ErrorCtrl',
                        scope: {}
                    },
                    'leftview@error': {
                        templateUrl: '/vertical/views/hub-lv.html'
                    },
                    'centerview@error': {
                        templateUrl: '/vertical/views/error/error-view.html'
                    },
                    'rightview@error': {
                        templateUrl: '/vertical/views/error/error-rv.html'
                    }
                },
                permission: 'All'
            })
            .state('app', {
                url: "/app/{app}",
                views: {
                    '@': {
                        templateUrl: '/vertical/views/index.html',
                        controller: 'AppCtrl',
                        scope: {}
                    },
                    'leftview@app': {
                        templateUrl: '/vertical/views/hub-lv.html'
                    },
                    'centerview@app': {
                        templateUrl: '/vertical/views/app/center-view.html'
                    },
                    'rightview@app': {
                        templateUrl: '/vertical/views/app/right-view.html'
                    }
                },
                permission: 'All'
            })
            .state('plus', {
                url: "/app/plus/{page}",
                views: {
                    '@': {
                        templateUrl: '/vertical/views/index.html',
                        controller: 'PlusCtrl',
                        scope: {}
                    },
                    'leftview@plus': {
                        templateUrl: '/vertical/views/hub-lv.html'
                    },
                    'centerview@plus': {
                        templateUrl: '/vertical/views/plus/center-view.html'
                    },
                    'rightview@plus': {
                        templateUrl: '/vertical/views/plus/right-view.html'
                    }
                },
                permission: 'All'
            })
            .state('wrio', {
                url: "/wrio",
                views: {
                    '@': {
                        templateUrl: '/vertical/views/index.html',
                        controller: 'WrioCtrl',
                        scope: {}
                    },
                    'leftview@wrio': {
                        templateUrl: '/vertical/views/hub-lv.html'
                    },
                    'centerview@wrio': {
                        templateUrl: '/vertical/views/app/WRIO/wrio-view.html'
                    },
                    'rightview@wrio': {
                        templateUrl: '/vertical/views/app/WRIO/wrio-rv.html'
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
                        templateUrl: '/vertical/views/index.html',
                        controller: 'HubFeedCtrl',
                        scope: {}
                    },
                    'leftview@hub.feed': {
                        templateUrl: '/vertical/views/hub-lv.html'
                    },
                    'centerview@hub.feed': {
                        templateUrl: '/vertical/views/hub/center-view.html'
                    },
                    'rightview@hub.feed': {
                        templateUrl: '/vertical/views/hub/right-view.html'
                    }
                },
                permission: 'All'
            })
            .state('hub.create', {
                url: "/create",
                views: {
                    '@': {
                        templateUrl: '/vertical/views/index.html',
                        controller: 'CreateCtrl',
                        scope: {}
                    },
                    'leftview@hub.create': {
                        templateUrl: '/vertical/views/hub-lv.html'
                    },
                    'centerview@hub.create': {
                        templateUrl: '/vertical/views/hub/compose/compose-view.html'
                    },
                    'rightview@hub.create': {
                        templateUrl: '/vertical/views/hub/compose/hub-compose-rv.html'
                    }
                },
                permission: 'All'
            })
            .state('hub.details', {
                url: "/details",
                views: {
                    '@': {
                        templateUrl: '/vertical/views/index.html',
                        controller: 'DetailsCtrl',
                        scope: {}
                    },
                    'leftview@hub.details': {
                        templateUrl: '/vertical/views/hub-lv.html'
                    },
                    'centerview@hub.details': {
                        templateUrl: '/vertical/views/hub/compose/details-view.html'
                    },
                    'rightview@hub.details': {
                        templateUrl: '/vertical/views/hub/compose/hub-compose-rv.html'
                    }
                },
                permission: 'All'
            })
            .state('hub.contact', {
                url: "/contact",
                views: {
                    '@': {
                        templateUrl: '/vertical/views/index.html',
                        controller: 'ContactCtrl',
                        scope: {}
                    },
                    'leftview@hub.contact': {
                        templateUrl: '/vertical/views/hub-lv.html'
                    },
                    'centerview@hub.contact': {
                        templateUrl: '/vertical/views/contact/contact-view.html'
                    },
                    'rightview@hub.contact': {
                        templateUrl: '/vertical/views/contact/hub-contact-rv.html'
                    }
                }
            })
            .state('post', {
                url: "/post/{post}",
                views: {
                    '@': {
                        templateUrl: '/vertical/views/index.html',
                        controller: 'PostCtrl',
                        scope: {}
                    },
                    'leftview@post': {
                        templateUrl: '/vertical/views/hub-lv.html'
                    },
                    'centerview@post': {
                        templateUrl: '/vertical/views/post/center-view.html'
                    },
                    'rightview@post': {
                        templateUrl: '/vertical/views/post/right-view.html'
                    }
                },
                permission: 'All'
            })
            .state('edit', {
                url: "/post/{post}/edit",
                views: {
                    '@': {
                        templateUrl: '/vertical/views/index.html',
                        controller: 'EditCtrl',
                        scope: {}
                    },
                    'leftview@edit': {
                        templateUrl: '/vertical/views/hub-lv.html'
                    },
                    'centerview@edit': {
                        templateUrl: '/vertical/views/post/compose/edit-view.html'
                    },
                    'rightview@edit': {
                        templateUrl: '/vertical/views/post/compose/post-compose-rv.html'
                    }
                },
                permission: 'All'
            })
            .state('comments', {
                url: "/post/{post}/comments",
                views: {
                    '@': {
                        templateUrl: '/vertical/views/index.html',
                        controller: 'CommentsCtrl',
                        scope: {}
                    },
                    'leftview@comments': {
                        templateUrl: '/vertical/views/hub-lv.html'
                    },
                    'centerview@comments': {
                        templateUrl: '/vertical/views/post/compose/comments-view.html'
                    },
                    'rightview@comments': {
                        templateUrl: '/vertical/views/post/compose/post-compose-rv.html'
                    }
                },
                permission: 'All'
            })
            .state('invite', {
                url: "/post/{post}/invite",
                views: {
                    '@': {
                        templateUrl: '/vertical/views/index.html',
                        controller: 'InviteCtrl',
                        scope: {}
                    },
                    'leftview@invite': {
                        templateUrl: '/vertical/views/hub-lv.html'
                    },
                    'centerview@invite': {
                        templateUrl: '/vertical/views/post/compose/invite-view.html'
                    },
                    'rightview@invite': {
                        templateUrl: '/vertical/views/post/compose/post-compose-rv.html'
                    }
                },
                permission: 'All'
            })
            .state('invitation', {
                url: "/post/{post}/invitation",
                views: {
                    '@': {
                        templateUrl: '/vertical/views/index.html',
                        controller: 'InvitationCtrl',
                        scope: {}
                    },
                    'leftview@invitation': {
                        templateUrl: '/vertical/views/hub-lv.html'
                    },
                    'centerview@invitation': {
                        templateUrl: '/vertical/views/post/compose/invitation-view.html'
                    },
                    'rightview@invitation': {
                        templateUrl: '/vertical/views/post/compose/post-compose-rv.html'
                    }
                },
                permission: 'All'
            })
            .state('share', {
                url: "/post/{post}/share",
                views: {
                    '@': {
                        templateUrl: '/vertical/views/index.html',
                        controller: 'ShareCtrl',
                        scope: {}
                    },
                    'leftview@share': {
                        templateUrl: '/vertical/views/hub-lv.html'
                    },
                    'centerview@share': {
                        templateUrl: '/vertical/views/post/compose/share-view.html'
                    },
                    'rightview@share': {
                        templateUrl: '/vertical/views/post/compose/post-compose-rv.html'
                    }
                },
                permission: 'All'
            })
            .state('login', {
                url: "/login",
                views: {
                    '@': {
                        templateUrl: '/vertical/views/index.html',
                        controller: 'LoginInCtrl',
                        scope: {}
                    },
                    'leftview@login': {
                        templateUrl: '/vertical/views/login_in/left-view.html'
                    },
                    'centerview@login': {
                        templateUrl: '/vertical/views/login_in/center-view.html'
                    },
                    'rightview@login': {
                        templateUrl: '/vertical/views/login_in/right-view.html'
                    }
                }
            });
//            .state('profileedit', {
//                url: "/profileedit",
//                views: {
//                    '@': {
//                        templateUrl: '/vertical/views/index.html',
//                        controller: 'ProfileCtrl',
//                        scope: {}
//                    },
//                    'leftview@profileedit': {
//                        templateUrl: '/vertical/views/profileedit/left-view.html'
//                    },
//                    'centerview@profileedit': {
//                        templateUrl: '/vertical/views/profileedit/center-view.html'
//                    },
//                    'rightview@profileedit': {
//                        templateUrl: '/vertical/views/profileedit/right-view.html'
//                    }
//                }
//                ,
//                permission: 'All'
//            })
//            .state('profiledelete', {
//                 url: "/profiledelete",
//                 views: {
//                     '@': {
//                         templateUrl: '/vertical/views/index.html',
//                         controller: 'ProfileCtrl',
//                         scope: {}
//                     },
//                     'leftview@profiledelete': {
//                         templateUrl: '/vertical/views/profiledelete/left-view.html'
//                     },
//                     'centerview@profiledelete': {
//                         templateUrl: '/vertical/views/profiledelete/center-view.html'
//                     },
//                     'rightview@profiledelete': {
//                         templateUrl: '/vertical/views/profiledelete/right-view.html'
//                     }
//                 },
//                permission: 'All'
//             })
//            .state('loginerror', {
//                url: "/login/{error}",
//                views: {
//                    '@': {
//                        templateUrl: '/vertical/views/index.html',
//                        controller: 'LoginCtrl',
//                        scope: {}
//                    },
//                    'leftview@loginerror': {
//                        templateUrl: '/vertical/views/login/left-view.html'
//                    },
//                    'centerview@loginerror': {
//                        templateUrl: '/vertical/views/login/center-view.html'
//                    },
//                    'rightview@loginerror': {
//                        templateUrl: '/vertical/views/login/right-view.html'
//                    }
//                }
//            })
//            .state('login', {
//                url: "/login",
//                views: {
//                    '@': {
//                        templateUrl: '/vertical/views/index.html',
//                        controller: 'LoginCtrl',
//                        scope: {}
//                    },
//                    'leftview@login': {
//                        templateUrl: '/vertical/views/login/left-view.html'
//                    },
//                    'centerview@login': {
//                        templateUrl: '/vertical/views/login/center-view.html'
//                    },
//                    'rightview@login': {
//                        templateUrl: '/vertical/views/login/right-view.html'
//                    }
//                }
//            })
//            .state('withdraw', {
//                url: "/webgold/withdraw",
//                views: {
//                    '@': {
//                        templateUrl: '/vertical/views/index.html',
//                        controller: 'WalletCtrl',
//                        scope: { }
//                    },
//                    'leftview@withdraw': {
//                        templateUrl: '/vertical/views/withdraw/left-view.html'
//                    },
//                    'centerview@withdraw': {
//                        templateUrl: '/vertical/views/withdraw/center-view.html'
//                    },
//                    'rightview@withdraw': {
//                        templateUrl: '/vertical/views/withdraw/right-view.html'
//                    }
//                },
//                permission: 'All'
//            })
//            .state('payPalResponse', {
//                    url: "/webgold/addfunds/{msgType}",
//                    views: {
//                        '@': {
//                            templateUrl: '/vertical/views/index.html',
//                            controller: 'WalletCtrl',
//                            scope: {}
//                        },
//                        'leftview@payPalResponse': {
//                            templateUrl: '/vertical/views/addfunds/left-view.html'
//                        },
//                        'centerview@payPalResponse': {
//                            templateUrl: '/vertical/views/addfunds/center-view.html'
//                        },
//                        'rightview@payPalResponse': {
//                            templateUrl: '/vertical/views/addfunds/right-view.html'
//                        }
//                    },
//                    permission: 'All'
//                })
//            .state('addfunds', {
//                 url: "/webgold/addfunds",
//                 views: {
//                     '@': {
//                         templateUrl: '/vertical/views/index.html',
//                         controller: 'WalletCtrl',
//                         scope: {}
//                     },
//                     'leftview@addfunds': {
//                         templateUrl: '/vertical/views/addfunds/left-view.html'
//                     },
//                     'centerview@addfunds': {
//                         templateUrl: '/vertical/views/addfunds/center-view.html'
//                     },
//                     'rightview@addfunds': {
//                         templateUrl: '/vertical/views/addfunds/right-view.html'
//                     }
//                 },
//                 permission: 'All'
//             })
//            .state('transactions', {
//            url: "/webgold/transactions",
//            views: {
//                '@': {
//                    templateUrl: '/vertical/views/index.html',
//                    controller: 'WalletCtrl',
//                    scope: {}
//                },
//                'leftview@transactions': {
//                    templateUrl: '/vertical/views/transactions/left-view.html'
//                },
//                'centerview@transactions': {
//                    templateUrl: '/vertical/views/transactions/center-view.html'
//                },
//                'rightview@transactions': {
//                    templateUrl: '/vertical/views/transactions/right-view.html'
//                }
//            },
//            permission: 'All'
//        });

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