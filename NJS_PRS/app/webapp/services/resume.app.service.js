/**
 * Created by hfjylzh on 2/20/2017.
 */

'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');
var suggest = require('../../../config/h/suggest');

exports.getResume = getResume;
exports.upsertResume = upsertResume;
exports.calCompleteScore = calCompleteScore;
exports.getNext = getNext;

function calCompleteScore(resume){
    var education = !_.isEmpty(resume.education)? 20:0,
        family = !_.isEmpty(resume.family)? 5:0,
        prize = !_.isEmpty(resume.prize)? 5:0,
        strength = !_.isEmpty(resume.strength)? 5:0,
        project = !_.isEmpty(resume.project)? 10:0,
        work = !_.isEmpty(resume.work)? 15:0,
        icon = !_.isEmpty(resume.icon)? 5:0,
        basic = !_.isEmpty(resume.name)? 30:0,
        certificate = !_.isEmpty(resume.certificate)? 5:0;
    return education+family+prize+strength+project+work+icon+basic+certificate;
}

function getNext(resume){
    if(_.isEmpty(resume.name)) return 'basicInfo';
    if(_.isEmpty(resume.education)) return 'educationalBackground';
    if(_.isEmpty(resume.family)) return 'family';
    if(!_.isEmpty(resume.experience) && resume.experience !== '应届毕业生') return 'workExperience';
}

function getResume(criteria, callback) {
    request.get({
        uri: config.url.dom + util.format(
            '/api/v1/Resume?query=%s&populate=education&populate=work&populate=project&populate=family&populate=certificate'
            , encodeURIComponent(JSON.stringify(criteria))),
        json: true
    }, function (error, response, result) {
        if(error) callback(error, null);
        if (result) {
            callback(null, result);
        }else{
            callback(null, null);
        }
    });
}

function upsertResume(resume, callBackFn){
    if(!_.isEmpty(resume._id)){
        resume.updated = new Date();
        request.put({
            baseUrl: config.url.dom,
            url: util.format('/api/v1/Resume/%s', resume._id),
            json: resume
        }, function (error, response, persistResume) {
            if (!error && (response.statusCode == 200)) {
                if (_.isEmpty(persistResume)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistResume);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }else {
        resume.updated = new Date();
        resume.created = new Date();
        request.post({
            baseUrl: config.url.dom,
            url: '/api/v1/Resume',
            json: resume
        }, function (error, response, persistResume) {
            if (!error && (response.statusCode == 201)) {
                if (_.isEmpty(persistResume)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistResume);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }
}