/**
 * Created by CHENLA2 on 10/27/2016.
 */
'use strict'
var _ = require('lodash');
var weChat = require('../utils/weChat.util');
var commonUserService = require('../services/commonUser.app.service');

module.exports = function(app) {
    app.get('/home',function (req, res) {
        var code = _.result(req, 'query.code');
        if(_.isEmpty(code)){
           return res.render('client/wechat/views/index');
        }
        weChat.getUserInfo(code, function(err, userInfo){
            commonUserService.updateCommonUserByUserInfo(userInfo, function(err, commonUser){
                if(err){
                    return;
                }
                commonUser.role = 'guest';
                req.session.userInfo = JSON.stringify(commonUser);
            });
            res.render('client/wechat/views/index');
        });
        
    });
    app.get('/demo',function (req, res) {
        res.render('client/wechat/views/demo');
    });
    app.get('/allClubs',function (req, res) {
        res.render('client/wechat/views/clubs');
    });
    app.get('/clubDetails',function (req, res) {
        res.render('client/wechat/views/clubDetails');
    });
    app.get('/fastRegister',function (req, res) {
        res.render('client/wechat/views/fastRegister');
    });
    app.get('/activities',function (req, res) {
        res.render('client/wechat/views/activities');
    });
    app.get('/activityDetails',function (req, res) {
        res.render('client/wechat/views/activityDetails');
    });
    app.get('/signActivity',function (req, res) {
        res.render('client/wechat/views/signActivity');
    });
    app.get('/myActivities',function (req, res) {
        res.render('client/wechat/views/myRegisteredActivities');
    });
    app.get('/clubDetails',function (req, res) {
        res.render('client/wechat/views/clubDetails');
    });
};
