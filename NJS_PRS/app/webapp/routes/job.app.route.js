/**
 * Created by hfjylzh on 2/20/2017.
 */
'use strict';


module.exports = function (app) {
    // Root routing
    var jobController = require('../controllers/job.app.controller');


    app.route('/job/:_id').get(jobController.jobShow);

    app.route('/job/apply').post(jobController.apply);

    app.route('/jobApply/:flag').get(jobController.applyShow);

    app.route('/job/collect').post(jobController.collect);

    app.route('/jobCollect').get(jobController.collectShow);

    app.route('/jobDelCollect').post(jobController.collectDelete);
};