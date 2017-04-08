/**
 * Created by SUKE3 on 11/28/2016.
 */
angular.module('templateManagement').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('maintain/login');
        $stateProvider
            .state('templateManagement',{
                url: '/maintain/platform/templateManagement',
                templateUrl: 'client/maintain/h5Template/views/recreationClubTM.html',
                controller: 'RecreationClubTMController',
                controllerAs: 'vm'
            });
    }
]);