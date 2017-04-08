'use strict';


var request = require('request'),
    util = require('util'),
    _ = require('lodash'),
    async = require('async'),
    config = require('../../../config/config');

exports.updateCommonUserByUserInfo = updateCommonUser;

function updateCommonUser(userInfo, callback) {
    if (_.isEmpty(userInfo)) {
        return;
    }
    async.waterfall([
        function (cb) {
            var criteria = {
                userId: userInfo.userId
            }
            request.get({
                baseUrl: config.url.dom,
                url: util.format('/api/v1/commonuser?query=%s&limit=1', encodeURIComponent(JSON.stringify(criteria))),
                json: true
            }, function (error, response, body) {
                if (!error && (response.statusCode == 200)) {
                    cb(null, body);
                } else {
                    var errorObj = { functionName: 'getCommonUserWithCriteria', errorMsg: "no such data" };
                    cb(errorObj, null);
                }
            });
        },
        function (commonUser, cb) {
            if (_.isEmpty(commonUser)) {
                commonUser = {
                    'userId': userInfo.userId,
                    'name': userInfo.name,
                    'department': _.toString(userInfo.department),
                    'wechat': userInfo.weixinid,
                    'telNum': userInfo.mobile
                }
                request.post({
                    baseUrl: config.url.dom,
                    url: '/api/v1/commonuser',
                    json: commonUser
                }, function (error, response, commonUser) {
                    if (error) {
                        return cb(error, null);
                    }
                    if (_.isEmpty(commonUser)) {
                        return cb(error, null);
                    } else {
                        return cb(null, commonUser);
                    }
                });
            } else {
                commonUser = commonUser[0];
                commonUser.userId = userInfo.userId;
                commonUser.name = userInfo.name;
                commonUser.department = _.toString(userInfo.department);
                commonUser.wechat = userInfo.weixinid;
                commonUser.telNum = userInfo.mobile;
                request.put({
                    baseUrl: config.url.dom,
                    url: util.format('/api/v1/commonuser/%s', commonUser._id),
                    json: commonUser
                }, function (error, response, commonUser) {
                    if (error) {
                        return cb(error, null);
                    }
                    if (_.isEmpty(commonUser)) {
                        return cb(error, null);
                    } else {
                        return cb(null, commonUser);
                    }
                });
            }

        }
    ], function (err, commonUser) {
        if (err) {
            console.error(JSON.stringify(err));
            return callback(null, {});
        }
        return callback(null, commonUser);
    });
}