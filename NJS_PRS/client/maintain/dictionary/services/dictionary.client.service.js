/**
 * Created by lica4 on 11/16/2016.
 */

angular.module('dictionary').factory('DictionaryService', DictionaryService);

DictionaryService.$inject = ['$http'];

function DictionaryService($http) {

    return {
        getDictionarys: getDictionarys,
        upsertDictionary: upsertDictionary,
        deleteDictionary: deleteDictionary
    };

    function getDictionarys(data, callback) {
        var url = "/api/dictionary/getDictionarys";
        $http.post(url, data).then(function (data) {
            if(data){
                return callback(null, data);
            }else {
                return callback(null, null);
            }
        });
    }

    function upsertDictionary(position, callBack) {
        $http.post('/api/dictionary', position).success(function (data) {
            return callBack(null, data);
        }).error(function (error) {
            return callBack(error, null);
        });
    }

    function deleteDictionary(positionId, callBack) {
        $http.post('/api/dictionary/deleteDictionary/', { '_id': positionId }).success(function (data) {
            return callBack(null, data);
        }).error(function (error) {
            return callBack(error, null);
        });
    }
} 