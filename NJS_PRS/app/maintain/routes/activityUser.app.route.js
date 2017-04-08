'use strict';
var acl = require('../../../config/lib/acl');
var activityUserController = require('../controllers/activityUser.app.controller');

module.exports = function (app) {
    app.route('/api/activityUser/getActivityUsers').post(acl.isAllowed('rc:activityUser:getActivityUsers'), activityUserController.getActivityUsers);

};