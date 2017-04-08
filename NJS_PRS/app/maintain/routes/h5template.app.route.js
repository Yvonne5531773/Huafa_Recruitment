/**
 * Created by lica4 on 11/20/2016.
 */
'use strict';
var acl = require('../../../config/lib/acl');
var h5TemplateController = require('../controllers/h5template.app.controller');

module.exports = function (app) {
    app.route('/api/getH5TemplatesByUser').post(acl.isAllowed('rc:h5Template:getH5TemplatesByUser'), h5TemplateController.getH5TemplatesByUser);
    app.route('/api/selectTemplateById').post(acl.isAllowed('rc:h5Template:selectTemplateById'), h5TemplateController.selectTemplateById);
    app.route('/api/deleteTemplateById').post(acl.isAllowed('rc:h5Template:deleteTemplateById'), h5TemplateController.deleteTemplateById);
    app.route('/api/createTplByH5').post(acl.isAllowed('rc:h5Template:createTplByH5'), h5TemplateController.createTplByH5);
    app.route('/api/getH5Url').get(acl.isAllowed('rc:h5Template:getH5Url'), h5TemplateController.getH5Url);
};
