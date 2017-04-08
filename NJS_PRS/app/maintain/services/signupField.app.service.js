/**
 * Created by SUKE3 on 11/22/2016.
 */
'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');

exports.findSignupFields = findSignupFields;
exports.upsertSignupField = upsertSignupField;
exports.deleteSignupField = deleteSignupField;

function findSignupFields(criteria, callBackFn) {
    console.log('prs.app.signupservice');
    request.get({
        uri: config.url.dom + util.format('/api/v1/signupfield?query=%s', encodeURIComponent(JSON.stringify(criteria))),
        json: true
    }, function (error, response, fields) {
        if (!error && (response.statusCode == 200)) {
            if (_.isEmpty(fields)) {
                callBackFn(error, null);
            } else {
                callBackFn(null, fields);
            }
        } else {
            callBackFn(error, null);
        }
    });
}

function upsertSignupField(field, callBackFn){
    if(!_.isEmpty(field._id)){
        request.put({
            baseUrl: config.url.dom,
            url: util.format('/api/v1/signupfield/%s', field._id),
            json: field
        }, function (error, response, persistField) {
            if (!error && (response.statusCode == 200)) {
                if (_.isEmpty(persistField)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistField);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }else {
        request.post({
            baseUrl: config.url.dom,
            url: '/api/v1/SignupField',
            json: field
        }, function (error, response, persistField) {
            if (!error && (response.statusCode == 201)) {
                if (_.isEmpty(persistField)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistField);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }
}

function deleteSignupField(fieldId, callBackFn){
    console.log(fieldId);
    request.del({
        baseUrl: config.url.dom,
        url: util.format('/api/v1/signupfield/%s', fieldId),
        json: true
    }, function (error, response, body) {
        if (!error && (response.statusCode == 204)) {
            return callBackFn(null, null);
        } else {
            return callBackFn(error, null);
        }
    });
}