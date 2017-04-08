/**
 * Created by SUKE3 on 11/22/2016.
 */
(function () {
    'use strict';
    angular.module('signupFieldManagement').controller('SignupFieldController', SignupFieldController);
    SignupFieldController.$inject = ['instance', '$scope', '$uibModal', 'toaster','i18nService', 'SignupFieldService'];
    function SignupFieldController(instance,$scope, $uibModal, toaster,i18nService, SignupFieldService) {
        var vm = this;
        vm.collapsed = false;
        vm.fieldList = [];
        i18nService.setCurrentLang("zh-cn");

        const TIP_ONLY_ONE_ROW_SELECT = "请只选中一行记录进行操作";
        //const TIP_NO_DATA_SELECT = "请至少选中一行";
        const TIP_DELETE_SUCCESS = "删除成功";
        const TIP_DELETE_FAILED = "删除失败";

        var fieldColumnDefs = [
            {field: 'fieldKey', allowCellFocus: false, displayName: '字段Key'},
            {field: 'fieldName', allowCellFocus: false, displayName: '字段名'}
        ];

        vm.fieldList = {
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
            data: [],
            multiSelect: true,
            modifierKeysToMultiSelect: true,
            columnDefs: fieldColumnDefs
            //rowTemplate: "<div ng-dblclick=\"grid.appScope.showInfo(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.fieldKey\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
        };

        vm.fieldList.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
        };
        $scope.loadFieldData = function () {
            SignupFieldService.findSignupFields({}, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    if (data === null) {
                        data = [];
                    }
                    vm.fieldList.data = data;
                }
            });
        };

        $scope.loadFieldData();


        instance.refreshForCreateOrUpdate = function (position) {
            if (position != null) {
                vm.fieldList.data.push(position);
            } else {
                $scope.loadFieldData();
            }
        };

        $scope.addSignupField = function () {
            $uibModal.open({
                templateUrl: 'client/maintain/signupField/views/signupFieldMaintain.html',
                controller: 'SignupFieldCreate',
                size: 'lg',
                backdrop: 'static'
            });
        }

        $scope.updateSignupField = function () {
            if ($scope.gridApi.grid.selection.selectedCount != 1) {
                toaster.pop('error', TIP_ONLY_ONE_ROW_SELECT);
            } else {
                instance.applicantEntity = $scope.gridApi.grid.selection.lastSelectedRow.entity;
                $uibModal.open({
                    templateUrl: 'client/maintain/signupField/views/signupFieldMaintain.html',
                    controller: 'SignupFieldUpdate',
                    size: 'lg',
                    backdrop: 'static'
                });
            }
        }

        $scope.deleteSignupField = function () {
            if ($scope.gridApi.grid.selection.selectedCount != 1) {
                toaster.pop('error', TIP_ONLY_ONE_ROW_SELECT);
            } else {
                $.confirm({
                    title: '确定删除所有选中的字段？',
                    content: false,
                    confirmButton: '确定',
                    cancelButton: '取消',
                    confirmButtonClass: 'btn-info',
                    cancelButtonClass: 'btn-default',
                    theme: 'black',
                    keyboardEnabled: true,
                    confirm: function () {
                        var row = $scope.gridApi.grid.selection.lastSelectedRow.entity;
                        SignupFieldService.deleteSignupField(row._id, function (err, data) {
                            if (err) {
                                toaster.pop('error', TIP_DELETE_FAILED);
                                instance.refreshForCreateOrUpdate();
                            } else {
                                toaster.pop('success', TIP_DELETE_SUCCESS);
                                instance.refreshForCreateOrUpdate();
                            }
                        })
                        $scope.gridApi.selection.clearSelectedRows();
                    },
                    cancel: function () {
                    }
                });
            }
        }

    }
}());