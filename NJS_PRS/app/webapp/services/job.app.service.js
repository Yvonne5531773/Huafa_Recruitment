/**
 * Created by hfjylzh on 2/20/2017.
 */

'use strict';

var _ = require('lodash');
var request = require('request');
var util = require('util');
var config = require('../../../config/config');

exports.jobShow = jobShow;

function jobShow(criteria, callback) {
    request.get({
        uri: config.url.dom + util.format('/api/v1/Position?query=%s', encodeURIComponent(JSON.stringify(criteria))),
        json: true
    }, function (error, response, positions) {
        if (!error && (response.statusCode == 200)) {
            if (_.isEmpty(positions)) {
                callback(error, null);
            } else {
                callback(null, positions);
            }
        } else {
            callback(error, null);
        }
    });
}
