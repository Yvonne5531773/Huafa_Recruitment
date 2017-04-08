/**
 * Created by hfjylzh on 2/20/2017.
 */

'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');

exports.checkUsername = checkUsername;
exports.checkApplicant = checkApplicant;
exports.create = create;

function checkUsername(criteria, callback) {
    request.get({
        uri: config.url.dom + util.format('/api/v1/Applicant?query=%s&populate=resume&populate=collected.position&populate=applied.position', encodeURIComponent(JSON.stringify(criteria))),
        json: true
    }, function (error, response, applicant) {
        if (!error && (response.statusCode == 200)) {
            if (!_.isEmpty(applicant)) {
                callback(null, applicant);
            } else {
                callback(null, null);
            }
        } else {
            callback(error, null);
        }
    });
}

function checkApplicant(criteria, callback) {
    request.post({
        uri: config.url.dom + util.format('/api/applicant/checkApplicant'),
        json: criteria
    }, function (error, response, result) {
        if (response.statusCode == 200){
            if (!_.isEmpty(result)) {
                callback(null, result);
            } else {
                callback(null, null);
            }
        } else {
            callback(result.message, null);
        }
    });
}

function create(applicant, callBackFn) {
    request.post({
        baseUrl: config.url.dom,
        url: util.format('/api/applicant'),
        json: applicant
    }, function (error, response, result) {
        if (!error && (response.statusCode == 200)) {
            callBackFn(null, result);
        } else {
            callBackFn(null, null);
        }
    });
}