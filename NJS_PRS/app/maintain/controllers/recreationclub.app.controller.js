'use strict';

var recreationClubService = require('../services/recreationclub.app.service');
var logger = require('../../../config/lib/logger');

exports.findRecreationClubs = findRecreationClubs;
exports.upsertRecreationClub = upsertRecreationClub;
exports.deleteRecreationClub = deleteRecreationClub;

function findRecreationClubs(req, res, next){
    var criteria = req.body;
    recreationClubService.findRecreationClubs(criteria, function(err, datas){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{
            return res.json(datas);
        }
    });
}

function upsertRecreationClub(req, res, next){
    var club = req.body;
    recreationClubService.upsertRecreationClub(club, function(err, result){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{
            return res.json(result);
        }
    });
}

function deleteRecreationClub(req, res, next){
    var clubId = req.body.clubId;
    recreationClubService.deleteRecreationClub(clubId, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
}