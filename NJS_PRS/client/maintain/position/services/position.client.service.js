/**
 * Created by lica4 on 11/16/2016.
 */

angular.module('position').factory('PositionService', PositionService);

PositionService.$inject = ['$http'];

function PositionService($http) {

    return {
        getPositions: getPositions,
        upsertPosition: upsertPosition,
        deletePosition: deletePosition,
        getWorkAddr: getWorkAddr,
        publishJob: publishJob
    };

    function getPositions(data, callback) {
        var url = "/api/position/getPositions";
        $http.post(url, data).then(function (data) {
            if(data){
                return callback(null, data);
            }else {
                return callback(null, null);
            }
        });
    }

    function upsertPosition(position, callBack) {
        $http.post('/api/position', position).success(function (data) {
            return callBack(null, data);
        }).error(function (error) {
            return callBack(error, null);
        });
    }

    function deletePosition(positionId, callBack) {
        $http.post('/api/position/deletePosition/', { '_id': positionId }).success(function (data) {
            return callBack(null, data);
        }).error(function (error) {
            return callBack(error, null);
        });
    }

    function getWorkAddr(criteria, callBack) {
        $http.post('/api/position/getWorkAddr', criteria).success(function (data) {
            return callBack(null, data);
        }).error(function (error) {
            return callBack(error, null);
        });
    }

    function publishJob(criteria, callBack) {
        $http.put('/api/position/publish', criteria).success(function (data) {
            return callBack(null, data);
        }).error(function (error) {
            return callBack(error, null);
        });
    }
} 