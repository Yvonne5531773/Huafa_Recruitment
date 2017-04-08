/**
 * Created by CHENLA2 on 10/27/2016.
 */
'use strict';
var _ = require('lodash');
var moment = require('moment');
var RecreationClubService = require('../services/recreationclub.app.service');

//Define the interface of this class
exports.getClubActivities = getClubActivities;
exports.getLatestActivities = getLatestActivities;
exports.getActivityDetails = getActivityDetails;
exports.getMyFocusClubs = getMyFocusClubs;
exports.focusClub = focusClub;
exports.registerActivity = registerActivity;
exports.saveRegisterActivity = saveRegisterActivity;
exports.getPublishedClubs = getPublishedClubs;
exports.getPublishedActivities = getPublishedActivities;
exports.getClubDetail = getClubDetail;
exports.getIsFocus = getIsFocus;

function getIsFocus (app,io) {
    return function (req, res, next) {
        var query = {
            openId: 10086,
            favouriteClub: req.params.clubId
        }
        RecreationClubService.getCommonUserWithCriteria(query, function (err, result) {
            if (err) {
                return next(err);
            } else {
                return res.json(result);
            }
        });
    }
}

var setDefaultValueForActivityDetail = function (activity) {
    var result = activity;
    _.set(result, 'club.icon', _.get(result, 'club.icon', ''));
    result.cover = _.get(result, 'cover', '');
    result.title = _.get(result, 'title', '');
    result.status = _.get(result, 'status', '');
    result.currentCount = _.get(result, 'currentCount', '');
    result.totalCount = _.get(result, 'totalCount', '');
    result.cutoffDate = _.get(result, 'cutoffDate', '');
    result.startDateTime = _.get(result, 'startDateTime', '');
    result.endDateTime = _.get(result, 'endDateTime', '');
    result.clubName = _.get(result, 'clubName', '');
    result.location = _.get(result, 'location', '');
    result.description = _.get(result, 'description', '');
    result._id = _.get(result, '_id', '');
    return result;
};

var convertDateTime = function (activityDetail) {
    activityDetail.cutoffDate = moment(activityDetail.cutoffDate).format('YYYY-MM-DD HH:mm');
    activityDetail.startDateTime = moment(activityDetail.startDateTime).format('YYYY-MM-DD HH:mm');
    activityDetail.endDateTime = moment(activityDetail.endDateTime).format('YYYY-MM-DD HH:mm');
    return activityDetail;
};

var setDefaultValueForActivities = function (activities) {
    var result = [];
    _.forEach(activities, function (activity) {
        convertDateTime(activity);
        result.push(setDefaultValueForActivityDetail(activity));
    });
    return result;
};

function getPublishedActivities(app, io) {
    return function (req, res, next) {
        RecreationClubService.getActivityWithCriteria({status: {$nin: ['待发布', '已结束']}}, function (err, result) {
            if (err) {
                return next(err);
            } else {
                return res.json(setDefaultValueForActivities(result));
            }
        });
    }
}

function getClubDetail(app, io) {
    return function (req, res, next) {
        var clubId = req.params.clubId;
        RecreationClubService.getClubsWithCriteria({_id: clubId}, function (err, result) {
            if (err) {
                return next(err);
            } else {
                return res.json(result);
            }
        });
    }
}

function getClubActivities(app, io) {
    return function (req, res, next) {
        var query = {
            // status: {$nin: ['待发布', '已结束']},
            club: _.result(req, 'params.clubId', '')
        };
        RecreationClubService.getActivityWithCriteria(query, function (err, result) {
            if (err) {
                return next(err);
            } else {
                return res.json(setDefaultValueForActivities(result));
            }
        });
    }
}


function getLatestActivities(app, io) {
    return function (req, res, next) {
        var query = {};
        RecreationClubService.getActivityWithCriteria(query, function (err, result) {
            if (err) {
                return next(err);
            } else {
                return res.json(result);
            }
        });
    }
}

function getMyFocusClubs(app, io) {
    return function (req, res, next) {
        var query = {openId: req.params.openId};
        RecreationClubService.getMyClubs(query, function (err, result) {
            if (err) {
                return next(err);
            } else {
                return res.json(result);
            }
        })
    }
}

function getPublishedClubs(app, io) {
    return function (req, res, next) {
        console.log('in getPublishedClubs')
        RecreationClubService.getClubsWithCriteria({status: "已发布"}, function (err, result) {
            if (err) {
                return next(err);
            } else {
                return res.json(result);
            }
        })
    }
}

function focusClub(app, io) {
    return function (req, res, next) {
        var clubId = req.body.clubId;
        RecreationClubService.focusClub(clubId, function (err, result) {
            if (err) {
                return next(err);
            } else {
                return res.json(result);
            }
        })
    }
}

function getActivityDetails(app, io) {
    return function (req, res, next) {
        var query = {
            _id: req.params.activityId
        };
        RecreationClubService.getActivityWithCriteria(query, function (err, result) {
            if (err) {
                return next(err);
            } else {
                return res.json(convertDateTime(setDefaultValueForActivityDetail(result[0])));
            }
        })
    }
}

function registerActivity(app, io) {
    return function (req, res, next) {
        var activityId = req.params.activityId;
        RecreationClubService.registerActivityInfo(activityId, function (err, result) {
            if (err) {
                return next(err);
            } else {
                return res.json(result);
            }
        })
    }
}

function saveRegisterActivity(app, io) {
    return function (req, res, next) {
        var info = _.get(req, 'body.data', false);
        if (!info) {
            console.log("empty body in PRS " + info);
            return res.json({status: "no data"})
        }
        RecreationClubService.saveRegisterActivityInfo(info, function (err, result) {
            if (err) {
                return next(err);
            } else {
                return res.json(result);
            }
        })
    }
}
