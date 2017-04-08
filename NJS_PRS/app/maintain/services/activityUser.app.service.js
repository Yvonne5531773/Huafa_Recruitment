'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');

exports.getActivityUsers = getActivityUsers;

function getActivityUsers(activityId, callBackFn) {
    var query = {
        'activity' : activityId
    };

    request.get({
        uri: config.url.dom + util.format('/api/v1/ActivityUser?query=%s&populate=commonUser', encodeURIComponent(JSON.stringify(query))),
        json: true
    }, function (error, response, activityUsers) {
        if (!error && (response.statusCode == 200)) {
            if (_.isEmpty(activityUsers)) {
                callBackFn(error, null);
            } else {
                callBackFn(null, activityUsers);
            }
        } else {
            callBackFn(error, null);
        }
    });
}