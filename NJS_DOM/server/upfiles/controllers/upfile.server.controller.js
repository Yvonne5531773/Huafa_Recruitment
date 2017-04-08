'use strict';

var UpfileService = require('../services/upfile.server');
var tool = require('../../common/tool.js');
var moment = require('moment');


exports.deleteUpfiles = function(req, res, next) {
    var upfiles = req.body;
    UpfileService.deleteUpfiles(upfiles.upfiles, function(err){
        if(err) {
            return next(err);
        }else{
            return res.json({
                code: 200,
                success: true
            });
        }
    });
}
