(function () {
  'use strict';
  angular.module('recreationClubManagement').controller('RecreationClubController', RecreationClubController);

  RecreationClubController.$inject = ['$scope', 'uiGridConstants', '$uibModal', 'i18nService', 'instance', 'toaster', '$rootScope', '$cookies', 'RecreationClubService', 'UserService', 'RecreationClubTMService'];

  function RecreationClubController( $scope, uiGridConstants, $uibModal, i18nService, instance, toaster, $rootScope, $cookies, RecreationClubService, UserService, RecreationClubTMService) {
    var vm = this;
    vm.collapsed = false;
    vm.clubList = [];
    i18nService.setCurrentLang("zh-cn");

    const TIP_ONLY_ONE_ROW_SELECT = "请只选中一行记录进行操作";
    const TIP_NO_DATA_SELECT = "请至少选中一行";
    const TIP_DELETE_SUCCESS = "删除成功";
    const TIP_DELETE_FAILED = "删除失败";
    const TIP_PUBLISH_SUCCESS = "发布成功";
    const TIP_PUBLISH_FAILED = "发布失败，请重试";
    const TIP_CANCEL_PUBLISH_SUCCESS = "取消发布成功";
    const TIP_CANCEL_PUBLISH_FAILED = "取消发布失败，请重试";
    const TIP_STOP_PUBLISH_SUCCESS = "停止发布成功";
    const TIP_STOP_PUBLISH_FAILED = "停止发布失败，请重试";
    const TIP_ACTIVE_SELECT = "无法删除发布中的俱乐部";
    const PUBLISHED = "已发布";
    const NOT_PUBLISH = "待发布";

    var rcGridColumnDefs = [
        { field: 'name', enableFiltering: true, allowCellFocus: false, displayName: '俱乐部名称' },
        { field: 'captain.userid', allowCellFocus: false, displayName: '俱乐部部长' },
        { field: 'status', allowCellFocus: false, displayName: '状态' }
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
        data: 'vm.clubList',
        multiSelect: true,
        modifierKeysToMultiSelect: true,
        columnDefs : rcGridColumnDefs,
        rowTemplate: "<div ng-dblclick=\"grid.appScope.showInfo(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
    };
    vm.rcGrid.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    };
    // Authority Controll
    // $scope.isAdminLogin = true;

    //$scope.currentUser = $cookies.get('USER_ID')? $cookies.get('USER_ID'):'';
    $scope.currentUser = JSON.parse($cookies.get('USER_INFO'))?JSON.parse($cookies.get('USER_INFO')):{};
    $scope.role = $scope.currentUser?$scope.currentUser.role:'';

    vm.searchClub = function(){
        RecreationClubService.findRecreationClubs(vm.criteria, function(err, datas){
            if(_.isEmpty(datas)){
                vm.clubList = [];
            }else {
                vm.clubList = datas;
                $scope.club = vm.clubList.filter(function (club) {
                    if (club && club.captain)
                        return club.captain.userid === $scope.currentUser.userid
                })[0];
                if ($scope.club) {
                    $scope.createDateTime = $scope.club.createDateTime ? getOperationTime($scope.club.createDateTime) : '';
                    $scope.icon = $scope.club.icon && $scope.club.icon.indexOf('public/') >= 0 ? $scope.club.icon.substr($scope.club.icon.indexOf('/') + 1) : $scope.club.icon;
                }
            }
        });
    };
    vm.searchClub();

    vm.resetSearch = function(){
        
    };


    $scope.loadRcData = function(){
        RecreationClubService.findRecreationClubs({}, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                if (data===null) {
                    data = [];
                }

                vm.rcGrid.data = data;
            }
        });
    };

    $scope.loadRcData();

    instance.refreshForCreateOrUpdate = function (recreationClub) {
        // if (recreationClub != null) {
        //     vm.rcGrid.data.push(recreationClub);

        // } else {
        //     $scope.loadRcData();
        // }
        vm.searchClub();
    };

    $scope.addRecreationClub = function(){
        instance.captainList = _.map(vm.clubList, 'captain._id');
        $uibModal.open({
            templateUrl: 'client/maintain/recreationClub/views/recreationClubTemplate.html',
            controller: 'RecreationClubCreate',
            //size: 'lg',
            backdrop: 'static'
        });
    }

    $scope.updateRecreationClub = function(recreationClub){
        instance.captainList = _.pull(_.map(vm.clubList, 'captain._id'), _.result(recreationClub, 'captain._id'));
        instance.applicantEntity = recreationClub;
        $uibModal.open({
            templateUrl: 'client/maintain/recreationClub/views/recreationClubTemplate.html',
            controller: 'RecreationClubUpdate',
            //size: 'lg',
            backdrop: 'static'
        });
    }

    $scope.deleteRecreationClub = function(recreationClub){
        $.confirm({
            title: '确定删除所有选中的俱乐部？',
            content: false,
            confirmButton:'确定',
            cancelButton:'取消',
            confirmButtonClass: 'btn-info',
            cancelButtonClass: 'btn-default',
            theme:'black',
            keyboardEnabled:true,
            confirm: function(){
                var row = recreationClub;

                RecreationClubService.deleteRecreationClub(row._id,function(err,data){
                    if (err) {
                        toaster.pop('error', TIP_DELETE_FAILED);
                        instance.refreshForCreateOrUpdate(null);
                    } else {
                        toaster.pop('success', TIP_DELETE_SUCCESS);
                        instance.refreshForCreateOrUpdate(null);
                    }
                })

            },
            cancel: function(){
            }
        });
    }

    $scope.publishRecreationClub = function(){
        if($scope.gridApi.grid.selection.selectedCount == 0){
            toaster.pop('error', TIP_NO_DATA_SELECT);
        } else {
            $.confirm({
                title: '确定发布所有选中的俱乐部？',
                content: false,
                confirmButton:'确定',
                cancelButton:'取消',
                confirmButtonClass: 'btn-info',
                cancelButtonClass: 'btn-default',
                theme:'black',
                keyboardEnabled:true,
                confirm: function(){
                    $scope.gridApi.selection.getSelectedRows().forEach(function(row){
                        row.status = PUBLISHED;
                        RecreationClubService.upsertRecreationClub(row,function(err,data){
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
                cancel: function(){
                }
            });
        }
    }

    $scope.stopPublishRecreationClub = function(){
        if($scope.gridApi.grid.selection.selectedCount == 0){
            toaster.pop('error', TIP_NO_DATA_SELECT);
        } else {
            $.confirm({
                title: '确定停止发布所有选中的俱乐部？',
                content: false,
                confirmButton:'确定',
                cancelButton:'取消',
                confirmButtonClass: 'btn-info',
                cancelButtonClass: 'btn-default',
                theme:'black',
                keyboardEnabled:true,
                confirm: function(){
                    $scope.gridApi.selection.getSelectedRows().forEach(function(row){
                        row.status = NOT_PUBLISH;
                        RecreationClubService.upsertRecreationClub(row,function(err,data){
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
                cancel: function(){
                }
            });
        }
    }

    vm.getH5ForRC = function(){
        var data = {
            'createUser': $scope.currentUser.userid,
            'isDelete': false,
            'isSelect': true,
            'type': '1102'
        }
        RecreationClubTMService.getPageTpls(data, function(error, res){
            if(200 === res.data.code){
                if (res.data.templates && res.data.templates.length > 0) {
                    $scope.noTpl = false;
                    $scope.tpl = res.data.templates[0];
                    $scope.totalItems = res.data.map.count;
                }
                else{
                    $scope.noTpl = true;
                    $scope.tpl = {};
                    $scope.totalItems = 0;
                }
            }
        });
    }
    vm.getH5ForRC();

    $scope.addDescription = function(){
          instance.captainList = _.map(vm.clubList, 'captain._id');
          $uibModal.open({
              templateUrl: 'client/maintain/recreationClub/views/recreationClubDescription.html',
              controller: 'RecreationClubCreate',
              backdrop: 'static'
          });
    }

    $scope.updateDescription = function(recreationClub){
          instance.captainList = _.pull(_.map(vm.clubList, 'captain._id'), _.result(recreationClub, 'captain._id'));
          instance.applicantEntity = recreationClub;
          $uibModal.open({
              templateUrl: 'client/maintain/recreationClub/views/recreationClubDescription.html',
              controller: 'RecreationClubUpdate',
              backdrop: 'static'
          });
    }

    $scope.publish = function(recreationClub, flag) {
        recreationClub.status = flag===0?PUBLISHED:NOT_PUBLISH;
        var tip = flag===0?TIP_PUBLISH_SUCCESS:TIP_CANCEL_PUBLISH_SUCCESS;
        var ftip = flag===0?TIP_PUBLISH_FAILED:TIP_CANCEL_PUBLISH_FAILED;
        RecreationClubService.upsertRecreationClub(recreationClub, function (err, data) {
            if (err) {
                toaster.pop('error', ftip);
            } else {
                toaster.pop('success', tip);
                instance.refreshForCreateOrUpdate(data);
            }
        });
    }

    vm.getUpfilesByUser = function(){
          RecreationClubService.getUpfiles({createUser: $scope.currentUser.userid}, function(err, upfiles){
              if(err)
                  console.log(err);
              else
                  vm.upfiles = upfiles;
          })
      }
    vm.getUpfilesByUser();

    $scope.uploadFile = function(recreationClub) {
        RecreationClubService.getUpfiles({createUser: $scope.currentUser.userid}, function(err, upfiles){
            if(err)
                console.log(err);
            else {
                instance.applicantEntity = {
                    upfiles: upfiles.upfiles,
                    recreationClub: recreationClub
                }
                $uibModal.open({
                    templateUrl: 'client/maintain/recreationClub/views/recreationClubUpload.html',
                    controller: 'RecreationClubUploadController',
                    backdrop: 'static'
                });
            }
        })
    }

      function getOperationTime(date) {
          var updateDate = new Date(date);
          if (!updateDate) {
              return '';
          }
          var month = updateDate.getMonth() < 10 ? '0' + updateDate.getMonth() : updateDate.getMonth();
          month ++;
          var day = updateDate.getDate() < 10 ? '0' + updateDate.getDate() : updateDate.getDate();
          var hour = updateDate.getHours() < 10 ? '0' + updateDate.getHours() : updateDate.getHours();
          var minute = updateDate.getMinutes() < 10 ? '0' + updateDate.getMinutes() : updateDate.getMinutes();
          //   var second = updateDate.getSeconds() < 10 ? '0' + updateDate.getSeconds() : updateDate.getSeconds();
          var time = updateDate.getFullYear() + '/'
              + month + '/' + day + ' ' + hour + ':' + minute;
          //   + ':' + second;
          return time;
      }
  }
}());