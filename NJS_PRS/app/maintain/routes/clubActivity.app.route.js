'use strict';
var acl = require('../../../config/lib/acl');
var clubActivityController = require('../controllers/clubActivity.app.controller');

module.exports = function (app) {
    app.route('/api/clubActivity/findClubActivitys').post(acl.isAllowed('rc:clubActivity:findClubActivitys'), clubActivityController.findClubActivitys);
    app.route('/api/clubActivity').post(acl.isAllowed('rc:clubActivity:upsertClubActivity'), clubActivityController.upsertClubActivity);
    app.route('/api/clubActivity/deleteClubActivity').post(acl.isAllowed('rc:clubActivity:deleteClubActivity'), clubActivityController.deleteClubActivity);
};