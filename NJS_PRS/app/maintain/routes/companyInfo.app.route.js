'use strict';
var acl = require('../../../config/lib/acl');
var companyInfoController = require('../controllers/companyInfo.app.controller');

module.exports = function (app) {

    app.route('/api/companyInfo/getCompanyInfos')
        .post(acl.isAllowed('companyInfo:getCompanyInfos'), companyInfoController.getCompanyInfos);

    app.route('/api/companyInfo')
        .post(acl.isAllowed('companyInfo:upsertCompanyInfo'), companyInfoController.upsertCompanyInfo);

};