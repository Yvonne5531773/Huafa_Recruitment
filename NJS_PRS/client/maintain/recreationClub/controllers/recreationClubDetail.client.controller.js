(function () {
    'use strict';
    angular.module('recreationClubManagement').controller('RecreationClubDetailController', RecreationClubDetailController);

    RecreationClubDetailController.$inject = ['$scope', '$state', '$stateParams', 'i18nService', '$rootScope', '$cookies', 'RecreationClubService'];

    function RecreationClubDetailController($scope, $state, $stateParams, i18nService, $rootScope, $cookies, RecreationClubService) {
        var vm = this;
        i18nService.setCurrentLang("zh-cn");
        const TIP_PUBLISH_FAILED = "发布失败，请重试";

        $scope.recreationClub = $stateParams.recreationClub;
        if (_.isEmpty($scope.recreationClub)) {
            $state.go('rcManagement');
            return;
        }

        $scope.publishRecreationClub = function(){
            $scope.recreationClub.status = '已发布';
            RecreationClubService.upsertRecreationClub($scope.recreationClub, function(err, data){
                if(err){
                    toaster.pop('error', TIP_PUBLISH_FAILED);
                }else{
                    $state.go('rcManagement');
                    return;
                }
            });
        };

        $scope.stopPublishRecreationClub = function(){
            $scope.recreationClub.status = '待发布';
            RecreationClubService.upsertRecreationClub($scope.recreationClub, function(err, data){
                if(err){
                    toaster.pop('error', TIP_PUBLISH_FAILED);
                }else{
                    $state.go('rcManagement');
                    return;
                }
            });
        };
    }

} ());