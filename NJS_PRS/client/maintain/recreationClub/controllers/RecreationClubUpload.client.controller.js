

(function () {
  'use strict';
  angular.module('recreationClubManagement').controller('RecreationClubUploadController', RecreationClubUploadController);

    RecreationClubUploadController.$inject = ['$cookies', 'instance', '$scope', '$http', '$uibModal', '$uibModalInstance', 'toaster','UserService','RecreationClubService','Upload'];

function RecreationClubUploadController($cookies, instance, $scope, $http, $uibModal, $uibModalInstance, toaster, UserService, RecreationClubService, Upload){

    const TIP_UPDATE_FAILED = "更新失败，请重试";

    $scope.upfiles = [];
    $scope.currentUser = JSON.parse($cookies.get('USER_INFO'))?JSON.parse($cookies.get('USER_INFO')):{};

    $scope.upfiles = _.cloneDeep(instance.applicantEntity).upfiles;
    $scope.recreationClub = _.cloneDeep(instance.applicantEntity).recreationClub;

    if($scope.upfiles && $scope.upfiles.length > 0){
        $scope.upfiles.forEach(function(upfile, i){
            upfile.fileThumbSrc = upfile.fileThumbSrc.indexOf('public/')>=0?upfile.fileThumbSrc.substr(upfile.fileThumbSrc.indexOf('/')+1):upfile.fileThumbSrc;
            upfile.fileSrc = upfile.fileSrc.indexOf('public/')>=0?upfile.fileSrc.substr(upfile.fileSrc.indexOf('/')+1):upfile.fileSrc
        })
    }
    $scope.submit = function(isValid){
        if(isValid){
            //$scope.recreationclub.caption = {};
            $scope.recreationclub.status = NOT_PUBLISH;

            RecreationClubService.upsertRecreationClub($scope.recreationclub, function (err, data) {
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
    };

    $scope.upload = function (files) {
        if(files && files.length > 0) {
            Upload.upload({
                url: '/api/fileUpload',
                fields: {'userid': $scope.currentUser.userid},
                file: files
            }).then(function (res) {
                RecreationClubService.getUpfiles({createUser: $scope.currentUser.userid}, function (err, upfiles) {
                    if (err) console.log(err);
                    else {
                        $scope.upfiles = upfiles.upfiles;
                        //if ($scope.upfiles && $scope.upfiles.length > 0) {
                        //    $scope.upfiles.forEach(function (upfile, i) {
                        //        upfile.fileThumbSrc = upfile.fileThumbSrc.substr(upfile.fileThumbSrc.indexOf('/') + 1)
                        //    })
                        //}
                    }
                })
            }, function (res) {
                console.log('Error status: ' + res.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file[0].name);
            });
        }
    };

    $scope.replaceByClick = function(file){
        $scope.recreationClub.icon = file.fileSrc;
        RecreationClubService.upsertRecreationClub($scope.recreationClub, function (err, data) {
            if (err) {
                toaster.pop('error', TIP_UPDATE_FAILED);
            } else {
                $uibModalInstance.close('ok');
                instance.refreshForCreateOrUpdate(data);
            }
        });
    }
}

}());