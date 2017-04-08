(function () {
  'use strict';
  angular.module('recreationClubManagement').controller('RecreationClubCreate', RecreationClubCreate);

  RecreationClubCreate.$inject = ['instance', '$scope', '$http', '$uibModal', '$uibModalInstance', 'toaster','UserService','RecreationClubService'];

function RecreationClubCreate(instance, $scope, $http, $uibModal, $uibModalInstance, toaster, UserService, RecreationClubService){

    const TIP_CREATE_SUCCESS = "创建成功";
    const TIP_CREATE_FAILED = "创建失败，请重试";
    const PUBLISHED = "已发布";
    const NOT_PUBLISH = "待发布";

    RCTemplateInit(instance, $scope);

    UserService.findUsers({'role' : 'captain'}, function(err, users){
        if(!_.isEmpty(users)){
            _.remove(users, function(user) {
                return _.indexOf(_.result(instance, 'captainList'), user._id) > -1;;
            });
            $scope.users = users;
        }else{
            $scope.users = [];
        }
    });

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

}

function RCTemplateInit(instance, $scope) {

    $scope.allH5Introduces = [
        {name: '2011 ZHA Basketball', link: 'http://h5-slide.cloud.dachuanqi.cn/view/v-rkjtoigxbxvl5wmi'},
        {name: '2012 ZHA Basketball', link: 'http://h5-slide.cloud.dachuanqi.cn/view/v-rkjtoigxbxvl5wmi'},
        {name: '2013 ZHA Basketball', link: 'http://h5-slide.cloud.dachuanqi.cn/view/v-rkjtoigxbxvl5wmi'},
        {name: '2014 ZHA Basketball', link: 'http://h5-slide.cloud.dachuanqi.cn/view/v-rkjtoigxbxvl5wmi'},
        {name: '2015 ZHA Basketball', link: 'http://h5-slide.cloud.dachuanqi.cn/view/v-rkjtoigxbxvl5wmi'},
        {name: '2016 ZHA Basketball', link: 'http://h5-slide.cloud.dachuanqi.cn/view/v-rkjtoigxbxvl5wmi'},
    ];

    // $scope.allUsers = UserService.findUsers

    $scope._simpleConfig = {
        //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
        toolbars: [
            [
                'source', '|', 'undo', 'redo', '|',
                'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|',
                'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                'indent', '|',
                'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify','|', 
                'imagenone', 'imageleft', 'imageright', 'imagecenter','simpleupload', 'insertimage','snapscreen', 'wordimage'
            ]
        ],
        //focus时自动清空初始化时的内容
        autoClearinitialContent: true,
        //关闭字数统计
        wordCount: false,
        //关闭elementPath
        elementPathEnabled: false,
        autoHeightEnabled: false,
        scaleEnabled: false,
        zIndex : 1300
    };
}

}());