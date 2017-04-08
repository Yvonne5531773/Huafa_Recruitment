/**
 * Created by lica4 on 11/16/2016.
 */

angular.module('templateManagement').factory('RecreationClubTMService', RecreationClubTMService);

RecreationClubTMService.$inject = ['$http'];

function RecreationClubTMService($http) {
    return {
        getPageTpls: getPageTpls,
        selectTpl: selectTpl,
        deleteTpl: deleteTpl,
        createTplByH5: createTplByH5,
        getH5Url: getH5Url
    };

    function getPageTpls(data, callback) {
        var url = "/api/getH5TemplatesByUser";
        $http.post(url, data).then(function (data) {
            if(data){
                return callback(null, data);
            }else {
                return callback(null, null);
            }
        });
    }

    function selectTpl(data, callback) {
        var url = "/api/selectTemplateById";
        $http.post(url, data).then(function (data) {
            if(data){
                return callback(null, data);
            }else {
                return callback(null, null);
            }
        });
    }

    function deleteTpl(data, callback) {
        var url = "/api/deleteTemplateById";
        $http.post(url, data).then(function (data) {
            if(data){
                return callback(null, data);
            }else {
                return callback(null, null);
            }
        });
    }

    function createTplByH5(data, callback){
        var url = "/api/createTplByH5";
        $http.post(url, data).then(function (data) {
            if(data){
                return callback(null, data);
            }else {
                return callback(null, null);
            }
        });
    }

    function getH5Url(callback){
        var url = "/api/getH5Url";
        $http.get(url).then(function (data) {
            if(data){
                return callback(null, data);
            }else {
                return callback(null, null);
            }
        });
    }
} 