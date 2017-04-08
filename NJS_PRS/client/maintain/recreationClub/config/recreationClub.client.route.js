// Setting up route
'use strict'

angular.module('recreationClubManagement').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('maintain/login');
        $stateProvider
            .state('rcManagement',{
                url: '/maintain/platform/rcManagement',
                templateUrl: 'client/maintain/recreationClub/views/recreationClubManagement.html',
                controller: 'RecreationClubController',
                controllerAs: 'vm'
            })
            .state('rcCreate',{
                url: '/maintain/platform/rcCreate',
                templateUrl: 'client/maintain/recreationClub/views/recreationClubOperate.html',
                controller: 'RecreationClubOperateController',
                controllerAs: 'vm'
            })
    }
]);