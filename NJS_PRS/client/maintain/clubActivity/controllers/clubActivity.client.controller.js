(function () {
    'use strict';
    angular.module('clubActivityManagement').controller('ClubActivityController', ClubActivityController);

    ClubActivityController.$inject = ['$scope', '$state', 'uiGridConstants', '$uibModal', 'i18nService', 'instance', 'toaster', '$rootScope', '$cookies', 'ClubActivityService', 'RecreationClubService'];

    function ClubActivityController($scope, $state, uiGridConstants, $uibModal, i18nService, instance, toaster, $rootScope, $cookies, ClubActivityService, RecreationClubService) {
        var vm = this;
        vm.currentUser = JSON.parse($cookies.get('USER_INFO'));
        vm.criteria = {
            club : _.result(vm.currentUser, 'club._id')
        }
        vm.collapsed = false;
        vm.clubActivityList = [];
        i18nService.setCurrentLang("zh-cn");

        const TIP_ONLY_ONE_ROW_SELECT = "请只选中一行记录进行操作";
        const TIP_NO_DATA_SELECT = "请至少选中一行";
        const TIP_DELETE_SUCCESS = "删除成功";
        const TIP_DELETE_FAILED = "删除失败";
        const TIP_PUBLISH_SUCCESS = "发布成功";
        const TIP_PUBLISH_FAILED = "发布失败，请重试";
        const TIP_STOP_PUBLISH_SUCCESS = "停止发布成功";
        const TIP_STOP_PUBLISH_FAILED = "停止发布失败，请重试";
        const TIP_ACTIVE_SELECT = "无法删除发布中的俱乐部";
        const PUBLISHED = "已发布";
        const NOT_PUBLISH = "待发布";

        var rcGridColumnDefs = [
            {field: 'title', enableFiltering: true, allowCellFocus: false, displayName: '活动名称'},
            {field: 'club.name', allowCellFocus: false, displayName: '俱乐部名称'},
            {field: 'description', allowCellFocus: false, displayName: '描述'},
            {field: 'location', allowCellFocus: false, displayName: '活动地点'}
        ];
        vm.rcGrid = {
            enableSorting: true,
            showGridFooter: true,
            showColumnFooter: true,
            enableColumnResizing: true,
            enableGridMenu: true,
            paginationPageSizes: [9, 50, 75],
            paginationPageSize: 9,
            enableFullRowSelection: true,
            exporterOlderExcelCompatibility: true,
            exporterMenuPdf: false,
            data: 'vm.clubActivityList',
            multiSelect: true,
            modifierKeysToMultiSelect: true,
            columnDefs: rcGridColumnDefs,
            rowTemplate: "<div ng-dblclick=\"grid.appScope.showInfo(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
        };
        vm.rcGrid.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
        };
        // Authority Controll
        // $scope.isAdminLogin = true;

        vm.searchClub = function () {
            ClubActivityService.findClubActivitys(vm.criteria, function (err, datas) {
                if (_.isEmpty(datas)) {
                    vm.clubActivityList = [];
                } else {
                    vm.clubActivityList = datas;
                }

            });
        };
        vm.searchClub();

        vm.resetSearch = function() {
            vm.criteria.location = null;
            vm.criteria.name = null;
            vm.searchClub();
        }

        $scope.loadRcData = function () {
            ClubActivityService.findClubActivitys({}, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    if (data === null) {
                        data = [];
                    }

                    vm.rcGrid.data = data;
                }
            });
        };

        //$scope.loadRcData();

        instance.refreshForCreateOrUpdate = function (clubActivity) {
            vm.searchClub();
        };

        $scope.viewClubActivity = function (clubActivity) {
            $state.go('clubActivityDetail', {'clubActivity': clubActivity});
        }

        $scope.addClubActivity = function () {
            $uibModal.open({
                templateUrl: 'client/maintain/clubActivity/views/clubActivityTemplate.html',
                controller: 'ClubActivityCreate',
                size: 'lg',
                backdrop: 'static'
            });
        }

        $scope.updateClubActivity = function (clubActivity) {
            instance.applicantEntity = clubActivity;
            $uibModal.open({
                templateUrl: 'client/maintain/clubActivity/views/clubActivityTemplate.html',
                controller: 'ClubActivityUpdate',
                size: 'lg',
                backdrop: 'static'
            });
        }

        $scope.deleteClubActivity = function (activity) {
            $.confirm({
                title: '确定删除所有选中的俱乐部？',
                content: false,
                confirmButton: '确定',
                cancelButton: '取消',
                confirmButtonClass: 'btn-info',
                cancelButtonClass: 'btn-default',
                theme: 'black',
                keyboardEnabled: true,
                confirm: function () {
                    var row = activity;
                    ClubActivityService.deleteClubActivity(row._id, function (err, data) {
                        if (err) {
                            toaster.pop('error', TIP_DELETE_FAILED);
                            instance.refreshForCreateOrUpdate(null);
                        } else {
                            toaster.pop('success', TIP_DELETE_SUCCESS);
                            instance.refreshForCreateOrUpdate(null);
                        }
                    })
                },
                cancel: function () {
                }
            });
        }

        $scope.publishClubActivity = function () {
            if ($scope.gridApi.grid.selection.selectedCount == 0) {
                toaster.pop('error', TIP_NO_DATA_SELECT);
            } else {
                $.confirm({
                    title: '确定发布所有选中的俱乐部？',
                    content: false,
                    confirmButton: '确定',
                    cancelButton: '取消',
                    confirmButtonClass: 'btn-info',
                    cancelButtonClass: 'btn-default',
                    theme: 'black',
                    keyboardEnabled: true,
                    confirm: function () {
                        $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
                            row.status = PUBLISHED;
                            ClubActivityService.upsertClubActivity(row, function (err, data) {
                                if (err) {
                                    toaster.pop('error', TIP_STOP_PUBLISH_FAILED);
                                    instance.refreshForCreateOrUpdate(null);
                                } else {
                                    toaster.pop('success', TIP_STOP_PUBLISH_SUCCESS);
                                    instance.refreshForCreateOrUpdate(null);
                                }
                            })
                        });

                        $scope.gridApi.selection.clearSelectedRows();
                    },
                    cancel: function () {
                    }
                });
            }
        }

        $scope.stopPublishClubActivity = function () {
            if ($scope.gridApi.grid.selection.selectedCount == 0) {
                toaster.pop('error', TIP_NO_DATA_SELECT);
            } else {
                $.confirm({
                    title: '确定停止发布所有选中的俱乐部？',
                    content: false,
                    confirmButton: '确定',
                    cancelButton: '取消',
                    confirmButtonClass: 'btn-info',
                    cancelButtonClass: 'btn-default',
                    theme: 'black',
                    keyboardEnabled: true,
                    confirm: function () {
                        $scope.gridApi.selection.getSelectedRows().forEach(function (row) {
                            row.status = NOT_PUBLISH;
                            ClubActivityService.upsertClubActivity(row, function (err, data) {
                                if (err) {
                                    toaster.pop('error', TIP_STOP_PUBLISH_FAILED);
                                    instance.refreshForCreateOrUpdate(null);
                                } else {
                                    toaster.pop('success', TIP_STOP_PUBLISH_SUCCESS);
                                    instance.refreshForCreateOrUpdate(null);
                                }
                            })
                        });

                        $scope.gridApi.selection.clearSelectedRows();
                    },
                    cancel: function () {
                    }
                });
            }
        }
    }

}());