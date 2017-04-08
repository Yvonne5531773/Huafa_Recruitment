
angular.module('position').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('maintain/login');
        $stateProvider
            .state('position',{
                url: '/maintain/platform/position',
                templateUrl: 'client/maintain/position/views/position.html',
                controller: 'PositionController',
                controllerAs: 'vm'
            });
    }
]);