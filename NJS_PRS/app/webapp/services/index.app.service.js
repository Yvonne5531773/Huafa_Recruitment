/**
 * Created by hfjylzh on 2/20/2017.
 */

'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');
var suggest = require('../../../config/h/suggest');

exports.index = index;
exports.getSuggest = getSuggest;

function index(criteria, callback) {
    request.post({
        baseUrl: config.url.dom,
        url: util.format('/api/position/index'),
        json: criteria
    }, function (error, response, result) {
        if(error) callback(error, null);
        if (result) {
            callback(null, result);
        }else{
            callback(null, null);
        }
    });
}

function getSuggest(criteria, callback) {

    callback(null, suggest.content);
}