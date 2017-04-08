/**
 * Created by lica4 on 11/16/2016.
 */

angular.module('company').factory('CompanyService', CompanyService);

CompanyService.$inject = ['$http'];

function CompanyService($http) {

    return {
        getCompanys: getCompanys,
        upsertCompany: upsertCompany,
        deleteCompany: deleteCompany,
        changeCompanySegmentLayout: changeCompanySegmentLayout,
        getCompanyInfos: getCompanyInfos,
        upsertCompanyInfo: upsertCompanyInfo,
        getUpfiles: getUpfiles,
        deleteUpfiles: deleteUpfiles
    };

    function getCompanys(criteria, callback) {
        var url = "/api/company/getCompanys";
        $http.post(url, criteria).then(function (data) {
            if(data){
                return callback(null, data);
            }else {
                return callback(null, null);
            }
        });
    }

    function upsertCompany(company, callBack) {
        $http.post('/api/company', company).success(function (data) {
            return callBack(null, data);
        }).error(function (error) {
            return callBack(error, null);
        });
    }

    function deleteCompany(companyId, callBack) {
        $http.post('/api/company/deleteCompany', { '_id': companyId }).success(function (data) {
            return callBack(null, data);
        }).error(function (error) {
            return callBack(error, null);
        });
    }

    function changeCompanySegmentLayout(criteria, callBack) {
        $http.post('/api/company/changeCompanySegmentLayout', criteria).success(function (data) {
            return callBack(null, data);
        }).error(function (error) {
            return callBack(error, null);
        });
    }

    function getCompanyInfos(criteria, callback) {
        var url = "/api/companyInfo/getCompanyInfos";
        $http.post(url, criteria).then(function (data) {
            if(data){
                return callback(null, data);
            }else {
                return callback(null, null);
            }
        });
    }

    function upsertCompanyInfo(companyInfo, callBack) {
        $http.post('/api/companyInfo', companyInfo).success(function (data) {
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

    function deleteUpfiles(options, callBack) {
        $http.post('/api/deleteUpfiles', options).success(function (data) {
            return callBack(null, data);
        }).error(function (error) {
            return callBack(error, null);
        });
    }
} 