/**
 * Created by hfjylzh on 2/20/2017.
 */

'use strict';

var applicantService = require('../services/applicant.app.service');
var _ = require('lodash');
var moment = require('moment');
var async = require('async');
var url = require('url');
var qs = require('querystring');

exports.checkUsername = checkUsername;
exports.checkApplicant = checkApplicant;
exports.create = create;
exports.login = login;
exports.logout = logout;
exports.getApplicants = getApplicants;
exports.upsertShow = upsertShow;
exports.upsert = upsert;

function checkUsername(req, res, next){
    var username = req.body;
    applicantService.checkUsername({username: username.email}, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
}

function checkApplicant(req, res, next){
    var username = req.body.email,
        password = req.body.password;
    applicantService.checkApplicant({username:username,password:password}, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
}

function create(req, res, next) {
    var applicant = req.body;
    applicant.username = applicant.email;
    applicantService.create(applicant, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            req.session.applicant = result;
            res.redirect('/index');
        }
    });
};

function login(req, res, next) {
    var email = req.body.email;
    applicantService.checkUsername({username:email}, function(err, applicants){
        if (err) {
            return res.json({error:err});
        }else if(!_.isEmpty(applicants)){
            req.session.applicant = applicants[0];
            return res.json({});
        }
    })
};

function logout(req, res, next) {
    if (req.session.applicant) {
        delete req.session.applicant;
    }
    res.redirect('/index');
};

function getApplicants(req, res, next){
    applicantService.checkUsername(req.body, function(err, result){
        console.log('in getApplicants result', result)
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
}

function upsertShow(req, res, next){
    var applicant = req.session.applicant;
    res.render('./app/webapp/views/applicantUpsert', {
        applicant: applicant
    });
}

function upsert(req, res, next){
    var applicant = req.session.applicant,
        oldPassword = req.body.oldPassword,
        newPassword = req.body.newPassword;
    if(_.isEmpty(applicant)) return res.json({err: '未登陆，请重新登陆'});
    applicantService.checkApplicant({username:applicant.username,password:oldPassword}, function(err, result){
        if (err) {
            return res.json({err: err});
        }else{
            result.password = newPassword;
            result.updated = new Date();
            applicantService.create(result, function(err, applicant){
                if (err) {
                    return res.json({err: err});
                }else{
                    req.session.applicant = null;
                    res.json(applicant);
                }
            });
        }
    });
}