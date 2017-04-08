/**
 * Created by SUKE3 on 11/25/2016.
 */

(function () {
    'use strict';
    angular.module('signupFieldManagement').controller('SignupFieldCreate', SignupFieldCreate);
    SignupFieldCreate.$inject = ['instance', '$scope', 'toaster', 'SignupFieldService','$uibModalInstance'];
    function SignupFieldCreate(instance, $scope, toaster, SignupFieldService,$uibModalInstance) {

        const TIP_CREATE_SUCCESS = "创建成功";
        const TIP_CREATE_FAILED = "创建失败，请重试";
        
        $scope.submit = function (isValid) {
            if (isValid) {
                SignupFieldService.upsertSignupField($scope.signupField, function (err, data) {
                    if (err) {
                        toaster.pop('error', TIP_CREATE_FAILED);
                    } else {
                        $uibModalInstance.close('ok');
                        toaster.pop('success', TIP_CREATE_SUCCESS);
                        instance.refreshForCreateOrUpdate();
                    }
                });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.close('cancel');
            instance.refreshForCreateOrUpdate();
        };
    }
}());