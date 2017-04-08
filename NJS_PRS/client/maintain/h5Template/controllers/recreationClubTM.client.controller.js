/**
 * Created by lica4 on 11/16/2016.
 */
    'use strict';

angular.module('templateManagement').controller('RecreationClubTMController', RecreationClubTMController);

    RecreationClubTMController.$inject = ["$window", "$scope", "$rootScope", "$location", "toaster", "$cookies",
        "$timeout", "RecreationClubTMService", "UserService"];

    function RecreationClubTMController($window, $scope, $rootScope, $location, toaster, $cookies, $timeout, RecreationClubTMService, UserService){
        $scope.totalItems = 0;
        $scope.currentPage = 1;
        $scope.toPage = "";
        $scope.childcat = 0;
        $scope.order = "new";
        $scope.pageSizeList = 11;
        $scope.pageNoNum = 1;
        $scope.select = false;
        $scope.noTpl = true;
        $scope.pageTplTypesList = [
            // { type: '1101', name: '活动模板'},
            // { type: '1102', name: '俱乐部模板'}
        ]
        $scope.currentUser = JSON.parse($cookies.get('USER_INFO'))?JSON.parse($cookies.get('USER_INFO')):{};
        $scope.pageChanged = function(page) {
            return m.targetPage = page, $scope.pageNoNum = page, $scope.toPage = page,
                $scope.pageNoNum > 1 ? ($scope.blankSample = false, $scope.pageSizeList = 12) : ($scope.blankSample = true,
                    $scope.pageSizeList = 11), 1 > page || page > $scope.totalItems / 11 + 1 ? void alert("此页超出范围") :
                void(1 == $scope.childcat ? $scope.getCompanyTpl(page, $scope.pageSizeList) :
                    $scope.getPageTpls(1, m.sceneType, m.tagId, page, $scope.pageSizeList, m.order, null, m.name))
        };

        var option = {
            order: "",
            selectTpl: {}
        }

        $scope.allpage = function() {
            //$scope.blankSample = true
            $scope.childcat = 0;
            $scope.getPageTpls(null, null, option.order);
        };

        $scope.getPageTplsByType = function(type){
            //$scope.blankSample = true;
            $scope.childcat = type;
            $scope.getPageTpls(null, null, option.order, type);
        };

        $scope.getPageTpls = function(pageNo, pageSize, order, type){
            var data = {
                'createUser': $scope.currentUser.userid,
                'pageNo': pageNo? pageNo: 1,
                'pageSize': pageSize? pageSize: 12,
                'order': order? order: '',
                'type': type? type: '',
                'isDelete': false
            };
            RecreationClubTMService.getPageTpls(data, function(error, res){
                if(200 === res.data.code){
                    if (res.data.templates && res.data.templates.length > 0) {
                        $scope.noTpl = false;
                        var templates = res.data.templates;
                        templates.forEach(function(tpl, i){
                            tpl.createTime = tpl.createTime?getOperationTime(tpl.createTime):'';
                            if(tpl.isSelect){
                                var tplType = $scope.pageTplTypesList.filter(function(tplType){
                                    return tplType.type === tpl.type
                                });
                                tpl.typeName = tplType[0].name
                            }else
                                tpl.typeName = "";
                        });
                        $scope.tpls = templates;
                        $scope.totalItems = res.data.map.count;
                        $scope.currentPage = res.data.map.pageNo;
                        $scope.allPageCount = res.data.map.count;
                        $scope.toPage = res.data.map.pageNo;
                        $scope.blankSample = true;
                    }
                    else{
                        $scope.tpls = [];
                        $scope.totalItems = 0;
                        $scope.blankSample = false;
                        $timeout(function(){
                            $scope.noTpl = true;
                        }, 600);
                    }
                }
            })
        };

        $scope.getPageTpls();

        $scope.getStyle = function(cover) {
            return {
                "background-image": "url(" + cover + ")",
                "background-size": "cover"
            }
        };

        $scope.selectTpl = function(template, type) {
            var query = {
                'createUser': $scope.currentUser.userid,
                'type': type,
                'isDelete': false
            };
            RecreationClubTMService.getPageTpls(query, function(error, res){
                if(200 === res.data.code){
                    if (res.data.templates && res.data.templates.length > 0 && type !== '1101') {
                        $scope.cancelSelectTpl(res.data.templates[0], '1100');
                    }
                    var data = {
                        '_id': template._id,
                        'isSelect': true,
                        'type': type
                    }
                    changeTplSelectStatus(data, true, type);
                }
            });
        };

        $scope.cancelSelectTpl = function(template, type) {
            var data = {
                '_id': template._id,
                'isSelect': false,
                'type': type
            }
            changeTplSelectStatus(data, false, type);
        };

        var changeTplSelectStatus = function(data, status, type){
            var _id = data._id;
            RecreationClubTMService.selectTpl(data, function(error, res){
                if(200 === res.data.code){
                    $scope.tpls.forEach(function(tpl, i){
                        if(tpl._id && tpl._id === _id) {
                            tpl.isSelect = status;
                            if(tpl.isSelect){
                                var tplType = $scope.pageTplTypesList.filter(function(tplType){
                                    return tplType.type === type
                                });
                                tpl.typeName = tplType[0].name;
                            }else
                                tpl.typeName = "";
                        }
                    });
                }
            })
        }

        $scope.deleteTpl = function(template){
            if(template){
                $.confirm({
                    title: '确定要删除？',
                    content: false,
                    confirmButton:'确定',
                    cancelButton:'取消',
                    confirmButtonClass: 'btn-info',
                    cancelButtonClass: 'btn-default',
                    theme:'black',
                    keyboardEnabled:true,
                    confirm: function(){
                        var data = {
                            '_id': template._id,
                            'isDelete': true,
                            'isSelect': false,
                            'type': ''
                        };
                        RecreationClubTMService.deleteTpl(data, function(error, res){
                            if(200 === res.data.code){
                                $scope.tpls.forEach(function(tpl, i){
                                    if(tpl._id && tpl._id === data._id){
                                        $scope.tpls.splice(i, 1);
                                    }
                                });
                                if($scope.tpls.length == 0) {
                                    $scope.blankSample = false;
                                    $timeout(function(){
                                        $scope.noTpl = true;
                                    }, 500);
                                }
                            }else
                                toaster.pop('delete exception');
                        })
                    },
                    cancel: function(){
                    }
                });
            }
        };

        $scope.createTplByH5 = function(){
            var data = {
                'username': $scope.currentUser.userid
            }
            UserService.getUser(data, function(err, user){
                if(user) {
                    var options = {};
                    options.user = user;
                    options.h5Id = $scope.h5Id
                    RecreationClubTMService.createTplByH5(options, function(err, res){
                        if(!err){
                            //$window.location.href = res;
                        }
                    });
                }
            });
        }

        $scope.getH5Url = function(){
            RecreationClubTMService.getH5Url(function(err, res) {
                if (!err) {
                    $scope.h5Id = res.data._id;
                    $scope.h5Url = res.data.url;
                }
            });
        };
        $scope.getH5Url();


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

