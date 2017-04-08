'use strict';

var clubActivityService = require('../services/clubActivity.app.service');
var logger = require('../../../config/lib/logger');

exports.findClubActivitys = findClubActivitys;
exports.upsertClubActivity = upsertClubActivity;
exports.deleteClubActivity = deleteClubActivity;

function findClubActivitys(req, res, next){
    var criteria = req.body;
    clubActivityService.findClubActivitys(criteria, function(err, datas){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{
            return res.json(datas);
        }
    });
}

function upsertClubActivity(req, res, next){
    var club = req.body;
    clubActivityService.upsertClubActivity(club, function(err, result){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{
            return res.json(result);
        }
    });
}

function deleteClubActivity(req, res, next){
    var clubId = req.body.clubId;
    clubActivityService.deleteClubActivity(clubId, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
}