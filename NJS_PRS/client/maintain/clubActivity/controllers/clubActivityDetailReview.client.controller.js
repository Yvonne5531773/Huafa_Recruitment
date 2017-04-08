(function () {
    'use strict';
    angular.module('clubActivityManagement').controller('ClubActivityDetailReviewController', ClubActivityDetailReviewController);

    ClubActivityDetailReviewController.$inject = ['$scope', '$state', '$stateParams', 'i18nService', '$rootScope', '$cookies', 'ClubActivityService', 'ActivityUserService'];

    function ClubActivityDetailReviewController($scope, $state, $stateParams, i18nService, $rootScope, $cookies, ClubActivityService, ActivityUserService) {
        var vm = this;
        i18nService.setCurrentLang("zh-cn");
        const TIP_PUBLISH_FAILED = "发布失败，请重试";

        $scope.clubActivity = $stateParams.clubActivity;
        if (_.isEmpty($scope.clubActivity)) {
            $state.go('clubActivityReview');
            return;
        } 

        $scope.changeClubActivityStatus = function(status){
            $scope.clubActivity.status = status;
            ClubActivityService.upsertClubActivity($scope.clubActivity, function(err, data){
                if(err){
                    toaster.pop('error', TIP_PUBLISH_FAILED);
                }else{
                    $state.go('clubActivityReview');
                    return;
                }
            });
        };

    }

} ());