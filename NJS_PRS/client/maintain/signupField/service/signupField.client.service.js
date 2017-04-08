/**
 * Created by SUKE3 on 11/22/2016.
 */

angular.module('signupFieldManagement').factory('SignupFieldService', SignupFieldService);

SignupFieldService.$inject = ['$http'];

function SignupFieldService($http) {
    return {
        findSignupFields: findSignupFields,
        upsertSignupField: upsertSignupField,
        deleteSignupField: deleteSignupField
    };


    function findSignupFields(criteria, callBack) {
        $http.get('/api/signupField/findSignupFields', criteria).then(function (res) {
            if (res) {
                return callBack(null, res.data);
            } else {
                return callBack('rep failed', null);
            }
        });
    }

    function upsertSignupField(signupField, callBack) {
        $http.post('/api/signupField', signupField).success(function (data) {
            return callBack(null, data);
        }).error(function (error) {
            return callBack(error, null);
        });
    }

    function deleteSignupField(signupFieldId, callBack) {
        $http.post('/api/signupField/deleteSignupField/', { 'fieldId': signupFieldId }).success(function (data) {
            return callBack(null, data);
        }).error(function (error) {
            return callBack(error, null);
        });
    }

} 