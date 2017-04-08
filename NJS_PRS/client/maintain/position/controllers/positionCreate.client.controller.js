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

angular.module('position').controller('PositionCreate', ['instance','$scope', '$http', '$uibModal', '$uibModalInstance', 'toaster', 'PositionService','DictionaryService',
    function (instance, $scope, $http, $uibModal, $uibModalInstance, toaster, PositionService,DictionaryService) {
        positionEditInit(instance, $scope);
        var workAddrs = [];
        // PositionService.getWorkAddr({}, function(err, data){
        //     if(data && data.length > 0){
        //         data.forEach(function(addr){
        //             if(addr && addr.name.length > 0){
        //                 addr.name.forEach(function(name){
        //                     workAddrs.push(name);
        //                 });
        //             }
        //         })
        //     }
        //     $scope.workAddrs = Array.prototype.concat('', workAddrs);
        // });
        DictionaryService.getDictionarys({category:{'$in':['用人单位-本部','用人单位-幼稚园','用人单位-小学',
            '用人单位-中学','用人单位-高中','用人单位-培训学校',]}}, function(err, result){
            if(result.data) {
                $scope.workAddrs = Array.prototype.concat('', result.data.map(function (data) {
                    return data.value;
                }));
            }
        });
        const TIP_CREATE_SUCCESS = "创建成功";
        const TIP_CREATE_FAILED = "创建失败，请重试";

        $scope.selected = {};
        $scope.submit = function(isValid){
            if(isValid){
                updateOtherPositions($scope.position);
                instance.refreshForCreateOrUpdate(null);
                postionAssembler($scope.position);
                PositionService.upsertPosition($scope.position, function(err, data){
                    if(err) {
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
        function updateOtherPositions(position){
            PositionService.getPositions({}, function(err, results){
                    var positionList = results.data;
                    var isExist = false;
                    if (positionList !=null && positionList.length>0){
                        for(var i=0;i<positionList.length;i++){
                            var result = positionList[i];
                            if(result.order === position.order && result._id !== position._id){
                                isExist = true;
                                break;
                            }
                        }
                    }
                    if(isExist){
                        var arr = [];
                        arr.push(position.order);
                        for(var i=0;i<positionList.length;i++){
                            var result = positionList[i];
                            if(result._id !== position._id){
                                var needAddOne = false;
                                for(var j=0;j<arr.length;j++){
                                    if(result.order === arr[j]) {
                                        needAddOne = true;
                                        break;
                                    }
                                }
                                if(needAddOne){
                                    result.order = result.order + 1;
                                    PositionService.upsertPosition(result, function(err, data){

                                    });
                                }
                                arr.push(result.order);
                            }
                        }
                    }
                });
        }
    }
]);
