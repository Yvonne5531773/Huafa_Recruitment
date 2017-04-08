'use strict';

var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var errorHandler = require(path.resolve('./server/core/controllers/errors.server.controller'));
var userService = require('../services/user.server.service');

var User = mongoose.model('Loginuser');

exports.findForLogin = findForLogin;
exports.create = create;
exports.getUser = getUser;

function findForLogin(req, res, next) {
    var user = req.body;
    userService.findForLogin(user, function(err, result){
        if(err){
            return res.status(400).send(err);
        }else{
            return res.status(200).json(result);
        }
    });
};


function create(req, res, next) {
    var userModel = req.body;
    userService.create(userModel, function(err, result){
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }else{
            return res.status(200).json(result);
        }
    });
};

function getUser(req, res, next) {
    var data = req.body;
    userService.getUser(data, function(err, result){
        if(err){
            return res.status(400).send(err);
        }else{
            return res.status(200).json(result);
        }
    });
};
