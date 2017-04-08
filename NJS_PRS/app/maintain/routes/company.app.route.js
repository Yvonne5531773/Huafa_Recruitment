'use strict';
var acl = require('../../../config/lib/acl');
var companyController = require('../controllers/company.app.controller');

module.exports = function (app) {

    app.route('/api/company/getCompanys')
        .post(acl.isAllowed('company:getCompanys'), companyController.getCompanys);

    app.route('/api/company')
        .post(acl.isAllowed('company:upsertCompany'), companyController.upsertCompany);

    app.route('/api/company/deleteCompany')
        .post(acl.isAllowed('company:deleteCompany'), companyController.deleteCompany);

    app.route('/api/company/changeCompanySegmentLayout')
        .post(acl.isAllowed('company:changeCompanySegmentLayout'), companyController.changeCompanySegmentLayout);
};