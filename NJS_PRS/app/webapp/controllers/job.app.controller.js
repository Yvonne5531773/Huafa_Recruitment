/**
 * Created by hfjylzh on 2/20/2017.
 */

'use strict';

var jobService = require('../services/job.app.service');
var applicantService = require('../services/applicant.app.service');
var resumeService = require('../services/resume.app.service');
var companyInfoService = require('../../maintain/services/companyInfo.app.service');
var progressService = require('../../maintain/services/progress.app.service');
var positionService = require('../../maintain/services/position.app.service');
var _ = require('lodash');
var moment = require('moment');
var async = require('async');
var url = require('url');

exports.jobShow = jobShow;
exports.apply = apply;
exports.applyShow = applyShow;
exports.collect = collect;
exports.collectShow = collectShow;
exports.collectDelete = collectDelete;

function jobShow(req, res, next){
    var applicant = req.session.applicant,
        _id = req.params._id;
    async.waterfall(
        [
            function(callback){
                jobService.jobShow({_id: _id}, function(err, positions){
                    if (err) {
                        callback(err)
                    }else{
                        if(!_.isEmpty(positions)) {
                            positions[0].browseCount++;
                            positionService.upsertPosition(positions[0],function(err,data){
                                if(err) next(err);
                            });
                            positions[0].updated = moment(positions[0].updated).format('YYYY-MM-DD HH:mm');
                            callback(null, positions[0])
                        }
                    }
                });
            },
            function(position, callback){
                companyInfoService.getCompanyInfos({type:position.workAddr},function(err, companyInfos) {
                    var companyInfo = {};
                    if (err) {
                        callback(err)
                    }else{
                        if(!_.isEmpty(companyInfos))
                            companyInfo = companyInfos[0];
                        else
                            companyInfo = {};
                        callback(null, {position: position, companyInfo: companyInfo})
                    }
                });
            }
        ],
        function(err, result){
            if(!err) {
                console.log('in jobShow applied1',!_.isEmpty(applicant)?applicant.applied:null)
                console.log('in jobShow applied3',!_.isEmpty(applicant)?_.indexOf(_.map(applicant.applied, function(p){
                        if(p.position) return p.position._id}),_id):-1)
                res.render('./app/webapp/views/job', {
                    position: result.position,
                    companyInfo: result.companyInfo,
                    conditionIndex: true,
                    applicant: applicant,
                    applied: !_.isEmpty(applicant)?_.indexOf(_.map(applicant.applied, function(p){
                        if(p.position) return p.position._id}),_id):-1,
                    collected: !_.isEmpty(applicant)?_.indexOf(_.map(applicant.collected, function(c){if(c.position) return c.position._id}), _id):-1
                });
            }
        });
}

function apply(req, res, next){
    var applicant = req.session.applicant,
        positionId = req.body.positionId,
        resumeId = req.body.resumeId;
    if(applicant) {
        resumeService.getResume({_id: resumeId}, function(err, resumes){
            if(err) return res.json({error: err});
            else if(_.isEmpty(resumes[0].name) || _.isEmpty(resumes[0].education) || _.isEmpty(resumes[0].family)){
                return res.json({code: 1});
            }else {
                if (_.isEmpty(applicant.applied)) applicant.applied = [];
                applicant.applied.push({position:positionId, time:new Date()});
                positionService.getPositions({_id:positionId},function(err,positions){
                    ++positions[0].applyCount;
                    positionService.upsertPosition(positions[0],function(err,data){if(err) next(err)});
                });
                applicantService.create(applicant, function (err, result) {
                    if (err) {
                        return res.json({error: err});
                    } else {
                        applicantService.checkUsername({_id: result._id}, function(err, applicant){
                            req.session.applicant = applicant[0];
                            return res.json(applicant[0]);
                        })
                    }
                });
            }
        })
    }
}

function applyShow(req, res, next){
    var applicant = req.session.applicant,
        flag = req.params.flag;
    if(!_.isEmpty(applicant) && !_.isEmpty(applicant.applied)){
        var applies = applicant.applied;
        async.waterfall(
            [
                function(callback){
                    applies = _.orderBy(applies, ['position.updated'], ['desc']);
                    _.forEach(applies, function(position, i){
                        (function(position, i){
                            companyInfoService.getCompanyInfos({type:position.position.workAddr},function(err, companyInfos) {
                                if (err) callback(err)
                                else if(!_.isEmpty(companyInfos)) position.companyInfo = companyInfos[0];
                                position.time = moment(position.time).format('YYYY-MM-DD HH:mm');
                                position.position.updated = moment(position.position.updated).format('YYYY-MM-DD HH:mm');
                                if(i === applies.length-1){
                                    callback(null, applies)
                                }
                            });
                        })(position, i);
                    });
                },
                function(applied, callback){
                    _.forEach(applied, function(position, i){
                        (function(position, i){
                            progressService.getProgress({applicant:applicant._id,position:position.position._id},function(err, progresses) {
                                if(!_.isEmpty(progresses)){
                                    progresses[0].viewed = !_.isEmpty(progresses[0].viewed)?moment(progresses[0].viewed).format('YYYY-MM-DD HH:mm'):null;
                                    progresses[0].accepted = !_.isEmpty(progresses[0].accepted)?moment(progresses[0].accepted).format('YYYY-MM-DD HH:mm'):null;
                                    position.progress = progresses[0];
                                }
                                if(i === applied.length-1){
                                    callback(null, {applied: applied})
                                }
                            });
                        })(position, i);
                    });
                }
            ],
            function(err, result){
                if(!err) {
                    var resumeApplyAll, resumeView=false, resumeNotic=false;
                    resumeApplyAll = flag==0?true:false;
                    if(flag==1) {
                        result.applied = _.filter(result.applied,function(a){return !_.isEmpty(a.progress) && !_.isEmpty(a.progress.viewed)});
                        resumeView = true;
                    }
                    if(flag==2) {
                        result.applied = _.filter(result.applied,function(a){return !_.isEmpty(a.progress) && !_.isEmpty(a.progress.accepted)});
                        resumeNotic = true;
                    }
                    res.render('./app/webapp/views/apply', {
                        resumeApplyAll: resumeApplyAll,
                        resumeView: resumeView,
                        resumeNotic: resumeNotic,
                        applicant: applicant,
                        applied: result.applied
                    });
                }
            });
    }else{
        res.render('./app/webapp/views/apply', {});
    }
}

function collect(req, res, next){
    var applicant = req.session.applicant,
        positionId = req.body.positionId;
    if(applicant) {
        if (_.isEmpty(applicant.collected)) applicant.collected = [];
        applicant.collected.push({position:positionId, time:new Date()});
        applicantService.create(applicant, function (err, result) {
            if (err) {
                return res.json({error: err});
            } else {
                applicantService.checkUsername({_id: result._id}, function(err, applicant){
                    req.session.applicant = applicant[0];
                    return res.json(applicant[0]);
                })
            }
        });
    }
}

function collectShow(req, res, next){
    var applicant = req.session.applicant;
    if(!_.isEmpty(applicant) && !_.isEmpty(applicant.collected)){
        var collects = applicant.collected;
        async.waterfall(
            [
                function(callback){
                    collects = _.orderBy(collects, ['position.updated'], ['desc']);
                    _.forEach(collects, function(position, i){
                        (function(position, i){
                            companyInfoService.getCompanyInfos({type:position.position.workAddr},function(err, companyInfos) {
                                if (err) callback(err)
                                else if(!_.isEmpty(companyInfos)) position.companyInfo = companyInfos[0];
                                position.applied = !_.isEmpty(applicant)?_.indexOf(_.map(applicant.applied,function(p){return p.position._id}),position.position._id):-1;
                                position.position.updated = moment(position.position.updated).format('YYYY-MM-DD HH:mm');
                                if(i === collects.length-1){
                                    callback(null, {collected: collects})
                                }
                            });
                        })(position, i);
                    });
                }
            ],
            function(err, result){
                if(!err) {
                    res.render('./app/webapp/views/collect', {
                        applicant: applicant,
                        collected: result.collected
                    });
                }
            });
    }else{
        res.render('./app/webapp/views/collect', {});
    }
}

function collectDelete(req, res, next){
    var _id = req.body._id,
        applicant = req.session.applicant;
    async.waterfall(
        [
            function(callback) {
                _.remove(applicant.collected, function (obj) {
                    return obj.position._id == _id
                });
                applicantService.create(applicant, function (err, result) {
                    if (err) {
                        return callback(err);
                    } else {
                        applicantService.checkUsername({_id: result._id}, function(err, applicant){
                            req.session.applicant = applicant[0];
                            callback(null, applicant[0]);
                        })
                    }
                });
            }
        ],function(err, result){
            if(err) return res.json({error: err});
            if(!_.isEmpty(result)) {
                result.updated = moment(result.updated).format('YYYY-MM-DD HH:mm');
                return res.json(result);
            }
        }
    );
}