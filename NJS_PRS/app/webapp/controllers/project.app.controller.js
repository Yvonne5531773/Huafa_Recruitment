/**
 * Created by hfjylzh on 2/20/2017.
 */

'use strict';

var resumeService = require('../services/resume.app.service');
var projectService = require('../services/project.app.service');
var applicantService = require('../services/applicant.app.service');
var _ = require('lodash');
var moment = require('moment');
var async = require('async');
var url = require('url');

exports.upsertProject = upsertProject;
exports.deleteProject = deleteProject;


function upsertProject(req, res, next){
    if (!req.session.applicant) {
        return res.status(400).json({err: 'no login'});
    }
    var project = req.body,
        applicant = req.session.applicant;
    async.waterfall(
        [
            function(callback) {
                projectService.upsertProject(project, function(err, result) {
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
                        resume = {}, resume.project = [];
                    }else if(_.isUndefined(resume.project)||_.isEmpty(resume.project)) resume.project = [];
                    if(-1 === _.indexOf(resume.project,obj._id)) resume.project.push(obj._id);
                    callback(null, resume);
                }else callback(null, {});
            },
            function(obj, callback) {
                if(!_.isEmpty(obj)) {
                    resumeService.upsertResume(obj, function (err, result) {
                        if (err) callback(err, null);
                        else callback(null, {resume: result, project: obj.project});
                    });
                }
            }
        ],
        function(err, result){
            var resume = result.resume;
            resume.project = result.project;
            if(err) return res.json({error: err});
            if(!_.isEmpty(result)) {
                if(_.isEmpty(applicant.resume)){
                    applicant.resume = resume._id;
                    applicantService.create(applicant, function(err, applicant){
                        if(err) return res.json({error:'save error'});
                    });
                }
                resume.completeScore = resumeService.calCompleteScore(resume);
                resume.next = resumeService.getNext(resume);
                resume.updated = moment(resume.updated).format('YYYY-MM-DD HH:mm');
                req.session.applicant.resume = resume;
                return res.json(resume);
            }
        }
    );
}

function deleteProject(req, res, next){
    var _id = req.body.id,
        resume = req.session.applicant.resume;
    async.waterfall(
        [
            function(callback){
                projectService.deleteProject(_id, function(err, result){
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
                    _.remove(resume.project, function(obj) { return obj === _id });
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
                result.next = resumeService.getNext(result);
                result.updated = moment(result.updated).format('YYYY-MM-DD HH:mm');
                req.session.applicant.result = result;
                return res.json(result);
            }
        }
    );
}