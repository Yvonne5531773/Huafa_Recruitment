angular.module('clubActivityManagement').factory('ClubActivityService', ClubActivityService);

ClubActivityService.$inject = ['$http'];

function ClubActivityService($http) {
    return {
        findClubActivitys: findClubActivitys,
        upsertClubActivity: upsertClubActivity,
        deleteClubActivity: deleteClubActivity
    };

    function findClubActivitys(criteria, callBack) {
        $http.post('/api/clubActivity/findClubActivitys', criteria).then(function (res) {
            if (res) {
                return callBack(null, res.data);
            } else {
                return callBack('rep failed', null);
            }

        });
    }

    function upsertClubActivity(clubActivity, callBack) {
        $http.post('/api/clubActivity', clubActivity).success(function (data) {
            return callBack(null, data);
        }).error(function (error) {
            return callBack(error, null);
        });
    }

    function deleteClubActivity(clubActivityId, callBack) {
        debugger;
        $http.post('/api/clubActivity/deleteClubActivity/', { 'clubId': clubActivityId }).success(function (data) {
            return callBack(null, data);
        }).error(function (error) {
            return callBack(error, null);
        });
    }

} 