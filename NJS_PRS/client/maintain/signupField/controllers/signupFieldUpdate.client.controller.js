/**
 * Created by SUKE3 on 11/25/2016.
 */
(function () {
    'use strict';
    angular.module('signupFieldManagement').controller('SignupFieldUpdate', SignupFieldUpdate);
    SignupFieldUpdate.$inject = ['instance', '$scope', 'toaster', 'SignupFieldService','$uibModalInstance'];
    function SignupFieldUpdate(instance, $scope, toaster, SignupFieldService,$uibModalInstance) {

        const TIP_CREATE_SUCCESS = "更新成功";
        const TIP_CREATE_FAILED = "更新失败，请重试";

        $scope.signupField = _.cloneDeep(instance.applicantEntity);

        $scope.submit = function (isValid) {
            if (isValid) {
                SignupFieldService.upsertSignupField($scope.signupField, function (err, data) {
                    if (err) {
                        toaster.pop('error', TIP_CREATE_FAILED);
                    } else {
                        $uibModalInstance.close('ok');
                        toaster.pop('success', TIP_CREATE_SUCCESS);
                        instance.refreshForCreateOrUpdate(null);
                    }
                });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.close('cancel');
            instance.refreshForCreateOrUpdate(null);
        };
    }
}());