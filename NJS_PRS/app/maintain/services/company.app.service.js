'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');

exports.getCompanys = getCompanys;
exports.upsertCompany = upsertCompany;
exports.deleteCompany = deleteCompany;
exports.changeCompanySegmentLayout = changeCompanySegmentLayout;

function getCompanys(criteria, callBackFn) {
    var query = criteria;
    if(!_.isEmpty(_.result(criteria, '_id'))){
        query._id ={'$regex':'^('+criteria._id+')'};
    }
    // if(!_.isEmpty(_.result(criteria, 'type'))){
    //     query.type ={'$regex':'^('+criteria.type+')'};
    // }
    console.log('in getCompanys',query);
    request.get({
        uri: config.url.dom+util.format('/api/v1/Company?query=%s&sort=sequence', encodeURIComponent(JSON.stringify(query))),
        json: true
    }, function (error, response, companys) {
        console.log('in getCompanys companys',companys);
        if (!error && (response.statusCode == 200)) {
            if (_.isEmpty(companys)) {
                callBackFn(error, null);
            } else {
                callBackFn(null, companys);
            }
        } else {
            callBackFn(error, null);
        }
    });
}

function upsertCompany(company, callBackFn){
    if(!_.isEmpty(company._id)){
        request.put({
            baseUrl: config.url.dom,
            url: util.format('/api/v1/Company/%s', company._id),
            json: company
        }, function (error, response, persistCompany) {
            if (!error && (response.statusCode == 200)) {
                if (_.isEmpty(persistCompany)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistCompany);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }else {
        request.post({
            baseUrl: config.url.dom,
            url: '/api/v1/Company',
            json: company
        }, function (error, response, persistCompany) {
            if (!error && (response.statusCode == 201)) {
                if (_.isEmpty(persistCompany)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistCompany);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }
}

function deleteCompany(companyId, callBackFn){
    request.del({
        baseUrl: config.url.dom,
        url: util.format('/api/v1/Company/%s', companyId),
        json: true
    }, function (error, response, body) {
        if (!error && (response.statusCode == 204)) {
            return callBackFn(null, null);
        } else {
            return callBackFn(error, null);
        }
    });
}

function changeCompanySegmentLayout(criteria, callBackFn){
    request.put({
        baseUrl: config.url.dom,
        url: util.format('/api/company/changeCompanyLayout'),
        json: criteria
    }, function (error, response, body) {
        if (!error && (response.statusCode == 204)) {
            return callBackFn(null, null);
        } else {
            return callBackFn(error, null);
        }
    });
}
