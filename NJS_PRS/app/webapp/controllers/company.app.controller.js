/**
 * Created by hfjylzh on 2/20/2017.
 */

'use strict';

var indexService = require('../services/index.app.service');
var companyInfoService = require('../../maintain/services/companyInfo.app.service');
var dictionaryService = require('../../maintain/services/dictionary.app.service');
var logger = require('../../../config/lib/logger');
var _ = require('lodash');
var moment = require('moment');
var async = require('async');
var url = require('url');
var qs = require('querystring');

exports.companylist = companylist;
exports.showCompany = showCompany;

function companylist(req, res, next){
    var condition = req.params.condition;
    var applicant = req.session.applicant? req.session.applicant:{};
    async.waterfall(
        [
            function(callback){
                dictionaryService.getDictionarys({category:{'$in':['用人单位-本部','用人单位-幼稚园','用人单位-小学',
                    '用人单位-中学','用人单位-高中','用人单位-培训学校',]}}, function(err, result){
                    var allWorkAddrs = {};
                    allWorkAddrs.centrals=[],allWorkAddrs.preschools=[],allWorkAddrs.primaryschools=[],
                        allWorkAddrs.middleschools=[],allWorkAddrs.highschools=[],allWorkAddrs.trainschools=[];
                    if(result) {
                        _.forEach(result, function(data){
                            if(data.category==='用人单位-本部') allWorkAddrs.centrals.push(data);
                            else if(data.category==='用人单位-幼稚园') allWorkAddrs.preschools.push(data);
                            else if(data.category==='用人单位-小学') allWorkAddrs.primaryschools.push(data);
                            else if(data.category==='用人单位-中学') allWorkAddrs.middleschools.push(data);
                            else if(data.category==='用人单位-高中') allWorkAddrs.highschools.push(data);
                            else if(data.category==='用人单位-培训学校') allWorkAddrs.trainschools.push(data);
                        });
                        callback(null, {allWorkAddrs: allWorkAddrs, result: result});
                    }
                });
            }
        ],
        function(err, result){
            var array = [];
            switch(condition){
                case '0': array = _.map(result.result,function(res){return res.value});break;
                case '1': array = _.map(result.allWorkAddrs.centrals,function(res){return res.value});break;
                case '2': array = _.map(result.allWorkAddrs.preschools,function(res){return res.value});break;
                case '3': array = _.map(result.allWorkAddrs.primaryschools,function(res){return res.value});break;
                case '4': array = _.map(result.allWorkAddrs.middleschools,function(res){return res.value});break;
                case '5': array = _.map(result.allWorkAddrs.highschools,function(res){return res.value});break;
                case '6': array = _.map(result.allWorkAddrs.trainschools,function(res){return res.value});break;
            }
            companyInfoService.getCompanyInfos({type:{'$in': array}},function(err, companyInfos) {
                res.render('./app/webapp/views/companylist', {
                    applicant: applicant,
                    allWorkAddrs: result.allWorkAddrs,
                    conditionCompany: true,
                    condition: condition,
                    workAddrs: result.result,
                    companyInfos: companyInfos
                });
            });
        });
}

function showCompany(req, res, next){
    var _id = req.params._id;
    var applicant = req.session.applicant? req.session.applicant:{};
    async.waterfall(
        [
            function(callback) {
                companyInfoService.getCompanyInfos({_id: _id}, function (err, companyInfos) {
                    if(!_.isEmpty(companyInfos))
                        callback(null, companyInfos[0])
                    else
                        callback(null, {})
                });
            },
            function(obj, callback) {
                if(!_.isEmpty(obj)) {
                    indexService.index({workAddr: obj.type}, function (err, positions) {
                        if (!_.isEmpty(positions)) {
                            _.forEach(positions, function (position) {
                                position.updated = moment(position.updated).format('YYYY-MM-DD');
                            });
                            callback(null, {companyInfo: obj, positions: positions});
                        } else
                            callback(null, {companyInfo: obj, positions: []});
                    });
                }
            },
        ],
        function(err, result){
            if(!_.isEmpty(result))
                res.render('./app/webapp/views/showCompany', {
                    applicant: applicant,
                    conditionCompany: true,
                    companyInfo: result.companyInfo,
                    positions: result.positions
                });
        }
    );

}