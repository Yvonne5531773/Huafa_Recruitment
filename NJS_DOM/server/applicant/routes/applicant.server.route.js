/**
 * Created by HUGO on 6/30/2016.
 */
'use strict';

/**
 * Module dependencies
 */
var applicantController = require('../controllers/applicant.server.controller');

module.exports = function (app) {

    app.route('/api/applicant/checkApplicant').post(applicantController.checkApplicant);

    app.route('/api/applicant').post(applicantController.create);

};
