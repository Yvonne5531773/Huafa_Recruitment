'use strict';

var progressService = require('../services/progress.app.service');
var logger = require('../../../config/lib/logger');
var config = require('../../../config/config');

exports.getProgress = getProgress;
exports.upsertProgress = upsertProgress;

function getProgress(req, res, next){
    var criteria = req.body;
    progressService.getProgress(criteria, function(err, datas){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{
            return res.json(datas);
        }
    });
}

function upsertProgress(req, res, next){
    var progress = req.body;
    progressService.upsertProgress(progress, function(err, result){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{
            return res.json(result);
        }
    });
}
