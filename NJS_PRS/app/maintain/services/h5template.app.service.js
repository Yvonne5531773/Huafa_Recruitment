/**
 * Created by lica4 on 11/20/2016.
 */
'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');
var http = require('http');
var shortid = require('shortid');

exports.getH5TemplatesByUser = function(data, callback){
    request.post({
        baseUrl: config.url.dom,
        url: util.format('/api/getH5TemplatesByUser'),
        json: data
    }, function (error, response, result) {
        if(error) callback(error, null);
        if (result && result.code === 200) {
            callback(null, result);
        }else{
            callback(null, null);
        }
    });
}

exports.selectTemplateById = function(data, callback){
    request.post({
        baseUrl: config.url.dom,
        url: util.format('/api/selectTemplateById'),
        json: data
    }, function (error, response, result) {
        if(error) callback(error, null);
        if (result && result.code === 200) {
            callback(null, result);
        }else{
            callback(null, null);
        }
    });
}

exports.deleteTemplateById = function(data, callback){
    request.post({
        baseUrl: config.url.dom,
        url: util.format('/api/deleteTemplateById'),
        json: data
    }, function (error, response, result) {
        if(error) callback(error, null);
        if (result && result.code === 200) {
            callback(null, result);
        }else{
            callback(null, null);
        }
    });
}

exports.getH5Url = function(callback){
    var _id = shortid.generate() + 'RC';
    var h5 = {};
    h5._id = _id;
    h5.url = util.format(config.url.h5.url) + _id + '?pageId=1';
    callback(null, h5);
}

exports.synUserToLoginH5ByWS = function(user){
    var options = {
        host: config.url.h5.host,
        port: config.url.h5.port? config.url.h5.port : '',
        path: '/user/login',
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
    user.username = user.userid;
    user.isfromRC = true;
    req.write(JSON.stringify(user));
    req.end();
}

exports.synToCreateH5ByWS = function(data){
    var options = {
        host: config.url.h5.host,
        port: config.url.h5.port? config.url.h5.port : '',
        path: '/scene/addScene',
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
    var h5data = {};
    h5data._id = data.h5Id;
    h5data.isfromRC = true;
    h5data.createUser = data.user.userid;
    req.write(JSON.stringify(h5data));
    req.end();
}