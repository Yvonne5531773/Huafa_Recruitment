/**
 * Created by lica4 on 11/20/2016.
 */
'use strict';

var fileUploadController = require('../controllers/fileUpload.app.controller'),
    config = require('../../../config/config'),
    multiparty = require('connect-multiparty');

var multiParty = multiparty({ uploadDir: config.upload.dir });

module.exports = function (app) {
    app.route('/api/fileUpload').post(multiParty, fileUploadController.fileUpload);
    app.route('/api/getUpfiles').post(fileUploadController.getUpfiles);
    app.route('/api/deleteUpfiles').post(fileUploadController.deleteUpfiles);
};
