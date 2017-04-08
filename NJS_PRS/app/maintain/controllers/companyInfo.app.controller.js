'use strict';

var companyInfoService = require('../services/companyInfo.app.service');
var logger = require('../../../config/lib/logger');
var config = require('../../../config/config');

exports.getCompanyInfos = getCompanyInfos;
exports.upsertCompanyInfo = upsertCompanyInfo;

function getCompanyInfos(req, res, next){
    var criteria = req.body;
    companyInfoService.getCompanyInfos(criteria, function(err, datas){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{
            return res.json(datas);
        }
    });
}

function upsertCompanyInfo(req, res, next){
    var companyInfo = req.body;
    companyInfoService.upsertCompanyInfo(companyInfo, function(err, result){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{

            return res.json(result);
        }
    });
}


