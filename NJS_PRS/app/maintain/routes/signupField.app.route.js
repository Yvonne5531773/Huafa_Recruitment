/**
 * Created by SUKE3 on 11/22/2016.
 */

'use strict';
var acl = require('../../../config/lib/acl');
var signupFieldController = require('../controllers/signupField.app.controller');

module.exports = function (app) {
    app.route('/api/signupField/findFields').post(acl.isAllowed('rc:signupField:findFields'), signupFieldController.findFields);
    app.route('/api/signupField/findSignupFields').get(acl.isAllowed('rc:signupField:findSignupFields'), signupFieldController.findSignupFields);
    app.route('/api/signupField').post(acl.isAllowed('rc:signupField:upsertSignupField'), signupFieldController.upsertSignupField);
    app.route('/api/signupField/deleteSignupField').post(acl.isAllowed('rc:signupField:deleteSignupField'), signupFieldController.deleteSignupField);
};