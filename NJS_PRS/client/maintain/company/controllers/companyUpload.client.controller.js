

(function () {
  'use strict';
  angular.module('company').controller('CompanyUploadController', CompanyUploadController);
  CompanyUploadController.$inject = ['$cookies', 'instance', '$scope', '$http', '$uibModal', '$uibModalInstance', 'toaster','UserService','CompanyService','Upload'];

function CompanyUploadController($cookies, instance, $scope, $http, $uibModal, $uibModalInstance, toaster, UserService, CompanyService, Upload){

    const TIP_UPDATE_FAILED = "更新失败，请重试";
    const TIP_NO_DATA_SELECT = "请至少选中一张";
    const TIP_DELETE_SUCCESS = "删除成功";
    const TIP_DELETE_FAILED = "删除失败";

    $scope.upfiles = [];
    $scope.manageAll = false;
    $scope.currentUser = JSON.parse($cookies.get('USER_INFO'))?JSON.parse($cookies.get('USER_INFO')):{};

    $scope.upfiles = _.cloneDeep(instance.applicantEntity).upfiles;
    $scope.companyInfo = _.cloneDeep(instance.applicantEntity).companyInfo;

    if($scope.upfiles && $scope.upfiles.length > 0){
        $scope.upfiles.forEach(function(upfile, i){
            upfile.fileThumbSrc = upfile.fileThumbSrc.indexOf('public/')>=0?upfile.fileThumbSrc.substr(upfile.fileThumbSrc.indexOf('/')+1):upfile.fileThumbSrc;
            upfile.fileSrc = upfile.fileSrc.indexOf('public/')>=0?upfile.fileSrc.substr(upfile.fileSrc.indexOf('/')+1):upfile.fileSrc
        })
    }

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
                CompanyService.getUpfiles({createUser: $scope.currentUser.userid}, function (err, upfiles) {
                    if (err) console.log(err);
                    else {
                        $scope.upfiles = upfiles;
                    }
                })
            }, function (res) {
                console.log('Error status: ' + res.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        }
    };

    $scope.replaceByClick = function(file){
        if(!$scope.manageAll) {
            $scope.companyInfo.icon = file.fileSrc;
            CompanyService.upsertCompanyInfo($scope.companyInfo, function (err, data) {
                if (err) {
                    toaster.pop('error', TIP_UPDATE_FAILED);
                } else {
                    $uibModalInstance.close('ok');
                    instance.loadData();
                }
            });
        }
    }

    $scope.switchSelect = function(file){
        if($scope.manageAll) {
            file.selected = !file.selected;
        }
    }

    $scope.cancelSelect = function(){
        if($scope.upfiles && $scope.upfiles.length > 0){
            $scope.upfiles.forEach(function(upfile, i){
                upfile.selected = false;
            })
        }
    }

    $scope.deleteFile = function(){
        var list = [];
        if($scope.upfiles && $scope.upfiles.length > 0){
            $scope.upfiles.forEach(function(upfile, i){
                if(upfile.selected) list.push(upfile);
            })
        }
        if(list.length === 0){
            toaster.pop('error', TIP_NO_DATA_SELECT);
        }else{
            $.confirm({
                title: '确定删除图片？',
                content: false,
                confirmButton:'确定',
                cancelButton:'取消',
                confirmButtonClass: 'btn-info',
                cancelButtonClass: 'btn-default',
                theme:'black',
                keyboardEnabled:true,
                confirm: function(){
                    var obj = {
                        upfiles: list
                    }
                    CompanyService.deleteUpfiles(obj, function(err, data){
                        if (err) {
                            toaster.pop('error', TIP_DELETE_FAILED);
                        } else {
                            toaster.pop('success', TIP_DELETE_SUCCESS);
                        }
                        CompanyService.getUpfiles({createUser: $scope.currentUser.userid}, function (err, upfiles) {
                            if (err) console.log(err);
                            else {
                                $scope.upfiles = upfiles;
                            }
                        })
                    })
                },
                cancel: function(){
                }
            });
        }
    }
}

}());