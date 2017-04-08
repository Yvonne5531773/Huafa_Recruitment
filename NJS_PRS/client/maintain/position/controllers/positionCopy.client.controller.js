/**
 * Created by lica4 on 11/16/2016.
 */
'use strict';

function positionEditInit(instance, $scope) {
    $scope.allPositionTypes = instance.allPositionTypes;
    $scope.allWelfareTypes = instance.allWelfareTypes;
    $scope.allCertificateTypes = ['','不限','大专','本科','硕士','博士'];
    $scope.allExperiences = ['','不限','应届毕业生','1年以下','1-3年','3-5年','5-10年','10年以上'];
    $scope._simpleConfig = {
        //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
        toolbars: [
            ['source', '|', 'undo', 'redo', '|',
                'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc',
                '|',
                'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                'indent', '|',
                'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify'
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

function postionAssembler(position) {
    position.updated = new Date();

    var welfares = [];
    if (position.welfare) {
        position.welfare.forEach(function (w) {
            welfares.push(w.value);
        });
    }
    position.welfare = welfares;
    return position;
}


angular.module('position').controller('PositionCopy', ['instance', '$scope', '$http', '$uibModal', '$uibModalInstance',
    'toaster', 'PositionService', 'DictionaryService',
    function (instance, $scope, $http, $uibModal, $uibModalInstance, toaster, PositionService,DictionaryService) {
        positionEditInit(instance, $scope);
        DictionaryService.getDictionarys({category:{'$in':['用人单位-本部','用人单位-幼稚园','用人单位-小学',
            '用人单位-中学','用人单位-高中','用人单位-培训学校',]}}, function(err, result){
            if(result.data) {
                $scope.workAddrs = Array.prototype.concat('', result.data.map(function (data) {
                    return data.value;
                }));
            }
        });
        const TIP_COPY_SUCCESS = "复制成功";
        const TIP_COPY_FAILED = "复制失败，请重试";

        $scope.position = _.cloneDeep(instance.applicantEntity);
        $scope.submit = function(isValid){
            if(isValid){
                postionAssembler($scope.position);
                $scope.position._id = null;
                $scope.position.status = 'INACTIVE';
                $scope.position.applyCount = 0;
                $scope.position.browseCount = 0;
                PositionService.upsertPosition($scope.position, function(err, data){
                    if(err){
                        toaster.pop('error', TIP_COPY_FAILED);
                    } else {
                        $uibModalInstance.close('ok');
                        toaster.pop('success', TIP_COPY_SUCCESS);
                        instance.refreshForCreateOrUpdate(null);
                    }
                });
            }
        }
        $scope.cancel = function () {
            $uibModalInstance.close('cancel');
        };
    }
]);
