(function () {
  'use strict';
  angular.module('clubActivityManagement').controller('ClubActivityDetailController', ClubActivityDetailController);

  ClubActivityDetailController.$inject = ['$scope', '$state', '$stateParams', 'i18nService', '$rootScope', '$cookies', 'ClubActivityService', 'ActivityUserService'];

  function ClubActivityDetailController($scope, $state, $stateParams, i18nService, $rootScope, $cookies, ClubActivityService, ActivityUserService) {
    var vm = this;
    i18nService.setCurrentLang("zh-cn");

    $scope.clubActivity = $stateParams.clubActivity;
    if (_.isEmpty($scope.clubActivity)) {
      $state.go('activityManagement');
    } else {
      vm.activityUserList = [];
      var activityUserColumnDefs = [];
      _.forEach($scope.clubActivity.signupField, function (signupF) {
        activityUserColumnDefs.push({
          field: signupF.fieldKey,
          enableFiltering: true,
          allowCellFocus: false,
          displayName: signupF.fieldName
        });
      });

      vm.activityUserGrid = {
        enableSorting: true,
        showGridFooter: false,
        showColumnFooter: false,
        enableColumnResizing: true,
        enableGridMenu: true,
        paginationPageSizes: [9, 50, 75],
        paginationPageSize: 9,
        enableFullRowSelection: true,
        exporterOlderExcelCompatibility: true,
        exporterMenuPdf: false,
        data: 'vm.activityUserList',
        multiSelect: true,
        modifierKeysToMultiSelect: true,
        columnDefs: activityUserColumnDefs,
        rowTemplate: "<div ng-dblclick=\"grid.appScope.showInfo(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
      };
      vm.activityUserGrid.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
      };

      getActivityUsers($scope.clubActivity._id);
    }

    function getActivityUsers(activityId) {
      ActivityUserService.getActivityUsers(activityId, function (err, datas) {
        if (err) {
          return;
        }
        vm.activityUserList = ActivityUserService.convertActivityUsers(datas);
      });
    }
  }

} ());