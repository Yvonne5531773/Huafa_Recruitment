'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');

exports.getDictionarys = getDictionarys;
exports.upsertDictionary = upsertDictionary;
exports.deleteDictionary = deleteDictionary;

function getDictionarys(criteria, callBackFn) {
    // var query = {};
    // if(!_.isEmpty(_.result(criteria, 'category'))){
    //     query.category ={'$regex':'^('+criteria.category+')'};
    // }
    request.get({
        uri: config.url.dom + util.format('/api/v1/Dictionary?query=%s&sort=-_id', encodeURIComponent(JSON.stringify(criteria))),
        json: true
    }, function (error, response, dictionarys) {
        if (!error && (response.statusCode == 200)) {
            if (_.isEmpty(dictionarys)) {
                callBackFn(error, null);
            } else {
                callBackFn(null, dictionarys);
            }
        } else {
            callBackFn(error, null);
        }
    });
}

function upsertDictionary(dictionary, callBackFn){
    if(!_.isEmpty(dictionary._id)){
        request.put({
            baseUrl: config.url.dom,
            url: util.format('/api/v1/Dictionary/%s', dictionary._id),
            json: dictionary
        }, function (error, response, persistDictionary) {
            if (!error && (response.statusCode == 200)) {
                if (_.isEmpty(persistDictionary)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistDictionary);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }else {
        request.post({
            baseUrl: config.url.dom,
            url: '/api/v1/Dictionary',
            json: dictionary
        }, function (error, response, persistDictionary) {
            if (!error && (response.statusCode == 201)) {
                if (_.isEmpty(persistDictionary)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistDictionary);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }
}

function deleteDictionary(dictionaryId, callBackFn){
    console.log('in deleteDictionary')
    request.del({
        baseUrl: config.url.dom,
        url: util.format('/api/v1/Dictionary/%s', dictionaryId),
        json: true
    }, function (error, response, body) {
        if (!error && (response.statusCode == 204)) {
            return callBackFn(null, null);
        } else {
            return callBackFn(error, null);
        }
    });
}