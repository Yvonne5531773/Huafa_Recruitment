/**
 * Created by hfjylzh on 2/20/2017.
 */
'use strict';


module.exports = function (app) {
    // Root routing
    var companyController = require('../controllers/company.app.controller');


    app.route('/companylist/:condition').get(companyController.companylist);

    app.route('/showCompany/:_id').get(companyController.showCompany);
};