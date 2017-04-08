/**
 * Created by hfjylzh on 2/20/2017.
 */
'use strict';


module.exports = function (app) {
    // Root routing
    var applicantController = require('../controllers/applicant.app.controller');


    app.route('/login/checkUsername').post(applicantController.checkUsername);

    app.route('/login/checkApplicant').post(applicantController.checkApplicant);

    app.route('/applicant/register').post(applicantController.create);

    app.route('/applicant/login').post(applicantController.login);

    app.route('/applicant/logout').get(applicantController.logout);

    app.route('/applicant/getApplicants').post(applicantController.getApplicants);

    app.route('/applicant/upsertShow').get(applicantController.upsertShow);

    app.route('/applicant/upsert').post(applicantController.upsert);
};