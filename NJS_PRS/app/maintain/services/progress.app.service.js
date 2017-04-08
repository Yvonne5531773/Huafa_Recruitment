'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');

exports.getProgress = getProgress;
exports.upsertProgress = upsertProgress;


function getProgress(criteria, callBackFn) {
    request.get({
        uri: config.url.dom + util.format('/api/v1/Progress?query=%s&populate=[{"path":"position"},{"path":"applicant"}]', encodeURIComponent(JSON.stringify(criteria))),
        json: true
    }, function (error, response, Progresses) {
        if (!error && (response.statusCode == 200)) {
            if (_.isEmpty(Progresses)) {
                callBackFn(error, null);
            } else {
                callBackFn(null, Progresses);
            }
        } else {
            callBackFn(error, null);
        }
    });
}

function upsertProgress(progress, callBackFn){
    if(!_.isEmpty(progress._id)){
        request.put({
            baseUrl: config.url.dom,
            url: util.format('/api/v1/Progress/%s', progress._id),
            json: progress
        }, function (error, response, persistProgress) {
            if (!error && (response.statusCode == 200)) {
                if (_.isEmpty(persistProgress)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistProgress);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }else {
        request.post({
            baseUrl: config.url.dom,
            url: '/api/v1/Progress',
            json: progress
        }, function (error, response, persistProgress) {
            if (!error && (response.statusCode == 201)) {
                if (_.isEmpty(persistProgress)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistProgress);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }
}
