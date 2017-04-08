'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');

exports.getPositions = getPositions;
exports.upsertPosition = upsertPosition;
exports.deletePosition = deletePosition;
exports.publishJob = publishJob;
exports.stopPublishJob = stopPublishJob;

function getPositions(criteria, callBackFn) {
    var query = criteria;
    if(!_.isEmpty(_.result(criteria, 'name'))){
        query.name ={'$regex':'^('+criteria.name+')'};
    }
    request.get({
        uri: config.url.dom + util.format('/api/v1/Position?query=%s&sort=-_id', encodeURIComponent(JSON.stringify(query))),
        json: true
    }, function (error, response, positions) {
        if (!error && (response.statusCode == 200)) {
            if (_.isEmpty(positions)) {
                callBackFn(error, null);
            } else {
                callBackFn(null, positions);
            }
        } else {
            callBackFn(error, null);
        }
    });
}

function upsertPosition(position, callBackFn){
    if(!_.isEmpty(position._id)){
        request.put({
            baseUrl: config.url.dom,
            url: util.format('/api/v1/Position/%s', position._id),
            json: position
        }, function (error, response, persistPosition) {
            if (!error && (response.statusCode == 200)) {
                if (_.isEmpty(persistPosition)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistPosition);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }else {
        request.post({
            baseUrl: config.url.dom,
            url: '/api/v1/Position',
            json: position
        }, function (error, response, persistPosition) {
            if (!error && (response.statusCode == 201)) {
                if (_.isEmpty(persistPosition)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistPosition);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }
}

function deletePosition(positionId, callBackFn){
    request.del({
        baseUrl: config.url.dom,
        url: util.format('/api/v1/Position/%s', positionId),
        json: true
    }, function (error, response, body) {
        if (!error && (response.statusCode == 204)) {
            return callBackFn(null, null);
        } else {
            return callBackFn(error, null);
        }
    });
}

function publishJob(criteria, callBackFn){
    request.put({
        baseUrl: config.url.dom,
        url: util.format('/api/position/publish'),
        json: criteria
    }, function (error, response, body) {
        if (!error && (response.statusCode == 204)) {
            return callBackFn(null, null);
        } else {
            return callBackFn(error, null);
        }
    });
}

function stopPublishJob(criteria, callBackFn){
    request.put({
        baseUrl: config.url.dom,
        url: util.format('/api/position/stopPublish'),
        json: criteria
    }, function (error, response, body) {
        if (!error && (response.statusCode == 204)) {
            return callBackFn(null, null);
        } else {
            return callBackFn(error, null);
        }
    });
}