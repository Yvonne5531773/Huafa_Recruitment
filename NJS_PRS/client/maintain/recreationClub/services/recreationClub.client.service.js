angular.module('recreationClubManagement').factory('RecreationClubService', RecreationClubService);

RecreationClubService.$inject = ['$http'];

function RecreationClubService($http) {
    return {
        findRecreationClubs: findRecreationClubs,
        upsertRecreationClub: upsertRecreationClub,
        deleteRecreationClub: deleteRecreationClub,
        getUpfiles: getUpfiles
    };

    function findRecreationClubs(criteria, callBack) {
        $http.post('/api/recreationClub/findRecreationClubs', criteria).then(function (res) {
            if (res) {
                return callBack(null, res.data);
            } else {
                return callBack('rep failed', null);
            }

        });
    }

    function upsertRecreationClub(recreationClub, callBack) {
        $http.post('/api/recreationClub', recreationClub).success(function (data) {
            return callBack(null, data);
        }).error(function (error) {
            return callBack(error, null);
        });
    }

    function deleteRecreationClub(recreationClubId, callBack) {
        $http.post('/api/recreationClub/deleteRecreationClub/', { 'clubId': recreationClubId }).success(function (data) {
            return callBack(null, data);
        }).error(function (error) {
            return callBack(error, null);
        });
    }

    function getUpfiles(options, callBack) {
        $http.post('/api/getUpfiles', options).success(function (data) {
            return callBack(null, data);
        }).error(function (error) {
            return callBack(error, null);
        });
    }

} 