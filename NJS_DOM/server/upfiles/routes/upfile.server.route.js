'use strict';

/**
 * Module dependencies
 */
var upfileController = require('../controllers/upfile.server.controller');

module.exports = function (app) {

    app.route('/api/deleteUpfiles')
        .post(upfileController.deleteUpfiles);
};


