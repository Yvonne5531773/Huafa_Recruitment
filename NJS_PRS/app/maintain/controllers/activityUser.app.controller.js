'use strict';

var activityUserService = require('../services/activityUser.app.service');
var logger = require('../../../config/lib/logger');

exports.getActivityUsers = getActivityUsers;

function getActivityUsers(req, res, next){
    var activityId = req.body.activityId;
    activityUserService.getActivityUsers(activityId, function(err, datas){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{
            return res.json(datas);
        }
    });
}