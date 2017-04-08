'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');
var http = require('http');

exports.findForLogin = findForLogin;
exports.create = create;
exports.findUsers = findUsers;
exports.deleteUser = deleteUser;
exports.synUserToH5ByWS = synUserToH5ByWS;
exports.getUser = getUser;

function findForLogin(user, callBackFn) {
    request.post({
        baseUrl: config.url.dom,
        url: util.format('/api/user/login'),
        json: user
    }, function (error, response, result) {
        if (!error && (response.statusCode == 200)) {
            callBackFn(null, result);
        } else {
            callBackFn({ message: response.body.message }, null);
        }
    });
}

function create(user, callBackFn) {
    request.post({
        baseUrl: config.url.dom,
        url: util.format('/api/user'),
        json: user
    }, function (error, response, result) {
        if (!error && (response.statusCode == 200)) {
            callBackFn(null, result);
        } else {
            callBackFn({ message: response.body.message }, null);
        }
    });
}

function findUsers(criteria, callBackFn) {
    request.get({
        uri: config.url.dom + util.format('/api/v1/loginuser?query=%s&sort=-updated', encodeURIComponent(JSON.stringify(criteria))),
        json: true
    }, function (error, response, users) {
        if (!error && (response.statusCode == 200)) {
            if (_.isEmpty(users)) {
                callBackFn(error, null);
            } else {
                callBackFn(null, users);
            }
        } else {
            callBackFn(error, null);
        }
    });
}

function deleteUser(userId, callBackFn) {
    request.del({
        baseUrl: config.url.dom,
        url: util.format('/api/v1/loginuser/%s', userId),
        json: true
    }, function (error, response, body) {
        if (!error && (response.statusCode == 204)) {
            return callBackFn(null, null);
        } else {
            return callBackFn(error, null);
        }
    });
}

function synUserToH5ByWS(user){
    var options = {
        host: config.url.h5.host,
        port: config.url.h5.port? config.url.h5.port : '',
        path: '/user/register',
        method: 'POST',
        maxPostSize: 0,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {});
    });
    user.isfromRC = true;
    req.write(JSON.stringify(user));
    req.end();
}

function getUser(data, callBackFn) {
    request.post({
        baseUrl: config.url.dom,
        url: util.format('/api/getUser'),
        json: data
    }, function (error, response, result) {
        if (!error && (response.statusCode == 200)) {
            callBackFn(null, result);
        } else {
            callBackFn({ message: response.body.message }, null);
        }
    });
}