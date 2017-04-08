
angular.module('dictionary').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('maintain/login');
        $stateProvider
            .state('dictionary',{
                url: '/maintain/platform/dictionary',
                templateUrl: 'client/maintain/dictionary/views/dictionary.html',
                controller: 'DictionaryController',
                controllerAs: 'vm'
            });
    }
]);