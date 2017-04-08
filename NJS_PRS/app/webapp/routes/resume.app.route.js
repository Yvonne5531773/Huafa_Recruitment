/**
 * Created by hfjylzh on 2/20/2017.
 */
'use strict';


module.exports = function (app) {

    var resumeController = require('../controllers/resume.app.controller');
    var certificateController = require('../controllers/certificate.app.controller');
    var educationController = require('../controllers/education.app.controller');
    var projectController = require('../controllers/project.app.controller');
    var workController = require('../controllers/work.app.controller');
    var familyController = require('../controllers/family.app.controller');

    app.route('/resume').get(resumeController.index);

    app.route('/resume/getResume').post(resumeController.getResume);

    app.route('/resume/upsertResume').post(resumeController.upsertResume);

    app.route('/resume/preview/:_id').get(resumeController.preview);

    app.route('/resume/upsertCertificate').post(certificateController.upsertCertificate);

    app.route('/resume/deleteCertificate').post(certificateController.deleteCertificate);

    app.route('/resume/upsertEducation').post(educationController.upsertEducation);

    app.route('/resume/deleteEducation').post(educationController.deleteEducation);

    app.route('/resume/upsertProject').post(projectController.upsertProject);

    app.route('/resume/deleteProject').post(projectController.deleteProject);

    app.route('/resume/upsertWork').post(workController.upsertWork);

    app.route('/resume/deleteWork').post(workController.deleteWork);

    app.route('/resume/upsertFamily').post(familyController.upsertFamily);

    app.route('/resume/deleteFamily').post(familyController.deleteFamily);
};