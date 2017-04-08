/**
 * Created by hfjylzh on 2/20/2017.
 */

'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');
var suggest = require('../../../config/h/suggest');

exports.upsertCertificate = upsertCertificate;
exports.deleteCertificate = deleteCertificate;

function upsertCertificate(certificate, callBackFn){
    if(!_.isEmpty(certificate._id)){
        certificate.updated = new Date();
        request.put({
            baseUrl: config.url.dom,
            url: util.format('/api/v1/Certificate/%s', certificate._id),
            json: certificate
        }, function (error, response, persistCertificate) {
            if (!error && (response.statusCode == 200)) {
                if (_.isEmpty(persistCertificate)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistCertificate);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }else {
        certificate.updated = new Date();
        certificate.created = new Date();
        request.post({
            baseUrl: config.url.dom,
            url: '/api/v1/Certificate',
            json: certificate
        }, function (error, response, persistCertificate) {
            if (!error && (response.statusCode == 201)) {
                if (_.isEmpty(persistCertificate)) {
                    callBackFn(error, null);
                } else {
                    callBackFn(null, persistCertificate);
                }
            } else {
                callBackFn(error, null);
            }
        });
    }
}

function deleteCertificate(_id, callback) {
    request.del({
        baseUrl: config.url.dom,
        url: util.format('/api/v1/Certificate/%s', _id),
        json: true
    }, function (error, response, body) {
        if (!error) {
            return callback(null, null);
        } else {
            return callback(error, null);
        }
    });
}