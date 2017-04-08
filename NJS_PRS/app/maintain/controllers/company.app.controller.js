'use strict';

var companyService = require('../services/company.app.service');
var companyInfoService = require('../services/companyInfo.app.service');
var logger = require('../../../config/lib/logger');
var config = require('../../../config/config');

exports.getCompanys = getCompanys;
exports.upsertCompany = upsertCompany;
exports.deleteCompany = deleteCompany;
exports.changeCompanySegmentLayout = changeCompanySegmentLayout;

function getCompanys(req, res, next){
    var criteria = req.body;
    companyService.getCompanys(criteria, function(err, datas){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{
            return res.json(datas);
        }
    });
}

function upsertCompany(req, res, next){
    var company = req.body.company,
        companyInfo = req.body.companyInfo;
    companyService.upsertCompany(company, function(err, result){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{
            console.log('in upsertCompany', result)
            companyInfo.company.push(result._id);
            companyInfoService.upsertCompanyInfo(companyInfo, function (err, result) {
                if (err) {
                    logger.error(err);
                    return res.json([]);
                } else {
                    return res.json(result);
                }
            })
        }
    });
}

function deleteCompany(req, res, next){
    var _id = req.body._id;
    companyService.deleteCompany(_id, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
}

function changeCompanySegmentLayout(req, res, next){
    var company = req.body;
    companyService.changeCompanySegmentLayout(company, function(err, result){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{
            return res.json(result);
        }
    });
}

