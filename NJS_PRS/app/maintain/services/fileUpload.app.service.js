/**
 * Created by lica4 on 11/20/2016.
 */
'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');
var http = require('http');
var image = require('images');

exports.fileUpload = function(data, callback){
    console.log('in fileUpload data',data)
    var obj = {},
        saveName = '',
        thumbName = '',
        file;
    if(_.isEmpty(data.userid)) callback({err: 'no login'}, null);
    if(!_.isEmpty(data.file)) file = data.file[0];
    else if(!_.isEmpty(data.headPic)) file = data.headPic;
    obj.createUser = data.userid;
    if(file) {
        var fileThumbStr = file.path.substr(0, file.path.indexOf(".")).concat("_thumb.").concat(file.type.substr(file.type.indexOf("/")+1, file.type.length));
        image(file.path).resize(115, 115).save(fileThumbStr);
        if (file.path.indexOf('\\') !== -1) {
            saveName = file.path.substr(file.path.lastIndexOf("\\") + 1, file.path.length);
            thumbName = fileThumbStr.substr(fileThumbStr.lastIndexOf("\\") + 1, fileThumbStr.length);
        } else if (file.path.indexOf('/') !== -1) {
            saveName = file.path.substr(file.path.lastIndexOf("/") + 1, file.path.length);
            thumbName = fileThumbStr.substr(fileThumbStr.lastIndexOf("/") + 1, fileThumbStr.length);
        }
        obj.fileSrc = config.upload.dir.indexOf('public/')>=0?config.upload.dir.substr(config.upload.dir.indexOf('/') + 1)+saveName:config.upload.dir+saveName;
        obj.fileThumbSrc = config.upload.dir.indexOf('public/')>=0?config.upload.dir.substr(config.upload.dir.indexOf('/') + 1)+thumbName:config.upload.dir+thumbName;
        request.post({
            baseUrl: config.url.dom,
            url: util.format('/api/v1/Upfile'),
            json: obj
        }, function (error, response, result) {
            console.log('in fileUpload result', result)
            if(error) callback(error, null);
            if (result) {
                callback(null, result);
            }else{
                callback(null, null);
            }
        });
    }
}

exports.getUpfiles = function(criteria, callback){
    request.get({
        uri: config.url.dom + util.format('/api/v1/Upfile?query=%s&sort=-_id', encodeURIComponent(JSON.stringify(criteria))),
        json: true
    }, function (error, response, upfiles) {
        console.log('in getUpfiles upfiles', upfiles)
        if (!error && (response.statusCode == 200)) {
            if (_.isEmpty(upfiles)) {
                callback(error, null);
            } else {
                callback(null, upfiles);
            }
        }else{
            callback(error, null);
        }
    });
}

exports.deleteUpfiles = function(data, callback){
    request.post({
        baseUrl: config.url.dom,
        url: util.format('/api/deleteUpfiles'),
        json: data
    }, function (error, response, result) {
        if(error) callback(error, null);
        if (result) {
            callback(null, result);
        }else{
            callback(null, null);
        }
    });
}

