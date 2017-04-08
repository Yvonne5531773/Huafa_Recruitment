/**
 * Created by lica4 on 11/20/2016.
 */
'use strict';
var fileUploadService = require('../services/fileUpload.app.service');

module.exports.fileUpload = function (req, res, next) {
    var userid = req.body.userid;
    var data = req.files;
    data.userid = userid;
    fileUploadService.fileUpload(data, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
};

module.exports.getUpfiles = function (req, res, next) {
    var options = req.body;
    fileUploadService.getUpfiles(options, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
};

module.exports.deleteUpfiles = function (req, res, next) {
    var upfiles = req.body;
    console.log('in fileUpload upfiles', upfiles)
    fileUploadService.deleteUpfiles(upfiles, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
};
