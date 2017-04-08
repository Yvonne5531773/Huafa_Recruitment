/**
 * Created by hfjylzh on 2/20/2017.
 */

'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');
var suggest = require('../../../config/h/suggest');

exports.deleteEducation = deleteEducation;
exports.upsertEducation = upsertEducation;

function upsertEducation(education, callBackFn){
    if(!_.isEmpty(education._id)){
        education.updated = new Date();
        request.put({
            baseUrl: config.url.dom,
            url: util.format('/api/v1/Education/%s', education._id),
            json: education
        }, function (error, response, persistEducation) {
            if (!error && (response.statusCode == 200)) {
                if (_.isEmpty(persistEducation)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistEducation);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }else {
        education.updated = new Date();
        education.created = new Date();
        request.post({
            baseUrl: config.url.dom,
            url: '/api/v1/Education',
            json: education
        }, function (error, response, persistEducation) {
            if (!error && (response.statusCode == 201)) {
                if (_.isEmpty(persistEducation)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistEducation);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }
}

function deleteEducation(_id, callback) {
    request.del({
        baseUrl: config.url.dom,
        url: util.format('/api/v1/Education/%s', _id),
        json: true
    }, function (error, response, body) {
        if (!error) {
            return callback(null, null);
        } else {
            return callback(error, null);
        }
    });
}