'use strict';

var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var applicantService = require('../services/applicant.server.service');

exports.checkApplicant = checkApplicant;
exports.create = create;

function checkApplicant(req, res, next) {
    var applicant = req.body;
    applicantService.checkApplicant(applicant, function(err, result){
        if(err){
            return res.status(400).json(err);
        }else{
            return res.status(200).json(result);
        }
    });
};

function create(req, res, next) {
    var applicant = req.body;
    applicantService.create(applicant, function(err, result){
        if(err){
            return res.status(400).json(err);
        }else{
            return res.status(200).json(result);
        }
    });
};