'use strict';
var acl = require('../../../config/lib/acl');
var recreationclubController = require('../controllers/recreationclub.app.controller');

module.exports = function (app) {
    app.route('/api/recreationClub/findRecreationClubs').post(acl.isAllowed('rc:recreationclub:findRecreationClubs'), recreationclubController.findRecreationClubs);
    app.route('/api/recreationClub').post(acl.isAllowed('rc:recreationclub:upsertRecreationClub'), recreationclubController.upsertRecreationClub);
    app.route('/api/recreationClub/deleteRecreationClub').post(acl.isAllowed('rc:recreationclub:deleteRecreationClub'), recreationclubController.deleteRecreationClub);
};