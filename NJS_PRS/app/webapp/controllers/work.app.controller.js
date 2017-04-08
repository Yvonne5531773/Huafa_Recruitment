/**
 * Created by hfjylzh on 2/20/2017.
 */

'use strict';

var resumeService = require('../services/resume.app.service');
var workService = require('../services/work.app.service');
var applicantService = require('../services/applicant.app.service');
var _ = require('lodash');
var moment = require('moment');
var async = require('async');
var url = require('url');

exports.upsertWork = upsertWork;
exports.deleteWork = deleteWork;


function upsertWork(req, res, next){
    if (!req.session.applicant) {
        return res.status(400).json({err: 'no login'});
    }
    var work = req.body,
        applicant = req.session.applicant;
    async.waterfall(
        [
            function(callback) {
                workService.upsertWork(work, function(err, result) {
                    if (err) {
                        callback(null, {});
                    } else {
                        callback(null, result)
                    }
                });
            },
            function(obj, callback) {
                if(!_.isEmpty(obj)) {
                    var resume = applicant.resume;
                    if(_.isEmpty(resume)){
                        resume = {}, resume.work = [];
                    }else if(_.isUndefined(resume.work)||_.isEmpty(resume.work)) resume.work = [];
                    if(-1 === _.indexOf(resume.work, obj._id)) resume.work.push(obj._id);
                    callback(null, resume);
                }else callback(null, {});
            },
            function(obj, callback) {
                if(!_.isEmpty(obj)) {
                    resumeService.upsertResume(obj, function (err, result) {
                        if (err) callback(err, null);
                        else callback(null, {resume: result, work: obj.work});
                    });
                }
            }
        ],
        function(err, result){
            var resume = result.resume;
            resume.work = result.work;
            if(err) return res.json({error: err});
            if(!_.isEmpty(result)) {
                if(_.isEmpty(applicant.resume)){
                    applicant.resume = resume._id;
                    applicantService.create(applicant, function(err, applicant){
                        if(err) return res.json({error:'save error'});
                    });
                }
                resume.completeScore = resumeService.calCompleteScore(resume);
                result.updated = moment(resume.updated).format('YYYY-MM-DD HH:mm');
                req.session.applicant.resume = resume;
                return res.json(resume);
            }
        }
    );
}

function deleteWork(req, res, next){
    var _id = req.body.id,
        resume = req.session.applicant.resume;
    async.waterfall(
        [
            function(callback){
                workService.deleteWork(_id, function(err, result){
                    if (err) {
                        callback(err, null);
                    }else{
                        callback(null, true);
                    }
                });
            },
            function(obj, callback){
                if(!obj) callback(null, null);
                else {
                    _.remove(resume.work, function(obj) { return obj === _id });
                    resumeService.upsertResume(resume, function(err, resume){
                        if(err) callback(err, null);
                        else{
                            callback(null, resume);
                        }
                    });
                }
            }
        ],function(err, result){
            if(err) return res.json({error: err});
            if(!_.isEmpty(result)) {
                result.completeScore = resumeService.calCompleteScore(result);
                result.updated = moment(result.updated).format('YYYY-MM-DD HH:mm');
                req.session.applicant.result = result;
                return res.json(result);
            }
        }
    );

}