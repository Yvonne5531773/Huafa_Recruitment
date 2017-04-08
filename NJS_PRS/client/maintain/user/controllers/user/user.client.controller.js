
angular.module("userManagement").controller("userController", ['$scope', '$http', 'uiGridConstants', '$uibModal',
    'i18nService', 'instance', 'toaster', '$rootScope', '$cookies', 'UserService', 'DictionaryService',
    function ($scope, $http, uiGridConstants, $uibModal, i18nService, instance, toaster, $rootScope, $cookies, UserService,DictionaryService) {
    var vm = $scope.vm = {};
    vm.collapsed = false;
    i18nService.setCurrentLang("zh-cn");

    const TIP_ONLY_ONE_ROW_SELECT = "请只选中一行记录进行操作";
    const TIP_DELETE_SUCCESS = "删除成功";
    const TIP_DELETE_FAILED = "删除失败";

    $scope.userGrid = {
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
        { field: 'userid', enableFiltering: true, allowCellFocus: false, displayName: '用户名称' },
        { field: 'role', allowCellFocus: false, displayName: '权限' },
        { field: 'company', allowCellFocus: false, displayName: '所属单位' },
        { field: 'createdBy', allowCellFocus: false, visible:false, displayName: '创建者' },
        { field: 'created', allowCellFocus: false, visible:false, displayName: '创建时间' },
        { field: 'updatedBy', allowCellFocus: false, displayName: '更新者' },
        { field: 'updated', allowCellFocus: false, displayName: '更新时间' }
    ];

    function getLoginUserRole() {
        var userInfo = JSON.parse($cookies.get('USER_INFO'));
        var username = userInfo.userid;
        var criteria = {};

        if (!_.isEmpty(username)) {
            criteria.userid = username;
        }
        UserService.findUsers(criteria, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                var loginuser = data[0];
                if ('管理' === loginuser.role) {
                    $scope.isAdminLogin = true;
                }
            }
        });
    }

    getLoginUserRole();

    $scope.getUserList = function () {
        /*$http.get('/api/v1/loginuser').success(function (data) {
            $scope.userList = data;
        });*/
        UserService.findUsers({}, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                $scope.userList = data;
            }
        });
    };
    $scope.getUserList();

    $scope.roleList = ['管理', '普通'];
    DictionaryService.getDictionarys({category:{'$in':['用人单位-本部','用人单位-幼稚园','用人单位-小学',
        '用人单位-中学','用人单位-高中','用人单位-培训学校',]}}, function(err, result){
        if(result.data) {
            $scope.allCompanies = result.data.map(function (data) {
                return data.value;
            });
        }
    });

    $scope.isLocal = true;

    $scope.loadUserData = function () {
        var userInfo = JSON.parse($cookies.get('USER_INFO'));
        var criteria = {};
        if(userInfo.company !== '华发教育公司') criteria.company = userInfo.company;
        UserService.findUsers(criteria, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                $scope.userGrid.data = data;
                data.forEach(function (user) {
                    user.created = getOperationTime(user.created);
                    user.updated = getOperationTime(user.updated);
                });
            }
        });
    };
    $scope.loadUserData();

    $scope.searchUser = function () {
        var criteria = {};

        if (!_.isEmpty($scope.username)) {
            criteria.userid = $scope.username;
        }
        if (!_.isEmpty($scope.roleName)) {
            criteria.role = $scope.roleName==='管理'?'admin':'user';
        }
        if (!_.isEmpty($scope.accountName)) {
            criteria.accountType = $scope.accountName;
        }

        UserService.findUsers(criteria, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                if(!_.isEmpty(data)) {
                    data.forEach(function (loginuser) {
                        loginuser.created = getOperationTime(loginuser.created);
                        loginuser.updated = getOperationTime(loginuser.updated);
                    });
                    $scope.userGrid.data = data;
                }
            }
        });
    };

    $scope.resetSearch = function () {
        $scope.username = null;
        $scope.accountName = null;
        $scope.roleName = null;
    };

    /*****************************************************************************
    *  Module: Add User
    ******************************************************************************/

    $scope.addUser = function () {
        $uibModal.open({
            templateUrl: 'client/maintain/user/views/user/userTemplate.html',
            controller: 'userCreate',
            size: 'lg',
            backdrop: 'static'
        });
    };

    $scope.updateUser = function () {
        if ($scope.gridApi.grid.selection.selectedCount != 1) {
            toaster.pop('error', TIP_ONLY_ONE_ROW_SELECT);
        } else {
            //console.log($scope.gridApi.grid.selection.lastSelectedRow.entity);
            instance.applicantEntity = $scope.gridApi.grid.selection.lastSelectedRow.entity;
            $uibModal.open({
                templateUrl: 'client/maintain/user/views/user/userTemplate.html',
                controller: 'userUpdate',
                size: 'lg',
                backdrop: 'static'
            });
        }
    };

    $scope.deleteUser = function () {
        if ($scope.gridApi.grid.selection.selectedCount != 1) {
            toaster.pop('error', TIP_ONLY_ONE_ROW_SELECT);
        }
        else {
            $.confirm({
                title: '确定删除所有选中的用户？',
                content: false,
                confirmButton: '确定',
                cancelButton: '取消',
                confirmButtonClass: 'btn-info',
                cancelButtonClass: 'btn-default',
                theme: 'black',
                keyboardEnabled: true,
                confirm: function () {
                    var row = $scope.gridApi.grid.selection.lastSelectedRow.entity;
                    //console.log(rows);
                    /*$http.post('/api/user/deleteUser/', { 'userId': row._id }).success(function (data) {
                        toaster.pop('success', TIP_DELETE_SUCCESS);
                        instance.refreshForCreateOrUpdate(null);
                    }).error(function () {
                        toaster.pop('error', TIP_DELETE_FAILED);
                        instance.refreshForCreateOrUpdate(null);
                    });*/
                    UserService.deleteUser(row._id, function (err, result) {
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
                cancel: function () {
                }
            });

        }
    };
    $scope.batchInsert = function () {
        var users = [{},{},{},{},{},{}];
        instance.users = users;
        instance.allCompanies = $scope.allCompanies;
        $uibModal.open({
            templateUrl: 'client/maintain/user/views/user/batchInsert.html',
            controller: 'batchInsert',
            size: 'lg',
            backdrop: 'static'
        }).result.then(function (result) {
            if (["create", "save"].indexOf(result) > -1)
                $scope.userList.push(users);
        });
    }

    $scope.userGrid.multiSelect = true;
    $scope.userGrid.modifierKeysToMultiSelect = true;
    //$scope.userGrid.noUnselect = true;

    $scope.userGrid.columnDefs = positionIntroductionGridColumnDefs;

    $scope.userGrid.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    };

    function convertGMTtoDate(dateTimeString) {
        if (!dateTimeString) {
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

    function getOperationTime(date) {
        var updateDate = convertGMTtoDate(date);
        var month = updateDate.getMonth() < 10 ? '0' + updateDate.getMonth() : updateDate.getMonth();
        var day = updateDate.getDate() < 10 ? '0' + updateDate.getDate() : updateDate.getDate();
        var hour = updateDate.getHours() < 10 ? '0' + updateDate.getHours() : updateDate.getHours();
        var minute = updateDate.getMinutes() < 10 ? '0' + updateDate.getMinutes() : updateDate.getMinutes();
        var second = updateDate.getSeconds() < 10 ? '0' + updateDate.getSeconds() : updateDate.getSeconds();
        var time = updateDate.getFullYear() + '-'
            + month + '-' + day + ' ' + hour + ':' + minute
            + ':' + second;
        return time;
    }

    instance.refreshForCreateOrUpdate = function (position) {
        if (position != null) {
            $scope.userGrid.data.push(position);
        } else {
            $scope.loadUserData();
        }
    };

    function convertGMTtoDate(dateTimeString) {
        if (!dateTimeString) {
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
}]);

angular.module('userManagement').controller('userCreate', ['instance', '$scope', '$http', '$uibModal', '$uibModalInstance',
    'toaster', '$cookies', 'UserService','DictionaryService',
    function (instance, $scope, $http, $uibModal, $uibModalInstance, toaster, $cookies, UserService,DictionaryService) {
        var userInfo = JSON.parse($cookies.get('USER_INFO'));
        const TIP_CREATE_SUCCESS = "创建成功";
        const TIP_CREATE_FAILED = "创建失败，请重试";

        $scope.createUser_domainId_error_show = false;
        $scope.isAdmin = (userInfo.role === '管理');
        $scope.isLocal = true;
        $scope.user = {
            accountType: 'ldap',
            role: 'user'
        };

        $scope.createUsernameValidation = true;

        DictionaryService.getDictionarys({category:{'$in':['用人单位-本部','用人单位-幼稚园','用人单位-小学',
            '用人单位-中学','用人单位-高中','用人单位-培训学校',]}}, function(err, result){
            if(result.data) {
                $scope.allCompanies = result.data.map(function (data) {
                    return data.value;
                });
            }
        });

        $scope.createNewUser = function () {
            $scope.user_create_form.$valid = false;
            if (!$scope.isLocal) {
                $scope.user_create_form.userCreatePassword.$valid = true;
                if ($scope.user_create_form.userCreateDomainId.$valid) {
                    $scope.user_create_form.$valid = true;
                }
            } else {
                $scope.user_create_form.userCreateConfirmPasswordNotSameAsBefore = ($scope.user.password !== $scope.user.confirmPassword);
                if ($scope.user_create_form.userCreatePassword.$valid && $scope.user_create_form.userCreateConfirmPassword.$valid && !$scope.user_create_form.userCreateConfirmPasswordNotSameAsBefore && $scope.user_create_form.userCreateDomainId.$valid) {
                    $scope.user_create_form.$valid = true;
                }
            }
            if ($scope.user_create_form.$valid) {
                var userInfo = JSON.parse($cookies.get('USER_INFO'));
                $scope.user.userid = $scope.user.userid.toLowerCase();
                $scope.user.createdBy = userInfo.userid;
                $scope.user.updatedBy = userInfo.userid;
                $scope.user.created = new Date();
                $scope.user.updated = new Date();
                /*var url = '/api/user';
                $http.post(url, $scope.user).success(function (data) {
                    $uibModalInstance.close('ok');
                    toaster.pop('success', TIP_CREATE_SUCCESS);
                    instance.refreshForCreateOrUpdate(null);
                }).error(function (error) {
                    if (error.message && error.message.indexOf('username already exists') !== -1) {
                        $scope.createUser_domainId_error_show = true;
                    }
                });*/
                UserService.upsertUser($scope.user, function (err, result) {
                    if (err) {
                        if (error.message && error.message.indexOf('username already exists') !== -1) {
                            $scope.createUser_domainId_error_show = true;
                        }
                    } else {
                        $uibModalInstance.close('ok');
                        toaster.pop('success', TIP_CREATE_SUCCESS);
                        instance.refreshForCreateOrUpdate(null);
                    }
                });

            } else {
                $scope.user_create_form.userCreated = true;
            }
        };

        $scope.validationField = function (userid) {
            var user = {};
            if (userid !== null && angular.isDefined(userid) && userid.replace(/(^\s*)|(\s*$)/g, "") !== '') {
                user.userid = userid.toLowerCase();
                /*$http.post('/api/user/validation', user).success(function (data) {
                    if (data.status === 'success') {
                        $scope.createUser_domainId_error_show = false;
                        $scope.createUsernameValidation = true;
                    } else {
                        $scope.createUser_domainId_error_show = true;
                        $scope.createUsernameValidation = false;
                    }

                }).error(function (err) {
                    console.log(err);
                });*/
                UserService.userValidation(user, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (result.status === 'success') {
                            $scope.createUser_domainId_error_show = false;
                            $scope.createUsernameValidation = true;
                        } else {
                            $scope.createUser_domainId_error_show = true;
                            $scope.createUsernameValidation = false;
                        }
                    }
                });
            }

        };

        $scope.setAccoutType = function () {
            $scope.isLocal = true;
        }

        $scope.cancel = function () {
            $uibModalInstance.close('cancel');
        };
    }
]);

angular.module('userManagement').controller('userUpdate', ['instance', '$scope', '$http', '$uibModal', '$uibModalInstance',
    'toaster', '$cookies', 'UserService','DictionaryService',
    function (instance, $scope, $http, $uibModal, $uibModalInstance, toaster, $cookies, UserService,DictionaryService) {
        var userInfo = JSON.parse($cookies.get('USER_INFO'));
        const TIP_UPDATE_SUCCESS = "更新成功";
        const TIP_UPDATE_FAILED = "更新失败，请重试";
        $scope.createUsernameValidation = true;
        $scope.user = _.cloneDeep(instance.applicantEntity);
        $scope.isAdmin = (userInfo.role === '管理');
        $scope.itself = (userInfo.userid === $scope.user.userid);
        $scope.user.password = '';
        $scope.isUpdateUserName = true;

        DictionaryService.getDictionarys({category:{'$in':['用人单位-本部','用人单位-幼稚园','用人单位-小学',
            '用人单位-中学','用人单位-高中','用人单位-培训学校',]}}, function(err, result){
            if(result.data) {
                $scope.allCompanies = result.data.map(function (data) {
                    return data.value;
                });
            }
        });

        $scope.createNewUser = function () {
            $scope.user_create_form.$valid = false;
            $scope.user_create_form.userCreateConfirmPasswordNotSameAsBefore = ($scope.user.password !== $scope.user.confirmPassword);
            if ($scope.user_create_form.userCreatePassword.$valid && $scope.user_create_form.userCreateConfirmPassword.$valid && !$scope.user_create_form.userCreateConfirmPasswordNotSameAsBefore) {
                $scope.user_create_form.$valid = true;
            }
            if ($scope.user_create_form.$valid) {
                var userInfo = JSON.parse($cookies.get('USER_INFO'));
                $scope.user.userid = $scope.user.userid.toLowerCase();
                $scope.user.updatedBy = userInfo.userid;
                $scope.user.updated = new Date();
                /*var url = '/api/user';
                $http.post(url, $scope.user).success(function (data) {
                    $uibModalInstance.close('ok');
                    toaster.pop('success', TIP_UPDATE_SUCCESS);
                    instance.refreshForCreateOrUpdate(null);
                }).error(function (error) {
                    if (error.message && error.message.indexOf('username already exists') !== -1) {
                        $scope.createUser_domainId_error_show = true;
                    }
                });*/
                UserService.upsertUser($scope.user, function (err, result) {
                    if (err) {
                        if (error.message && error.message.indexOf('username already exists') !== -1) {
                            $scope.createUser_domainId_error_show = true;
                        }
                    } else {
                        $uibModalInstance.close('ok');
                        toaster.pop('success', TIP_UPDATE_SUCCESS);
                        instance.refreshForCreateOrUpdate(null);
                    }
                });
            } else {
                $scope.user_create_form.userCreated = true;
            }
        };

        $scope.setAccoutType = function () {
            $scope.isLocal = true;
        }
        $scope.cancel = function () {
            $uibModalInstance.close('cancel');
        };
    }
]);

angular.module('userManagement').controller('batchInsert', ['instance', '$scope', '$http', '$uibModal', '$uibModalInstance',
    'toaster', '$cookies', 'UserService','DictionaryService',
    function (instance, $scope, $http, $uibModal, $uibModalInstance, toaster, $cookies, UserService,DictionaryService) {
        const TIP_INSERT_SUCCESS = "批量插入成功";
        const TIP_INSERT_FAILED = "批量插入失败，请重试";
        $scope.users = instance.users;
        $scope.allCompanies = instance.allCompanies;
        $scope.roles = ['管理', '普通'];

        $scope.settings = {
            colHeaders: true,
            contextMenu: ['row_above', 'row_below', 'remove_row'],
            showRowHeader: true,
            showColHeader: true,
            columns: [
                {
                    title: '用户名称',
                    data: 'userid',
                    name: 'userid',
                    width: "100",
                },
                {
                    title: '权限',
                    type: 'dropdown',
                    data: 'role',
                    name: 'role',
                    width: "100",
                    source: $scope.roles,
                    strict: false,
                    trimDropdown: false,
                },
                {
                    title: '所属单位',
                    type: 'dropdown',
                    data: 'company',
                    source: $scope.allCompanies,
                    strict: false,
                    trimDropdown: false,
                    width: "120",
                    name: 'company'
                },
                {
                    title: '密码',
                    data: 'password',
                    name: 'password',
                    width: "100",
                }]
        };

        $scope.save = function (valid) {
            if (!valid) {
                toaster.pop('error', TIP_INSERT_FAILED);
                return;
            }
            var insertUsers = _.without($scope.users, '', undefined, null);
            var tipUsers = _.without(_.map($scope.users,function(user){return user.userid}), '', undefined, null);
            var content = "确定要插入数据？"
            if (insertUsers.length > 0) content = '将新增以下用户：' + tipUsers.join(',') + '。' + content;
            $.confirm({
                title: content,
                content: false,
                confirmButton: '确定',
                cancelButton: '取消',
                confirmButtonClass: 'btn-info',
                cancelButtonClass: 'btn-default',
                theme: 'black',
                keyboardEnabled: true,
                confirm: function () {
                    var userInfo = JSON.parse($cookies.get('USER_INFO')),
                        createdBy = userInfo.userid,
                        updatedBy = userInfo.userid;
                    _.forEach(insertUsers, function(user){
                        (function(user){
                            if(!_.isEmpty(user)) {
                                user.updatedBy = createdBy;
                                user.updated = updatedBy;
                                user.created = Date.now;
                                user.updated = Date.now;
                                user.userid = user.userid.toLowerCase();
                                user.role = user.role === '管理' ? 'admin' : 'user';
                                UserService.findUsers({userid: user.userid}, function (err, data) {
                                    if (err) toaster.pop('error', TIP_INSERT_FAILED);
                                    else if(!_.isEmpty(data)) toaster.pop('error', user.userid+' 插入失败, 账户名称已存在');
                                    else {
                                        UserService.upsertUser(user, function (err, result) {
                                            if (err) {
                                                if (error.message && error.message.indexOf('username already exists') !== -1) {
                                                    toaster.pop('error', TIP_INSERT_FAILED);
                                                }
                                            } else {
                                                $uibModalInstance.close('ok');
                                                toaster.pop('success', user.userid+' 插入成功');
                                                instance.refreshForCreateOrUpdate(null);
                                            }
                                        });
                                    }
                                });
                            }
                        })(user);
                    });
                }
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.close('cancel');
        };
    }
]);
