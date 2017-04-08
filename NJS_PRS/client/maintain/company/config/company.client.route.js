
angular.module('company').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('maintain/login');
        $stateProvider
            .state('companyIntroduction',{
                url: '/maintain/platform/company',
                templateUrl: 'client/maintain/company/views/companyIntroduction.html',
            })
            .state('companySegmentCreate', {
                url: '/maintain/platform/companySegment/type/:{type}',
                data: {'name' : '信息编辑'},
                templateUrl: 'client/maintain/company/views/companySegment.html'
            })
            .state('companySegmentEdit', {
                url: '/maintain/platform/companySegment/id/:{id}',
                data: {'name' : '信息编辑'},
                templateUrl: 'client/maintain/company/views/companySegment.html'
            })
    }
]);