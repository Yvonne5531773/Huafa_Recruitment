'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');

exports.findClubActivitys = findClubActivitys;
exports.upsertClubActivity = upsertClubActivity;
exports.deleteClubActivity = deleteClubActivity;

function findClubActivitys(criteria, callBackFn) {
    var query = {};
    if(!_.isEmpty(_.result(criteria, 'location'))){
        query.location ={'$regex':'^('+criteria.location+')'};
    }
    if(!_.isEmpty(_.result(criteria, 'club'))){
        query.club =criteria.club;
    }
    request.get({
        uri: config.url.dom + util.format('/api/v1/ClubActivity?query=%s&populate=[{"path":"club"},{"path":"signupField"}]', encodeURIComponent(JSON.stringify(query))),
        json: true
    }, function (error, response, clubs) {
        if (!error && (response.statusCode == 200)) {
            if (_.isEmpty(clubs)) {
                callBackFn(error, null);
            } else {
                callBackFn(null, clubs);
            }
        } else {
            callBackFn(error, null);
        }
    });
}

function upsertClubActivity(club, callBackFn){
    if(!_.isEmpty(club._id)){
        request.put({
            baseUrl: config.url.dom,
            url: util.format('/api/v1/ClubActivity/%s', club._id),
            json: club
        }, function (error, response, persistClub) {
            if (!error && (response.statusCode == 200)) {
                if (_.isEmpty(persistClub)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistClub);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }else {
        request.post({
            baseUrl: config.url.dom,
            url: '/api/v1/ClubActivity',
            json: club
        }, function (error, response, persistClub) {
            if (!error && (response.statusCode == 201)) {
                if (_.isEmpty(persistClub)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistClub);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }
}

function deleteClubActivity(clubId, callBackFn){
    request.del({
        baseUrl: config.url.dom,
        url: util.format('/api/v1/ClubActivity/%s', clubId),
        json: true
    }, function (error, response, body) {
        if (!error && (response.statusCode == 204)) {
            return callBackFn(null, null);
        } else {
            return callBackFn(error, null);
        }
    });
}