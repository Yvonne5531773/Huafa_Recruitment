'use strict';

var acl = require('../../../config/lib/acl');
var progressController = require('../controllers/progress.app.controller');

module.exports = function (app) {

    app.route('/api/progress/getProgress')
        .post(acl.isAllowed('progress:getProgress'), progressController.getProgress);

    app.route('/api/progress')
        .post(acl.isAllowed('progress:upsertProgress'), progressController.upsertProgress);

};