/**
 * Created by SUKE3 on 11/22/2016.
 */
(function () {
    'use strict';
    angular.module('ActivityUserManagement').controller('ActivityUserController', ActivityUserController);
    ActivityUserController.$inject = ['instance', '$scope', '$uibModal', 'toaster','i18nService', 'ActivityUserService'];
    function ActivityUserController(instance,$scope, $uibModal, toaster,i18nService, ActivityUserService) {
        var vm = this;
        vm.collapsed = false;
        vm.fieldList = [];
        i18nService.setCurrentLang("zh-cn");

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
    }
}());