// Setting up route
angular.module('clubActivityManagement').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('maintain/login');
        $stateProvider
            .state('activityManagement',{
                url: '/maintain/platform/activityManagement',
                templateUrl: 'client/maintain/clubActivity/views/clubActivityManagement.html',
                controller: 'ClubActivityController',
                controllerAs: 'vm'
            })
            .state('clubActivityDetail',{
                url: '/maintain/platform/clubActivityDetail',
                templateUrl: 'client/maintain/clubActivity/views/clubActivityDetail.html',
                params : {'clubActivity': null},
                controller: 'ClubActivityDetailController',
                controllerAs: 'vm'
            })
    }
]);