'use strict';

var positionService = require('../services/position.app.service');
var logger = require('../../../config/lib/logger');
var config = require('../../../config/config');

exports.getPositions = getPositions;
exports.upsertPosition = upsertPosition;
exports.deletePosition = deletePosition;
exports.getWorkAddr = getWorkAddr;
exports.publishJob = publishJob;
exports.stopPublishJob = stopPublishJob;

function getPositions(req, res, next){
    var criteria = req.body;
    positionService.getPositions(criteria, function(err, datas){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{
            return res.json(datas);
        }
    });
}

function upsertPosition(req, res, next){
    var position = req.body;
    positionService.upsertPosition(position, function(err, result){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{
            return res.json(result);
        }
    });
}

function deletePosition(req, res, next){
    var _id = req.body._id;
    positionService.deletePosition(_id, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
}

function getWorkAddr(req, res, next){
    var workAddr = config.workAddr;
    res.json(workAddr);
}

function publishJob(req, res, next){
    var position = req.body;
    positionService.publishJob(position, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
}

function stopPublishJob(req, res, next){
    var position = req.body;
    positionService.stopPublishJob(position, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
}