/**
 * Created by hfjylzh on 2/20/2017.
 */

'use strict';

var resumeService = require('../services/resume.app.service');
var applicantService = require('../services/applicant.app.service');
var logger = require('../../../config/lib/logger');
var _ = require('lodash');
var moment = require('moment');
var async = require('async');
var url = require('url');
var qs = require('querystring');

exports.index = index;
exports.upsertResume = upsertResume;
exports.getResume = getResume;
exports.preview = preview;

function getResume(req, res, next){
    var criteria = req.body;
    resumeService.getResume(criteria, function(err, datas){
        if (err) {
            logger.error(err);
            return res.json({error: err});
        }else{
            return res.json(datas[0]);
        }
    });
}

function index(req, res, next) {
    var applicant = req.session.applicant;
    if (!applicant) {
        return res.render('./app/webapp/views/resume', { resume: {} });
    }else {
        async.waterfall(
            [
                function(callback) {
                    if (_.isEmpty(applicant.resume)) {
                        resumeService.upsertResume({resumename:applicant.username.substr(0, applicant.username.indexOf('@'))}, function(err, result){
                            callback(null, result);
                        });
                    }else {
                        resumeService.getResume({_id: applicant.resume._id}, function (err, resumes) {
                            if (err) {
                                callback(err, {});
                            } else {
                                callback(null, resumes[0])
                            }
                        });
                    }
                }
            ],
            function(err, result){
                if(err) return res.render('./app/webapp/views/resume', { resume: {} });
                result.completeScore = resumeService.calCompleteScore(result);
                result.next = resumeService.getNext(result);
                result.icon = result.icon ? result.icon : 'images/applicant_default.png';
                result.updated = moment(result.updated).format('YYYY-MM-DD HH:mm');
                result.birthed = !_.isEmpty(result.birthed)?moment(result.birthed).format('YYYY-MM-DD'):null;
                result.resumename = !_.isEmpty(result.resumename)?result.resumename:applicant.username.substr(0, applicant.username.indexOf('@'));
                res.render('./app/webapp/views/resume', {
                    applicant: applicant?applicant:{},
                    conditionResume: true,
                    resume: result
                });
            }
        );
    }
}

function upsertResume(req, res, next){
    if (!req.session.applicant) {
        return res.status(400).json({err: 'no login'});
    }
    var resume = req.body,
        applicant = req.session.applicant;
    resumeService.upsertResume(resume, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            if(_.isEmpty(applicant.resume)){
                applicant.resume = result._id;
                applicantService.create(applicant, function(err, applicant){
                    if(err)
                        return res.json({error:'save error'});
                });
            }
            result.completeScore = resumeService.calCompleteScore(result);
            result.next = resumeService.getNext(result);
            result.updated = moment(result.updated).format('YYYY-MM-DD HH:mm');
            req.session.applicant.resume = result;
            return res.json(result);
        }
    });
}

function preview(req, res, next){
    var _id = req.params._id,
        result = {};
    resumeService.getResume({_id: _id}, function(err, datas){
        if (err) {
            logger.error(err);
            return res.json({error: err});
        }else{
            result = datas[0];
            result.icon = result.icon ? result.icon : 'images/applicant_default.png';
            result.birthed = !_.isEmpty(result.birthed)?moment(result.birthed).format('YYYY-MM-DD'):null;
            result.resumename = !_.isEmpty(result.resumename)?result.resumename:applicant.username.substr(0, applicant.username.indexOf('@'));
            res.render('./app/webapp/views/resumePreview', {
                resume: result
            });
        }
    });
}