'use strict';
var acl = require('../../../config/lib/acl');
var positionController = require('../controllers/position.app.controller');

module.exports = function (app) {

    app.route('/api/position/getPositions')
        .post(acl.isAllowed('position:getPositions'), positionController.getPositions);

    app.route('/api/position')
        .post(acl.isAllowed('position:upsertPosition'), positionController.upsertPosition);

    app.route('/api/position/deletePosition')
        .post(acl.isAllowed('position:deletePosition'), positionController.deletePosition);

    app.route('/api/position/getWorkAddr')
        .post(acl.isAllowed('position:getWorkAddr'), positionController.getWorkAddr);

    app.route('/api/position/publish')
        .put(acl.isAllowed('position:publishJob'), positionController.publishJob);

    app.route('/api/position/stopPublishJob')
        .put(acl.isAllowed('position:stopPublishJob'), positionController.stopPublishJob);
};