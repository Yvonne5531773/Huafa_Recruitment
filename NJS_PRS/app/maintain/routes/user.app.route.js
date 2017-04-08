/**
 * Created by HUGO on 6/30/2016.
 */
'use strict';

/**
 * Module dependencies
 */
var acl = require('../../../config/lib/acl');
var userController = require('../controllers/user.app.controller');

module.exports = function (app) {
    app.route('/api/user/login').post(userController.findForLogin);
    app.route('/api/user/logout').post(userController.logout);
    app.route('/api/user/permissions').get(userController.permissions);
    app.route('/api/user').post(acl.isAllowed('user:create'), userController.create);
    app.route('/api/user/findUsers').post(acl.isAllowed('user:findUsers'), userController.findUsers);
    app.route('/api/user/deleteUser').post(acl.isAllowed('user:deleteUser'), userController.deleteUser);
    app.route('/api/user/validation').post(acl.isAllowed('user:userFieldValidation'), userController.userFieldValidation);
    app.route('/api/user/getUser').post(userController.getUser);
};
