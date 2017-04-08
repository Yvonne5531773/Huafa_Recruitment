/**
 * Created by SUKE3 on 11/22/2016.
 */

angular.module('signupFieldManagement').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('maintain/login');
        $stateProvider
            .state('fieldManagement',{
                url: '/maintain/platform/fieldManagement',
                templateUrl: 'client/maintain/signupField/views/fieldManagement.html',
                controller: 'SignupFieldController',
                controllerAs: 'vm'
            });

    }
]);