/**
 * Created by CHENLA2 on 10/27/2016.
 */
'use strict';


var request = require('request'),
    async = require('async'),
    util = require('util'),
    _ = require('lodash'),
    config = require('../../../config/config');

exports.focusClub = focusClub;
exports.getMyClubs = getMyClubs;
exports.registerActivityInfo = registerActivityInfo;
exports.saveRegisterActivityInfo = saveRegisterActivityInfo;
exports.getClubsWithCriteria = getClubsWithCriteria;
exports.getActivityWithCriteria = getActivityWithCriteria;
exports.getCommonUserWithCriteria = getCommonUserWithCriteria;

function getActivityWithCriteria(criteria, callBackFn) {
    request.get({
        baseUrl: config.url.dom,
        url: util.format('/api/v1/clubactivity?query=%s&populate=club', encodeURIComponent(JSON.stringify(criteria))),
        json: true
    }, function (error, response, body) {
        if (!error && (response.statusCode == 200)) {
            callBackFn(null, body);
        } else {
            var errorObj = {functionName: 'getActiviityWithCriteria', errorMsg: "no such data"};
            callBackFn(errorObj, null);
        }
    });
}

var setDefaultValueForClubs = function (clubs) {
    _.forEach(clubs, function (club) {
        _.set(club, 'icon', _.get(club, 'icon', ''));
        club.captain = _.get(club, 'captain', '');
        club.clubId = _.get(club, 'clubId', '');
        club.name = _.get(club, 'name', '');
        club.status = _.get(club, 'status', '');
        club.introduce = _.get(club, 'introduce', '');
        club.createDateTime = _.get(club, 'createDateTime', '');
        club.createBy = _.get(club, 'createBy', '');
        club.updateDateTime = _.get(club, 'updateDateTime', '');
        club.updateBy = _.get(club, 'updateBy', '');
        club.description = _.get(club, 'description', '');
        club._id = _.get(club, '_id', '');
    });
    return clubs;
};

function getClubsWithCriteria(criteria, callBackFn) {
    request.get({
        baseUrl: config.url.dom,
        url: util.format('/api/v1/recreationclub?query=%s', encodeURIComponent(JSON.stringify(criteria))),
        json: true
    }, function (error, response, clubs) {
        if (!error && (response.statusCode == 200) && (!!clubs && clubs.length > 0)) {
            callBackFn(null, setDefaultValueForClubs(clubs));
        } else {
            var errorObj = {functionName: 'getClubsWithCriteria', errorMsg: "no such data"};
            callBackFn(errorObj, null);
        }
    });
}

function getCommonUserWithCriteria(criteria, callBackFn) {
    request.get({
        baseUrl: config.url.dom,
        url: util.format('/api/v1/commonuser?query=%s&populate=favouriteClub', encodeURIComponent(JSON.stringify(criteria))),
        json: true
    }, function (error, response, body) {
        if (!error && (response.statusCode == 200)) {
            callBackFn(null, body);
        } else {
            var errorObj = {functionName: 'getCommonUserWithCriteria', errorMsg: "no such data"};
            callBackFn(errorObj, null);
        }
    });
}

var getMyFocusClubs = function (query) {
    return function (asyncCallBack) {
        var getMyFocusClubsQuery = {openId: _.get(query, 'openId', '')};
        getCommonUserWithCriteria(getMyFocusClubsQuery, asyncCallBack);
    }
};

var getPublishedClubs = function () {
    return function (asyncCallBack) {
        getClubsWithCriteria({status: '已发布'}, asyncCallBack);
    }
};

function getMyClubs(query, callBackFn){

    var tasks = [];
    tasks.push(function (asyncCallBack) {
        var criteria = {openId: _.get(query, 'openId', '')};
        request.get({
            baseUrl: config.url.dom,
            url: util.format('/api/v1/commonuser?query=%s&populate=favouriteClub', encodeURIComponent(JSON.stringify(criteria))),
            json: true
        }, function (error, response, body) {
            if (!error && (response.statusCode == 200)) {
                var commonuser = body[0];
                commonuser.favouriteClub = setDefaultValueForClubs(_.get(commonuser,'favouriteClub', []));
                asyncCallBack(null, commonuser);
            } else {
                var errorObj = {functionName: 'getCommonUserWithCriteria', errorMsg: "no such data"};
                asyncCallBack(errorObj, null);
            }
        });
    });
    tasks.push(function (asyncCallBack) {
        var criteria = {status: '已发布'};
        request.get({
            baseUrl: config.url.dom,
            url: util.format('/api/v1/recreationclub?query=%s', encodeURIComponent(JSON.stringify(criteria))),
            json: true
        }, function (error, response, clubs) {
            if (!error && (response.statusCode == 200) && (!!clubs && clubs.length > 0)) {
                asyncCallBack(null, setDefaultValueForClubs(clubs));
            } else {
                var errorObj = {functionName: 'getClubsWithCriteria', errorMsg: "no such data"};
                asyncCallBack(errorObj, null);
            }
        });
    });

    async.parallel(tasks, function (err, result) {
        if (err) {
            var errorObj = {functionName: 'forgotPassword', errorMsg: err};
            callBackFn(errorObj, null)
        }
        var myFocusClubIds = _.map(result[0].favouriteClub, '_id');
        var allClubIds = _.map(result[1], '_id');
        var allClubs = result[1];
        var notFocusClubIds = _.xor(_.intersection(myFocusClubIds, allClubIds), allClubIds);
        var notFocusClubs = _.filter(allClubs, function (club) {
            return notFocusClubIds.indexOf(club._id) > -1;
        });
        var finalResult = {
            myFocusClubs: result[0],
            notFocusClubs: notFocusClubs
        };
        callBackFn(null, finalResult);
    });
}

function focusClub(clubId,callBackFn) {
    request.get({
        baseUrl: config.url.dom,
        uri: util.format('/api/focusClub/%s', encodeURIComponent(clubId)),
        json: true
    }, function (error, response, body) {
        if (!error && (response.statusCode == 200) && body) {
            console.log(body);
            callBackFn(null, body);
        } else {
            var errorObj = {functionName: 'focusClub', errorMsg: "no such data"};
            callBackFn(errorObj, null);
        }
    })
}

function registerActivityInfo(activityId, callBackFn) {
    // TODO: Lambert : here is duumy user data in David's MongoDB
    var commonUserId = '583e98fc1db02b64daed522e';
    var query = {
        activityId: activityId,
        commonUserId: commonUserId
    };
    request.post({
        baseUrl: config.url.dom,
        uri: util.format('/api/registerActivity'),
        body: query,
        json: true
    }, function (error, response, body) {
        if (!error && (response.statusCode == 200) && body) {
            console.log(body);
            var ActivityUser = {
                commonUser: '583e98fc1db02b64daed522e',
                activity: activityId,
                fields: []
            };
            _.forEach(body, function (signupField) {
                ActivityUser.fields.push({
                    fieldKey: _.get(signupField, 'fieldKey', ''),
                    fieldName: _.get(signupField, 'fieldName', ''),
                    fieldValue: _.get(signupField, 'fieldValue', '')
                });
            });
            callBackFn(null, ActivityUser);
        } else {
            var errorObj = {functionName: 'registerActivityInfo', errorMsg: "no such data"};
            callBackFn(errorObj, null);
        }
    })
}

function saveRegisterActivityInfo(info, callBackFn) {
    console.log("==PRS:saveRegisterActivityInfo " + info);
    request.post({
        baseUrl: config.url.dom,
        uri: util.format('/api/saveRegisterActivity'),
        body: info,
        json: true
    }, function (error, response, body) {
        if (!error && (response.statusCode == 200) && body) {
            console.log(body);
            callBackFn(null, body);
        } else {
            var errorObj = {functionName: 'saveRegisterActivityInfo', errorMsg: "no such data"};
            callBackFn(errorObj, null);
        }
    })
}
