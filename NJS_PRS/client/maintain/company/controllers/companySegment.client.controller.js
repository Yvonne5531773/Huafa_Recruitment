/**
 * Created by ZOUDA on 6/21/2016.
 */

angular.module('company').controller('CompanySegment', ['$scope', '$http', 'toaster', 'instance', '$state', '$window', '$stateParams','maskerService','CompanyService','DictionaryService',
    function ($scope, $http, toaster, instance, $state, $window, $stateParams,maskerService,CompanyService,DictionaryService) {

    if ($stateParams.id) {
        if (!instance.entity) {
            CompanyService.getCompanys({'type': $stateParams.id}, function(err, companyIntroductions){
                if(!err){
                    $scope.entity = companyIntroductions.data;
                    $scope.ids = instance.ids;
                }else{
                    toaster.pop('error', 'Fail to get data from server.');
                }
            });
        }else {
            $scope.entity = instance.entity;
            $scope.companyInfo = instance.companyInfo;
            $scope.ids = instance.ids;
        }
    } else if ($stateParams.type) {
        $scope.companyInfo = instance.companyInfo;
        $scope.ids = instance.ids;
        $scope.entity = instance.entity ? instance.entity : {};
        $scope.entity.type = $stateParams.type;
    }
    $scope.pageTitle = $state.current.data.name;
    $scope.editorConfig = {
        toolbars: [[
            'fullscreen', 'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
            'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
            'directionalityltr', 'directionalityrtl', 'indent', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
            'link', 'unlink', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
            'simpleupload', 'insertimage', 'emotion', 'scrawl', 'attachment', 'map', 'pagebreak', 'template', 'background', 'horizontal',
            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
            'help', 'drafts'
        ]],
        initialFrameHeight: 480
    };

    $scope.back = function () {
        //$state.go('companyIntroduction');
        $window.history.back();
    };
    $scope.showInput = function () {
        alert($scope.content);
    };
    $scope.submit = function (valid) {
        if (!valid) return;
        maskerService.showMasker();
        if (_.indexOf(instance.sequences, $scope.entity.sequence) > -1) {
            $scope.alertMsg = "Duplicate sequence number";
            toaster.pop('error', 'Duplicate sequence number');
            return
        }
        CompanyService.upsertCompany({company:$scope.entity,companyInfo:$scope.companyInfo}, function(err, data){
            if(err){
                maskerService.clearMasker();
                toaster.pop('error', 'Create fail,try again');
            }else{
                maskerService.clearMasker();
                $scope.back();
            }
        });
    };
    $scope.closeAlert = function (index) {
        $scope.alertMsg = null;
    };

    DictionaryService.getDictionarys({category: '用人单位-规模'}, function(err, result){
        if(result.data) {
            $scope.allScaleTypes = result.data.map(function (data) {
                return data.value;
            });
        }
    });
}]);
