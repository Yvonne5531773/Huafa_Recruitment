/**
 * Created by CHENLA2 on 10/27/2016.
 */

var Controller = require('../controllers/recreationclub.app.controller');

module.exports = function(app, io) {
    app.route('/rc/getClubActivities/:clubId')
        .get(Controller.getClubActivities(app,io));
    app.route('/rc/getLatestActivities')
        .get(Controller.getLatestActivities(app,io));
    app.route('/rc/getActivityDetails/:activityId')
        .get(Controller.getActivityDetails(app,io));
    app.route('/rc/getMyFocusClubs/:openId')
        .get(Controller.getMyFocusClubs(app,io));
    app.route('/rc/focusClub')
        .post(Controller.focusClub(app,io));
    app.route('/rc/registerActivity/:activityId')
        .get(Controller.registerActivity(app,io));
    app.route('/rc/saveRegisterActivity')
        .post(Controller.saveRegisterActivity(app,io));
    app.route('/rc/getPublishedClubs')
        .get(Controller.getPublishedClubs(app,io));
    app.route('/rc/getPublishedActivities')
        .get(Controller.getPublishedActivities(app,io));
    app.route('/rc/getClubDetail/:clubId')
        .get(Controller.getClubDetail(app,io));
    app.route('/rc/getIsFocus/:clubId')
        .get(Controller.getIsFocus(app,io));
};
