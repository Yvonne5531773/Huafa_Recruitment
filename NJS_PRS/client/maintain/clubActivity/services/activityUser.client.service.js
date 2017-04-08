angular.module('clubActivityManagement').factory('ActivityUserService', ActivityUserService);

ActivityUserService.$inject = ['$http'];

function ActivityUserService($http) {
    return {
        getActivityUsers: getActivityUsers,
        convertActivityUsers: convertActivityUsers
    };

    function getActivityUsers(activityId, callBack) {
        $http.post('/api/ActivityUser/getActivityUsers', {'activityId':activityId}).then(function (res) {
            if (res) {
                return callBack(null, res.data);
            } else {
                return callBack('rep failed', null);
            }

        });
    }

    function convertActivityUsers(activityUsers) {
        var activityUserList = [];
        _.forEach(activityUsers, function(activityUser){
            var tempUser = {};
            _.forEach(activityUser.fields, function(field){
                tempUser[field.fieldKey] = field.fieldValue;
            });
            activityUserList.push(tempUser);
        });
        return activityUserList;
    }

} 