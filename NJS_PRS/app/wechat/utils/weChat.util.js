'use strict';

var request = require('request');
var _ = require('lodash');
var async = require('async');

exports.getAccessToken = getAccessToken;
exports.getUserInfo = getUserInfo;

function getAccessToken() {
    var corpId = 'wx0655e3fe5574fa9b';
    var corpSecret = 'ucvJB2i75K4K2HOI7z18EUIeF_t1VHTlfCbSFtb4ez_mo9QSuqnxi_0o5j6iYwkH';
    var url = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=' + corpId + '&corpsecret=' + corpSecret;
    request.get({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode == 200 && !_.isEmpty(body) && _.isEmpty(body.errmsg)) {
            var access_token = _.get(body, ['access_token'], '');
            console.log('access_token: ' + access_token);
            if (!_.isEmpty(access_token)) {
                global.accessToken = access_token;
            }
        } else {
            var errmsg = { errmsg: _.get(body, ['errmsg'], ''), error: error, statusCode: response.statusCode };
            console.log('cannot get access token : ' + JSON.stringify(errmsg));
        }
    });
}

function getUserInfo(code, callback) {
    if (_.isEmpty(code)) {
        return callback(null, {});
    }
    async.waterfall([
        function (cb) {
            var url = 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=' + global.accessToken + '&code=' + code;
            request.get({
                url: url,
                json: true
            }, function (error, response, body) {
                if (!error && response.statusCode == 200 && !_.isEmpty(body) && _.isEmpty(body.errmsg)) {
                    return cb(null, body.UserId);
                } else {
                    return cb('can not get user id', {});
                }
            })
        },
        function (userId, cb) {
            if(_.isEmpty(userId)){
                return cb('user id is empty', {});
            }
            var url = 'https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=' + global.accessToken + '&userid=' + userId;
            request.get({
                url: url,
                json: true
            }, function (error, response, body) {
                if (!error && response.statusCode == 200 && !_.isEmpty(body) && body.errmsg == 'ok') {
                        var userInfo = {};
                        userInfo.userId = userId;
                        userInfo.name = _.get(body, ['name'], ''),
                        userInfo.department = _.get(body, ['department'], []),
                        userInfo.position = _.get(body, ['position'], ''),
                        userInfo.mobile = _.get(body, ['mobile'], ''),
                        userInfo.gender = _.get(body, ['gender'], ''),
                        userInfo.email = _.get(body, ['email'], ''),
                        userInfo.weixinid = _.get(body, ['weixinid'], '');
                        cb(null, userInfo);
                } else {
                    console.log('cannot get user information');
                    cb(null, {});
                }
            })
        }
    ], function (err, userInfo) {
        if(err){
             console.error(JSON.stringify(err));    
             return callback(null, {});
        }
        return callback(null, userInfo);
    });
}