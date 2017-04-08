(function () {
    'use strict';
    angular.module('clubActivityManagement').controller('ClubActivityReviewController', ClubActivityReviewController);

    ClubActivityReviewController.$inject = ['$scope', '$state', 'uiGridConstants', '$uibModal', 'i18nService', 'instance', 'toaster', '$rootScope', '$cookies', 'ClubActivityService', 'RecreationClubService'];

    function ClubActivityReviewController($scope, $state, uiGridConstants, $uibModal, i18nService, instance, toaster, $rootScope, $cookies, ClubActivityService, RecreationClubService) {
        var vm = this;
        vm.collapsed = false;
        vm.clubActivityList = [];
        i18nService.setCurrentLang("zh-cn");

        vm.searchActivity = function () {
            ClubActivityService.findClubActivitys(vm.criteria, function (err, datas) {
                if (_.isEmpty(datas)) {
                    vm.clubActivityList = [];
                } else {
                    vm.clubActivityList = datas;
                }

            });
        };
        vm.searchActivity();

        vm.resetSearch = function () {
            vm.criteria.title = null;
            vm.criteria.clubName = null;
        };

        var reviewGridColumnDefs = [
            { field: 'title', enableFiltering: true, allowCellFocus: false, displayName: '活动名称' },
            { field: 'location', allowCellFocus: false, displayName: '活动地点' },
            { field: 'club.name', allowCellFocus: false, displayName: '俱乐部' },
            { field: 'club.captain.userid', allowCellFocus: false, displayName: '队长' },
            { field: 'regBeginDate', allowCellFocus: false, displayName: '报名开始时间', cellFilter: 'date:"yyyy-MM-dd HH:mm"' },
            { field: 'cutoffDate', allowCellFocus: false, displayName: '报名截止时间', cellFilter: 'date:"yyyy-MM-dd HH:mm"' },
            { field: 'startDateTime', allowCellFocus: false, displayName: '活动开始时间', cellFilter: 'date:"yyyy-MM-dd HH:mm"' },
            { field: 'endDateTime', allowCellFocus: false, displayName: '活动结束时间', cellFilter: 'date:"yyyy-MM-dd HH:mm"' },
            { field: 'status', allowCellFocus: false, displayName: '状态' }
        ];

        vm.activityReviewGrid = {
            enableSorting: true,
            showGridFooter: true,
            showColumnFooter: true,
            enableColumnResizing: true,
            enableGridMenu: true,
            paginationPageSizes: [9, 50, 75],
            paginationPageSize: 9,
            data: 'vm.clubActivityList',
            columnDefs: reviewGridColumnDefs,
            enableCellSelection: true,
            enableRowSelection: true,
            enableFullRowSelection: true,
            multiSelect: true,
            modifierKeysToMultiSelect: true,
            exporterOlderExcelCompatibility: true,
            exporterMenuPdf: false,
            rowTemplate: "<div ng-dblclick=\"grid.appScope.showInfo(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
        };

        vm.activityReviewGrid.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
        };

        $scope.reviewClubActivity = function () {
            if ($scope.gridApi.grid.selection.selectedCount != 1) {
                toaster.pop('error', '请只选中一行记录进行操作');
            } else {
                var clubActivity = $scope.gridApi.grid.selection.lastSelectedRow.entity;
                $state.go('clubActivityDetailReview', { 'clubActivity': clubActivity });
            }
        };

        $scope.publishClubActivitys = function(){
            if ($scope.gridApi.grid.selection.selectedCount == 0) {
                toaster.pop('error', '至少选中一行记录进行操作');
            } else {
                var clubActivitys = $scope.gridApi.selection.getSelectedRows();
                ClubActivityService.publishClubActivitys(clubActivitys, function(err, data){
                    if(err){
                        toaster.pop('error', '审核失败');
                    }else{
                        if(!_.isEmpty(_.result(data, 'errorMsg'))){
                            toaster.pop('error', data.errorMsg);
                        }else{
                            toaster.pop('success', '审核成功');
                            vm.searchActivity();
                        }
                        return;
                    }
                });
            }
        };

        $scope.stopPublishClubActivitys = function(){
            if ($scope.gridApi.grid.selection.selectedCount == 0) {
                toaster.pop('error', '至少选中一行记录进行操作');
            } else {
                var clubActivitys = $scope.gridApi.selection.getSelectedRows();
                ClubActivityService.stopPublishClubActivitys(clubActivitys, function(err, data){
                    if(err){
                        toaster.pop('error', '撤销失败');
                    }else{
                        if(!_.isEmpty(_.result(data, 'errorMsg'))){
                            toaster.pop('error', data.errorMsg);
                        }else{
                            toaster.pop('success', '撤销成功');
                            vm.searchActivity();
                        }
                        return;
                    }
                });
            }
        };

    }
} ());