/**
 * Created by hfjylzh on 2/20/2017.
 */

'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');
var suggest = require('../../../config/h/suggest');

exports.upsertFamily = upsertFamily;
exports.deleteFamily = deleteFamily;

function upsertFamily(family, callBackFn){
    if(!_.isEmpty(family._id)){
        family.updated = new Date();
        request.put({
            baseUrl: config.url.dom,
            url: util.format('/api/v1/Family/%s', family._id),
            json: family
        }, function (error, response, persistFamily) {
            if (!error && (response.statusCode == 200)) {
                if (_.isEmpty(persistFamily)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistFamily);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }else {
        family.updated = new Date();
        family.created = new Date();
        request.post({
            baseUrl: config.url.dom,
            url: '/api/v1/Family',
            json: family
        }, function (error, response, persistFamily) {
            if (!error && (response.statusCode == 201)) {
                if (_.isEmpty(persistFamily)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistFamily);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }
}

function deleteFamily(_id, callback) {
    request.del({
        baseUrl: config.url.dom,
        url: util.format('/api/v1/Family/%s', _id),
        json: true
    }, function (error, response, body) {
        if (!error) {
            return callback(null, null);
        } else {
            return callback(error, null);
        }
    });
}