/**
 * Created by HUGO on 6/30/2016.
 */
'use strict';
var path = require('path'),
    passport = require('passport'),
    _ = require('lodash'),
    acl = require('../../../config/lib/acl'),
    userService = require('../services/user.app.service'),
    errorHandler = require(path.resolve('./app/maintain/controllers/errors.app.controller'));


module.exports.findForLogin = function (req, res,next) {
    var user = req.body;
    //ldap auth
    /*User.findOne({userid: user.username.toLowerCase().replace(/(^\s*)|(\s*$)/g,"")}).exec(function (err, doc) {
        if (err || !doc) {
            return res.status(400).send({
                message: 'your domain can not access the system!'
            });
        } else {
            var accountType = doc.accountType;
            if('ldap'===accountType){
                passport.authenticate('ldapauth', function (err, domain, info) {
                    if (err) {
                        return res.status(400).send({
                            message: '服务器繁忙，请等待!'
                        });
                    }
                   if(info){
                        return res.status(400).send(
                            info
                        );
                    }else{
                       var userInfo = {};
                       userInfo.userid = doc.userid;
                       userInfo.role = doc.role;
                       req.session.userInfo = JSON.stringify(userInfo);
                       req.session.isDeleted = 'false';
                       res.json(userInfo);
                   }
                } )(req, res, next);
            }else{
                if(doc.authenticate(user.password)){
                    var userInfo = {};
                    userInfo.userid = doc.userid;
                    userInfo.role = doc.role;
                    req.session.userInfo = JSON.stringify(userInfo);
                    req.session.isDeleted = 'false';
                    return res.status(200).json(userInfo);
                }else{
                    return res.status(400).json(err);
                }
            }

        }
    });*/
    userService.findForLogin(user, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            req.session.userInfo = JSON.stringify(result);
            req.session.isDeleted = 'false';
            res.json(result);
        }
        
    });

};

module.exports.logout = function (req, res,next) {
    var result;  
    if (req.session.userInfo) {
        delete req.session.userInfo;
        delete req.session;
        delete req.sessionID;
        res.redirect('/maintain');
        /*var id = req.session.id;
        Session.remove({_id: id}, function (err, doc) {
            result = {status: "success"};
            req.session = null;
            req.sessionID = null;
            res.redirect('/');
        });*/

    } else {
        result = {status: "not login"};
        res.redirect('/maintain');
    }
};

/**
 * Create a User
 */
exports.create = function (req, res, next) {
    var userModel = req.body;
   /* userModel.userid = userModel.userid.toLowerCase().replace(/(^\s*)|(\s*$)/g,"");

    var query = User.findOne({userid:userModel.userid});
    var user = new User(req.body);

    //var user = new User(userModel);
    query.exec(function (err, orginalUser) {
        if (err) {
            return next(err);
        } else if (!orginalUser) {
            user.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(user);
                }
            });
        } else {
            var _id = orginalUser._id;
            if (user.password) {
                user.password = user.hashPassword(user.password);
            }
            User.findByIdAndUpdate(_id, {
                $set: user
            }, function (err, doc) {
                if (err) {
                    return res.status(400).json({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(doc);
                }
            });
        }
    });*/
    userService.create(userModel, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            // userService.synUserToH5ByWS(userModel);
            res.json(result);
        }
        
    });
};

exports.findUsers = function (req, res, next) {
    var criteria = req.body;

    userService.findUsers(criteria, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
};

exports.deleteUser = function(req, res, next){
    var userId = req.body.userId;
    userService.deleteUser(userId, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
};

exports.userFieldValidation = function (req, res) {
    var userid = req.body.userid;
    userService.findUsers({'userid':userid}, function(err, users){
        if (err) {
            return res.status(400).json({
                message: errorHandler.getErrorMessage(err)
            });
        }else if(_.isEmpty(users)){
            res.json({status: 'success', user: {}});
        }else{
            res.json({status: 'fail', user: {}});
        }
    });
};

exports.getUser = function (req, res, next) {
    var criteria = req.body;

    userService.getUser(criteria, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
};


exports.permissions = function (req, res, next) {
    var userInfo;
    if (req.session && req.session.userInfo) {
      userInfo = JSON.parse(req.session.userInfo);
    }
    if(!_.isEmpty(userInfo)){
        var role = (userInfo) ? userInfo.role : ['guest'];
        acl.whatResources([role], function(err, result){
            if(err){
                console.error(err);
                return res.json({});
            }
            return res.json(result);
        });
    }else{
        return res.status(500).send('Unexpected authorization error');
    }
};
