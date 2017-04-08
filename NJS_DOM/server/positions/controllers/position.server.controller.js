'use strict';

var request = require('superagent');
var mongoose = require('mongoose');
var positionSchema = mongoose.model('Position');
var dictionarySchema = mongoose.model('Dictionary');

const ACTIVE = "ACTIVE";
const INACTIVE = "INACTIVE";

module.exports.publish = function (req, res) {
    var positions = req.body;
    if(positions.length === 0){
        return res.end();
    }
    positions.forEach(function(p){
        positionSchema.update({_id : p._id}, {$set:{status:ACTIVE}})
            .exec(function(err,result) {
                res.end();
            });
    });
};


module.exports.stopPublish = function (req, res) {
    var positions = req.body;
    if(positions.length === 0){
        return res.end();
    }
    positions.forEach(function(p){
        positionSchema.update({_id : p._id}, {$set:{status:INACTIVE}})
            .exec(function(err,result) {
                res.end();
            });
    });
};


module.exports.preview = function (req, res) {
    positionSchema.find({status: 'ACTIVE'}).then(function (result) {
        res.render('./server/position/views/position', {
            positions: result
        });
    });
};

module.exports.deletePosition = function(req, res){
    var positions = req.body;
    if(positions.length === 0){
        return res.end();
    }
    positions.forEach(function(p){
        positionSchema.remove({_id : p._id})
            .exec(function(err,result) {
                res.end();
            });
    });
};

module.exports.index = function(req, res){
    dictionarySchema.find({category : '职位管理-职位类型'})
        .then(jobTypes => {
            var jobTypeMap = new Map();
            jobTypes.forEach(jobType => {
                jobTypeMap.set(jobType.value, jobType.icon);
            });
            return jobTypeMap;
        })
        .then(jobTypeMap => {
            req.body.status = 'ACTIVE';
            positionSchema.find(req.body)
                .sort({updated : -1})
                .then(result => {
                    result.forEach(r => r.jobType = jobTypeMap.get(r.jobType));
                    console.log('in index result', result);
                    return res.status(200).json(result);
                });
        });
};
