'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');

exports.getCompanyInfos = getCompanyInfos;
exports.upsertCompanyInfo = upsertCompanyInfo;

function getCompanyInfos(criteria, callBackFn) {
    var query = criteria;
    request.get({
        uri: config.url.dom+util.format('/api/v1/CompanyInfo?query=%s&populate=company', encodeURIComponent(JSON.stringify(query))),
        json: true
    }, function (error, response, companyInfo) {
        if (!error && (response.statusCode == 200)) {
            if (_.isEmpty(companyInfo)) {
                callBackFn(error, null);
            } else {
                callBackFn(null, companyInfo);
            }
        } else {
            callBackFn(error, null);
        }
    });
}

function upsertCompanyInfo(companyInfo, callBackFn){
    if(!_.isEmpty(companyInfo._id)){
        request.put({
            baseUrl: config.url.dom,
            url: util.format('/api/v1/CompanyInfo/%s', companyInfo._id),
            json: companyInfo
        }, function (error, response, persistCompanyInfo) {
            if (!error && (response.statusCode == 200)) {
                if (_.isEmpty(persistCompanyInfo)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistCompanyInfo);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }else {
        request.post({
            baseUrl: config.url.dom,
            url: '/api/v1/CompanyInfo',
            json: companyInfo
        }, function (error, response, persistCompanyInfo) {
            if (!error && (response.statusCode == 201)) {
                if (_.isEmpty(persistCompanyInfo)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistCompanyInfo);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }
}
