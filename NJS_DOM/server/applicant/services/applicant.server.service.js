'use strict';
var _ = require('lodash');
var mongoose = require('mongoose');
var async = require('async');
var applicantModel = mongoose.model('Applicant');

exports.checkApplicant = checkApplicant;
exports.create = create;

function checkApplicant(applicant, callBackFn){
    if(_.isEmpty(applicant)){
        return callBackFn({ message: 'Error User' }, null);
    }
    async.waterfall([
        function(cb){
            applicantModel.findOne({username: applicant.username.toLowerCase().replace(/(^\s*)|(\s*$)/g, "") }, function (err, doc) {
                if (err || !doc) {
                    return cb({message: 'your domain can not access the system!'}, null);
                } else {
                    // if (doc.authenticate(applicant.password)) {
                    //     var applicantInfo = _.omit(doc,'password');
                    //     return cb(null, applicantInfo);
                    // } else {
                    //     return cb({ message: '密码错误' }, null);
                    // }
                    var applicantInfo = _.omit(doc,'password');
                    return cb(null, applicantInfo);
                }
            });
        }
    ],
        function(err, applicantInfo){
            if(err){
                return callBackFn(err, null);
            }
            return callBackFn(null, applicantInfo);
        });
}

function create(app, callBackFn){
    app.username = app.username.toLowerCase().replace(/(^\s*)|(\s*$)/g, "");
    applicantModel.findOne({ username: app.username }, function (err, orginalUser) {
        if (err) {
            return next(err);
        } else if (!orginalUser) {
            applicantModel.create(app, function (err) {
                if (err) {
                    return callBackFn(err, null);
                } else {
                    return callBackFn(null, app);
                }
            });
        } else {
            var _id = orginalUser._id;
            if (app.password) {
                app.password = applicantModel.hashPassword(app);
            }
            applicantModel.findByIdAndUpdate(_id, {
                $set: _.omit(app, '_id')
            }, function (err, doc) {
                console.log('in create app doc', doc)
                console.log('in create app err', err)
                if (err) {
                    return callBackFn(err, null);
                } else {
                    return callBackFn(null, doc);
                }
            });
        }
    });
}