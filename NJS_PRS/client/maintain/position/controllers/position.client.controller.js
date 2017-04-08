/**
 * Created by lica4 on 11/16/2016.
 */
'use strict';

angular.module('position').controller('PositionController', PositionController);

    PositionController.$inject = ['$scope', '$http', 'uiGridConstants','$uibModal', 'i18nService', 'instance',
        'toaster', '$rootScope', '$cookies', 'PositionService', 'DictionaryService'];

    function PositionController($scope, $http, uiGridConstants,$uibModal, i18nService, instance, toaster,
                                $rootScope, $cookies, PositionService, DictionaryService){
        var vm = $scope.vm = {};
        vm = this;
        vm.collapsed = false;
        i18nService.setCurrentLang("zh-cn");

        const TIP_NO_DATA_SELECT = "请至少选中一行";
        const TIP_ONLY_ONE_ROW_SELECT = "请只选中一行记录进行操作";
        const TIP_PUBLISH_SUCCESS = "发布成功";
        const TIP_PUBLISH_FAILED = "发布失败，请重试";
        const TIP_STOP_PUBLISH_SUCCESS = "停止发布成功";
        const TIP_ACTIVE_SELECT = "无法删除发布中的职位";
        const TIP_DELETE_SUCCESS = "删除成功";
        const TIP_DELETE_FAILED = "删除失败";
        const TIP_STOP_PUBLISH_FAILED = "停止发布失败，请重试";
        const TIP_UPDATE_SUCCESS = "更新成功";
        const TIP_UPDATE_FAILED = "更新失败，请重试";
        const PUBLISHED = "已发布";
        const NOT_PUBLISH = "待发布";

        $scope.getPositionForSelectShow = function(){
            PositionService.getPositions(vm.criteria, function(err, data){
                $scope.selectForShow = data.data;
            });
        };
        $scope.getPositionForSelectShow();

        $scope.myAppScopeProvider = {
            showInfo : function(row) {
                instance.applicantEntity = $scope.gridApi.grid.selection.lastSelectedRow.entity;
                $uibModal.open({
                    templateUrl: 'client/maintain/position/views/positionTemplate.html',
                    controller: 'PositionUpdate',
                    size: 'lg',
                    backdrop: 'static'
                });
            }
        };

        $scope.myDataGrid = {
            enableSorting: true,
            showGridFooter: true,
            showColumnFooter: true,
            enableColumnResizing: true,
            enableGridMenu: true,
            paginationPageSizes: [9, 50, 75],
            paginationPageSize: 9,
            //enableRowHeaderSelection: true,
            //enableRowSelection: true,
            enableFullRowSelection: true,
            exporterOlderExcelCompatibility: true,
            exporterMenuPdf: false,
            appScopeProvider: $scope.myAppScopeProvider,
            rowTemplate: "<div ng-dblclick=\"grid.appScope.showInfo(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
        };

        var positionIntroductionGridColumnDefs = [
            // {field: 'order', enableFiltering: true, type:'number',allowCellFocus:false, displayName:'序号'},
            {field: 'name', enableFiltering: true, allowCellFocus:false, displayName:'职位名称'},
            {field: 'jobType', enableFiltering: true, allowCellFocus:false, displayName:'职位类型'},
            {field: 'workAddr', allowCellFocus:false, displayName:'工作单位'},
            {field: 'salaryLow',allowCellFocus:false, displayName:'最低月薪', visible:false},
            {field: 'salaryHigh',allowCellFocus:false, displayName:'最高月薪', visible:false},
            {field: 'certificate', allowCellFocus:false, displayName:'第一学历'},
            {field: 'experience', allowCellFocus:false, displayName:'工作经验', visible:false},
            {field: 'welfareForShow',displayName:'福利', allowCellFocus:false, visible:false},
            {field: 'browseCount', allowCellFocus:false,displayName: '浏览次数'},
            {field: 'applyCount', allowCellFocus:false,displayName: '投递人数'},
            {field: 'nature', enableFiltering: true, allowCellFocus:false, displayName:'工作性质'},
            {field: 'successMessage', allowCellFocus:false,displayName: '回复信息',visible:false},
            {field: 'status', enableFiltering: true, allowCellFocus:false, displayName:'状态'},
            {field: 'updateTime', allowCellFocus:false,displayName: '更新时间'}
        ];

        $scope.myDataGrid.multiSelect = true;
        $scope.myDataGrid.modifierKeysToMultiSelect = true;
        //$scope.myDataGrid.noUnselect = true;

        $scope.myDataGrid.columnDefs = positionIntroductionGridColumnDefs;

        $scope.myDataGrid.onRegisterApi = function( gridApi ) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.EDIT );
        };

        function convertGMTtoDate(dateTimeString){
            if(!dateTimeString) {
                return null;
            }
            var year = dateTimeString.substring(0, 4);
            var month = dateTimeString.substring(5, 7);
            var day = dateTimeString.substring(8, 10);
            var hour = dateTimeString.substring(11, 13);
            var minute = dateTimeString.substring(14, 16);
            var second = dateTimeString.substring(17, 19);
            var millisecond = dateTimeString.substring(20, 22);

            return new Date(Date.UTC(year, month, day, hour, minute, second, millisecond));
        }

        $scope.getData = function(){
            PositionService.getPositions(vm.criteria, function(err, res){
                if(res.data){
                    res.data.forEach(function (position) {
                        var welfaresObjs = [];
                        position.welfare.forEach(function (w, i) {
                            var welfaresObj = {value : w}
                            welfaresObjs.push(welfaresObj);
                        });
                        position.welfareForShow = position.welfare.join(',');
                        position.welfare = welfaresObjs;

                        var updateDate = convertGMTtoDate(position.updated);
                        var month = updateDate.getMonth() < 10 ? '0' + updateDate.getMonth() : updateDate.getMonth();
                        var day = updateDate.getDate() < 10 ? '0' + updateDate.getDate() : updateDate.getDate();
                        var hour = updateDate.getHours() < 10 ? '0' + updateDate.getHours() : updateDate.getHours();
                        var minute = updateDate.getMinutes() < 10 ? '0' + updateDate.getMinutes() : updateDate.getMinutes();
                        var second = updateDate.getSeconds() < 10 ? '0' + updateDate.getSeconds() : updateDate.getSeconds();
                        position.updateTime = updateDate.getFullYear() + '-'
                            + month + '-' + day + ' ' + hour + ':' + minute
                            + ':' + second;
                        position.status = (position.status == "ACTIVE") ? PUBLISHED : NOT_PUBLISH;
                    });
                    $scope.myDataGrid.data = res.data;
                }else{
                    $scope.myDataGrid.data = [];
                }
            });

            DictionaryService.getDictionarys({category: '职位管理-职位类型'}, function(err, result){
                if(result.data) {
                    instance.allPositionTypes = result.data.map(function (data) {
                        return data.value;
                    });
                    $scope.allPositionTypes = instance.allPositionTypes;
                }
            });
            DictionaryService.getDictionarys({category: '职位管理-职位福利'}, function(err, result){
                if(result.data) {
                    instance.allWelfareTypes = result.data.map(function (data) {
                        return {value: data.value};
                    });
                }
            });
        };

        $scope.getData();

        $scope.batchUpdateTypes = [
            {field : 'successMessage', display : '回复信息'}
        ];
        $scope.batchUpdate = function () {
            if($scope.gridApi.grid.selection.selectedCount == 0){
                toaster.pop('error', TIP_NO_DATA_SELECT);
                return;
            }
            if(!$scope.batchUpdateType || !$scope.batchUpdateValue){
                toaster.pop('error', '请填写要批量更新的字段和内容');
                return;
            }
            $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
                row[$scope.batchUpdateType] = $scope.batchUpdateValue;
                row.updated = new Date()
                postionAssembler(row);
                PositionService.upsertPosition(row, function(err, data){
                    instance.refreshForCreateOrUpdate(null);
                });
            });
            toaster.pop('success', TIP_UPDATE_SUCCESS);
        };

        $scope.createPosition = function(){
            $uibModal.open({
                templateUrl: 'client/maintain/position/views/positionTemplate.html',
                controller: 'PositionCreate',
                size: 'lg',
                backdrop: 'static'
            });
        };

        $scope.updatePosition = function(){
            if($scope.gridApi.grid.selection.selectedCount != 1){
                toaster.pop('error', TIP_ONLY_ONE_ROW_SELECT);
            }else{
                //console.log($scope.gridApi.grid.selection.lastSelectedRow.entity);
                instance.applicantEntity = $scope.gridApi.grid.selection.lastSelectedRow.entity;
                $uibModal.open({
                    templateUrl: 'client/maintain/position/views/positionTemplate.html',
                    controller: 'PositionUpdate',
                    size: 'lg',
                    backdrop: 'static'
                });
            }
        };

        $scope.copyPosition = function(){
            if($scope.gridApi.grid.selection.selectedCount != 1){
                toaster.pop('error', TIP_ONLY_ONE_ROW_SELECT);
            }else{
                // var row = $scope.gridApi.grid.selection.lastSelectedRow.entity;
                // console.log(row);
                // $http.post('/api/v1/position', row).success(function (data){
                //     // $uibModalInstance.close('ok');
                //     // toaster.pop('success', 'Create success');
                //     instance.refreshForCreateOrUpdate(null);
                // }).error(function(){
                //     console.log('2');
                //     toaster.pop('error', 'Create fail,try again');
                // });
                instance.applicantEntity = $scope.gridApi.grid.selection.lastSelectedRow.entity;
                $uibModal.open({
                    templateUrl: 'client/maintain/position/views/positionTemplate.html',
                    controller: 'PositionCopy',
                    size: 'lg',
                    backdrop: 'static'
                });
            }
        };

        instance.refreshForCreateOrUpdate = function(position){
            if(position != null){
                $scope.myDataGrid.data.push(position);
                //$scope.gridApi.core.notifyDataChange("all");
                //$scope.gridApi.core.refreshRows();
                //$scope.gridApi.core.queueRefresh();
                //$scope.gridApi.core.refresh(true);
            }else{
                $scope.getData();
            }
            $scope.getData();
        };

        $scope.publishJob = function(){
            if($scope.gridApi.grid.selection.selectedCount == 0){
                toaster.pop('error', TIP_NO_DATA_SELECT);
            }else {
                $.confirm({
                    title: '确定发布所有选中的职位？',
                    content: false,
                    confirmButton:'确定',
                    cancelButton:'取消',
                    confirmButtonClass: 'btn-info',
                    cancelButtonClass: 'btn-default',
                    theme:'black',
                    keyboardEnabled:true,
                    confirm: function(){
                        var rows = $scope.gridApi.selection.getSelectedRows()
                        //console.log(rows);
                        PositionService.publishJob(rows, function(err, data){
                            if(err){
                                toaster.pop('error', TIP_PUBLISH_FAILED);
                                instance.refreshForCreateOrUpdate(null);
                            }else{
                                toaster.pop('success', TIP_PUBLISH_SUCCESS);
                                instance.refreshForCreateOrUpdate(null);
                            }
                        });
                        $scope.gridApi.selection.clearSelectedRows();
                    },
                    cancel: function(){
                    }
                });
            }
        };

        $scope.stopPublish = function(){
            if($scope.gridApi.grid.selection.selectedCount == 0){
                toaster.pop('error', TIP_NO_DATA_SELECT);
            }else {
                $.confirm({
                    title: '确定停止发布所有选中的职位？',
                    content: false,
                    confirmButton:'确定',
                    cancelButton:'取消',
                    confirmButtonClass: 'btn-info',
                    cancelButtonClass: 'btn-default',
                    theme:'black',
                    keyboardEnabled:true,
                    confirm: function(){
                        var rows = $scope.gridApi.selection.getSelectedRows()
                        //console.log(rows);
                        $http.put('/api/position/stopPublishJob', rows).success(function(data){
                            toaster.pop('success', TIP_STOP_PUBLISH_SUCCESS);
                            instance.refreshForCreateOrUpdate(null);
                        }).error(function(){
                            toaster.pop('error', TIP_STOP_PUBLISH_FAILED);
                            instance.refreshForCreateOrUpdate(null);
                        });
                        $scope.gridApi.selection.clearSelectedRows();
                    },
                    cancel: function(){
                    }
                });
            }
        };

        $scope.preview = function (){
            if($scope.gridApi.grid.selection.selectedCount != 1){
                toaster.pop('error', TIP_ONLY_ONE_ROW_SELECT);
            }else {
                var row = $scope.gridApi.grid.selection.lastSelectedRow.entity;
                var previewPage = "/position/detail/" + row._id;
                var modalScope = $rootScope.$new();
                modalScope.page = previewPage;
                var modalInstance = $uibModal.open({
                    templateUrl: '/client/maintain/position/views/positionPreview.html',
                    size: 'md',
                    //backdrop: 'static',
                    scope:modalScope
                });
            }
        };

        $scope.deletePosition = function(){
            if($scope.gridApi.grid.selection.selectedCount != 1){
                toaster.pop('error', TIP_ONLY_ONE_ROW_SELECT);
            }
            else {
                if($scope.gridApi.grid.selection.lastSelectedRow.entity.status == PUBLISHED){
                    toaster.pop('warning',TIP_ACTIVE_SELECT)
                }
                else{
                    $.confirm({
                        title: '确定删除所有选中的职位？',
                        content: false,
                        confirmButton:'确定',
                        cancelButton:'取消',
                        confirmButtonClass: 'btn-info',
                        cancelButtonClass: 'btn-default',
                        theme:'black',
                        keyboardEnabled:true,
                        confirm: function(){
                            var row = $scope.gridApi.grid.selection.lastSelectedRow.entity;
                                //console.log(rows);
                            PositionService.deletePosition(row._id, function (err, data) {
                                if (err) {
                                    toaster.pop('error', TIP_DELETE_FAILED);
                                    instance.refreshForCreateOrUpdate(null);
                                } else {
                                    toaster.pop('success', TIP_DELETE_SUCCESS);
                                    instance.refreshForCreateOrUpdate(null);
                                }
                            });
                            $scope.gridApi.selection.clearSelectedRows();
                        },
                        cancel: function(){
                        }
                    });
                }
            }
        };

        $scope.searchPosition = function (){
            var criteria = {};
            var fromDate = $scope.fromDate;
            var toDate = $scope.toDate;
            // toDate: hour+23, min+59, sec+59
            if(_.isDate(toDate)) {
                toDate.setHours(23);
                toDate.setMinutes(59);
                toDate.setSeconds(59);
            }
            if(!_.isEmpty($scope.positionName)){
                criteria.name = $scope.positionName;
            }
            if(!_.isEmpty($scope.positionJobType)){
                criteria.jobType = {$regex: $scope.positionJobType,$options:"$i"};
            }
            if(_.isDate(fromDate) && _.isDate(toDate)){
                criteria.updated = {$gte: fromDate, $lte: toDate};
            }
            if(!_.isDate(fromDate) && _.isDate(toDate)){
                criteria.updated = {$lte: toDate};
            }
            if(_.isDate(fromDate) && !_.isDate(toDate)){
                criteria.updated = {$gte: fromDate};
            }
            PositionService.getPositions(criteria, function(err, res){
                if(res){
                    if(!_.isEmpty(res.data)) {
                        res.data.forEach(function (position) {
                            var welfaresObjs = [];
                            position.welfare.forEach(function (w, i) {
                                var welfaresObj = {value: w};
                                welfaresObjs.push(welfaresObj);
                            });
                            position.welfareForShow = position.welfare.join(',');
                            position.welfare = welfaresObjs;
                            var updateDate = convertGMTtoDate(position.updated);
                            var month = updateDate.getMonth() < 10 ? '0' + updateDate.getMonth() : updateDate.getMonth();
                            var day = updateDate.getDate() < 10 ? '0' + updateDate.getDate() : updateDate.getDate();
                            var hour = updateDate.getHours() < 10 ? '0' + updateDate.getHours() : updateDate.getHours();
                            var minute = updateDate.getMinutes() < 10 ? '0' + updateDate.getMinutes() : updateDate.getMinutes();
                            var second = updateDate.getSeconds() < 10 ? '0' + updateDate.getSeconds() : updateDate.getSeconds();
                            position.updateTime = updateDate.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
                            position.status = (position.status == "ACTIVE") ? PUBLISHED : NOT_PUBLISH;
                        });
                        $scope.myDataGrid.data = res.data;
                    }else{
                        $scope.myDataGrid.data = [];
                    }
                }else{
                    console.log('rep failed');
                }
            });
        };

        $scope.cancelPosition = function() {
            $scope.positionName = null;
            $scope.positionJobType = null;
            $scope.fromDate = null;
            $scope.toDate = null;
        };

        // ui.bootstrap.datepickerPopup
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        $scope.toggleMin = function() {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }
            return '';
        }
    }

function postionAssembler(position) {
    position.updated = Date.now();

    var welfares = [];
    if (position.welfare) {
        position.welfare.forEach(function (w) {
            welfares.push(w.value);
        });
    }
    position.welfare = welfares;
    return position;
}
