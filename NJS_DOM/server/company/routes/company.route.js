'use strict';

module.exports = function (app) {

  var companyController = require('../controllers/company.controller');

  app.route('/api/company/changeCompanyLayout').put(companyController.changeCompanyLayout);
};