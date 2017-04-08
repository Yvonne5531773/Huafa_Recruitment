/**
 * Created by SUKE3 on 11/22/2016.
 */

angular.module('ActivityUserManagement').factory('ActivityUserService', ActivityUserService);

ActivityUserService.$inject = ['$http'];

function ActivityUserService($http) {
    return {
        findActivityUsers: findActivityUsers,
    };


    function findActivityUsers(criteria, callBack) {
        $http.get('/api/signupField/findSignupFields', criteria).then(function (res) {
            if (res) {
                return callBack(null, res.data);
            } else {
                return callBack('rep failed', null);
            }
        });
    }

} 