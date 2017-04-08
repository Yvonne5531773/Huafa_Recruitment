(function () {
    'use strict';

    angular.module('core')
        .directive('authentication', authentication);

    authentication.$inject = [];

    function authentication() {
        var directive = {
            restrict: 'E',
            bindToController: true,
            controller: AuthenticationController,
            link: link
        };

        return directive;

        function link(scope, element, attrs, controller) {
            if (!_.isEmpty(attrs.haspermission)) {
                controller.hasPermission(attrs.haspermission, function (result) {
                    if (!result) {
                        element.remove();
                    }
                });
            } else if (!_.isEmpty(attrs.hasrole)) {
                controller.hasRole(attrs.hasrole, function (result) {
                    if (!result) {
                        element.remove();
                    }
                });
            }else{
                return;
            }
        }
    }

    AuthenticationController.$inject = ['$scope', '$http'];

    function AuthenticationController($scope, $http) {
        var vm = this;

        vm.hasPermission = function (name, callback) {
            $http.get('/api/user/permissions').then(function (res) {
                var policies;
                if (res) {
                    policies = res.data;
                } else {
                    policies = {};
                }
                var result = _.indexOf(_.result(policies, 'permissions'), name) > -1;
                return callback(result);
            });
        };

        vm.hasRole = function (name, callback) {
            $http.get('/api/user/permissions').then(function (res) {
                var policies;
                if (res) {
                    policies = res.data;
                } else {
                    policies = {};
                }
                var result = _.indexOf(_.result(policies, 'roles'), name) > -1;
                return callback(result);
            });
        };
    }

} ());
