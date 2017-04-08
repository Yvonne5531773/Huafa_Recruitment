'use strict';

/**
 * Module dependencies
 */
var positionController = require('../controllers/position.server.controller');

module.exports = function (app) {

    app.route('/api/position/publish')
        .put(positionController.publish);

    app.route('/api/position/stopPublish')
        .put(positionController.stopPublish);

    app.route('/api/position/preview')
        .get(positionController.preview);

    app.route('/api/position/delete')
        .post(positionController.deletePosition);

    app.route('/api/position/index')
        .post(positionController.index);
};


