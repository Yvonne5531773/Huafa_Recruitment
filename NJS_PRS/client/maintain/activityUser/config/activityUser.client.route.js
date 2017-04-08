// Setting up route
angular.module('ActivityUserManagement').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('maintain/login');
        $stateProvider
            .state('activityUserManagement',{
                url: '/maintain/platform/activityUserManagement',
                templateUrl: 'client/maintain/activityUser/views/activityUserManagement.html',
                controller: 'ActivityUserController',
                controllerAs: 'vm'
            })
    }
]);