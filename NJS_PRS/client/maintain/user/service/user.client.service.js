angular.module('userManagement').factory('UserService', UserService);

UserService.$inject = ['$http'];

function UserService($http) {
    return {
        findUsers: findUsers,
        upsertUser: upsertUser,
        deleteUser: deleteUser,
        userValidation: userValidation,
        getUser: getUser
    };

    function findUsers(criteria, callBack) {
        $http.post('/api/user/findUsers', criteria).then(function (res) {
            if (res) {
                return callBack(null, res.data);
            } else {
                return callBack('rep failed', null);
            }

        });
    }

    function upsertUser(user, callBack) {
        $http.post('/api/user', user).success(function (data) {
            return callBack(null, data);
        }).error(function (error) {
            return callBack(error, null);
        });
    }

    function deleteUser(userId, callBack) {
        $http.post('/api/user/deleteUser/', { 'userId': userId }).success(function (data) {
            return callBack(null, data);
        }).error(function (error) {
            return callBack(error, null);
        });
    }

    function userValidation(user, callBack) {
        $http.post('/api/user/validation', user).success(function (data) {
            return callBack(null, data);
        }).error(function (err) {
             return callBack(err, null);
        });
    }

    function getUser(data, callBack) {
        $http.post('/api/user/getUser', data).then(function (res) {
            if (res) {
                return callBack(null, res.data);
            } else {
                return callBack('rep failed', null);
            }
        });
    }

} 