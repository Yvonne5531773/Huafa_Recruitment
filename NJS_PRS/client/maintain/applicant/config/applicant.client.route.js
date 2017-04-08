

angular.module('applicant').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('maintain/login');
        $stateProvider
            .state('applicant',{
                url: '/maintain/platform/applicant',
                templateUrl: 'client/maintain/applicant/views/applicant.html',
                controller: 'ApplicantController',
                controllerAs: 'vm'
            })
            .state('acceptedApplicant',{
            url: '/maintain/platform/acceptedApplicant',
            templateUrl: 'client/maintain/applicant/views/acceptedApplicant.html',
            controller: 'AcceptedApplicantController',
            controllerAs: 'vm'
            });
    }
]);