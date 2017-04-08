/**
 * Created by hfjylzh on 2/20/2017.
 */

'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');
var suggest = require('../../../config/h/suggest');

exports.upsertWork = upsertWork;
exports.deleteWork = deleteWork;

function upsertWork(work, callBackFn){
    if(!_.isEmpty(work._id)){
        work.updated = new Date();
        request.put({
            baseUrl: config.url.dom,
            url: util.format('/api/v1/Work/%s', work._id),
            json: work
        }, function (error, response, persistWork) {
            if (!error && (response.statusCode == 200)) {
                if (_.isEmpty(persistWork)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistWork);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }else {
        work.updated = new Date();
        work.created = new Date();
        request.post({
            baseUrl: config.url.dom,
            url: '/api/v1/Work',
            json: work
        }, function (error, response, persistWork) {
            if (!error && (response.statusCode == 201)) {
                if (_.isEmpty(persistWork)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistWork);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }
}

function deleteWork(_id, callback) {
    request.del({
        baseUrl: config.url.dom,
        url: util.format('/api/v1/Work/%s', _id),
        json: true
    }, function (error, response, body) {
        if (!error) {
            return callback(null, null);
        } else {
            return callback(error, null);
        }
    });
}