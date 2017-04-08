'use strict';

angular.module('backendMaintain').run(['$rootScope', '$cookies', '$location', '$log', '$window', '$http', '$state','lodash', function ($rootScope, $cookies, $location, $log, $window, $http, $state, lodash) {
    var locationChangeStartOff = $rootScope.$on('$stateChangeStart', locationChangeStart);


    function locationChangeStart(event, toState,   toParams
        , fromState, fromParams) {
        //event.preventDefault();
        var userInfo = JSON.parse(lodash.isEmpty($cookies.get('USER_INFO'))? null : $cookies.get('USER_INFO'));
        var userDomainId = lodash.result(userInfo, 'userid');
        if (userDomainId === undefined){
            if ($location.path().indexOf('login') < 0){
                $window.location.href='/maintain/login';
            }
        }else{
            if(toState.name==='login'){
                $window.location.href = '/maintain/platform/home';
            }else if(toState.name==='logout'){
                $cookies.remove('USER_INFO');
                var user= {
                    username: userDomainId
                }
                $http.post('/api/user/logout', user);
            }
        }
    }

}]);
// Setting up route
angular.module('backendMaintain').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('maintain/login');
        $stateProvider
            .state('login', {
                url: '/maintain/login',
                templateUrl: 'client/maintain/user/views/login/login.client.view.html'
            })
            .state('logout', {
                url: '/maintain/login',
                templateUrl: 'client/maintain/user/views/login/login.client.view.html'
            })
            .state('home', {
                url: '/maintain/platform/home',
                templateUrl: 'client/maintain/user/views/home.client.view.html'
            })
            .state('userManagement',{
              url: '/maintain/platform/userManagement',
              templateUrl: 'client/maintain/user/views/user/userManagement.html'
            })

    }
]);


