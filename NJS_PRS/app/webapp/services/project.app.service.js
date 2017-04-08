/**
 * Created by hfjylzh on 2/20/2017.
 */

'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');
var suggest = require('../../../config/h/suggest');

exports.upsertProject = upsertProject;
exports.deleteProject = deleteProject;

function upsertProject(project, callBackFn){
    if(!_.isEmpty(project._id)){
        project.updated = new Date();
        request.put({
            baseUrl: config.url.dom,
            url: util.format('/api/v1/Project/%s', project._id),
            json: project
        }, function (error, response, persistProject) {
            if (!error && (response.statusCode == 200)) {
                if (_.isEmpty(persistProject)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistProject);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }else {
        project.updated = new Date();
        project.created = new Date();
        request.post({
            baseUrl: config.url.dom,
            url: '/api/v1/Project',
            json: project
        }, function (error, response, persistProject) {
            if (!error && (response.statusCode == 201)) {
                if (_.isEmpty(persistProject)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistProject);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }
}

function deleteProject(_id, callback) {
    request.del({
        baseUrl: config.url.dom,
        url: util.format('/api/v1/Project/%s', _id),
        json: true
    }, function (error, response, body) {
        if (!error) {
            return callback(null, null);
        } else {
            return callback(error, null);
        }
    });
}