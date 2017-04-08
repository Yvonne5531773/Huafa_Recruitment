/**
 * Created by SUKE3 on 11/22/2016.
 */

'use strict';

var signupFieldService = require('../services/signupField.app.service');
var logger = require('../../../config/lib/logger');

exports.findFields = findFields;
exports.findSignupFields = findSignupFields;
exports.upsertSignupField = upsertSignupField;
exports.deleteSignupField = deleteSignupField;

function findFields(req, res, next) {
    var criteria = req.body;
    debugger;
    signupFieldService.findFields(criteria, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
};

function findSignupFields(req, res, next){
    console.log('prs.app.signupcontroller');
    var criteria = req.body;
    signupFieldService.findSignupFields(criteria, function(err, datas){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{
            return res.json(datas);
        }
    });
}

function upsertSignupField(req, res, next){
    var club = req.body;
    signupFieldService.upsertSignupField(club, function(err, result){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{
            return res.json(result);
        }
    });
}

function deleteSignupField(req, res, next){
    console.log(req.body);
    var fieldId = req.body.fieldId;
    signupFieldService.deleteSignupField(fieldId, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
}