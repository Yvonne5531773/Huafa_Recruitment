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

exports.index = index;
exports.clearSearch = clearSearch;
exports.getSuggest = getSuggest;

function index(req, res, next){
    var params = url.parse(req.url).query,
        applicant = req.session.applicant? req.session.applicant:{};
    console.log('in index params', params)
    req.session.search = req.session.search? req.session.search : {};
    req.session.search_c = req.session.search_c? req.session.search_c : {};
    if(!_.isEmpty(qs.parse(params).salary)){
        switch(qs.parse(params).salary){
            case '2k以下':
                req.session.search.salaryLow = {$gte: 0, $lte: 2};
                req.session.search_c.salary = '2k以下';
                break;
            case '2k-5k':
                req.session.search.salaryLow = {$gte: 2, $lte: 5};
                req.session.search_c.salary = '2k-5k';
                break;
            case '5k-10k':
                req.session.search.salaryLow = {$gte: 5, $lte: 10};
                req.session.search_c.salary = '5k-10k';
                break;
            case '10k-15k':
                req.session.search.salaryLow = {$gte: 10, $lte: 15};
                req.session.search_c.salary = '10k-15k';
                break;
            case '15k-25k':
                req.session.search.salaryLow = {$gte: 15, $lte: 25};
                req.session.search_c.salary = '15k-25k';
                break;
            case '25k-50k':
                req.session.search.salaryLow = {$gte: 25, $lte: 50};
                req.session.search_c.salary = '25k-50k';
                break;
            case '50k以上':
                req.session.search.salaryLow = {$gte: 50};
                req.session.search_c.salary = '50k以上';
                break;
            case '面议':
                req.session.search.negotiable = true;
                req.session.search_c.salary = '面议';
                break;
        }
        req.session.search_c.salaryShow = '';
    }
    if(!_.isUndefined(qs.parse(params).name)){
        req.session.search.name = {'$regex':'^(.*'+qs.parse(params).name+'.*)$'};
        req.session.search_c.name = qs.parse(params).name;
        req.session.search_c.nameShow = '';
    }
    if(!_.isEmpty(qs.parse(params).experience)){
        // if(qs.parse(params).experience!=='不限')
            req.session.search.experience = qs.parse(params).experience;
        // else delete req.session.search.experience
        req.session.search_c.experience = qs.parse(params).experience;
        req.session.search_c.experienceShow = '';
    }
    if(!_.isEmpty(qs.parse(params).city)){
        if(qs.parse(params).city!=='全国')
            req.session.search.city = qs.parse(params).city;
        else delete req.session.search.city
        req.session.search_c.city = qs.parse(params).city;
        req.session.search_c.cityShow = '';
    }
    if(!_.isEmpty(qs.parse(params).workAddress)){
        if(qs.parse(params).workAddress!=='全部')
            req.session.search.workAddr = qs.parse(params).workAddress;
        else delete req.session.search.workAddr
        req.session.search_c.workAddress = qs.parse(params).workAddress;
        req.session.search_c.workAddressShow = '';
    }
    if(!_.isEmpty(qs.parse(params).nature)){
        req.session.search.nature = qs.parse(params).nature;
        req.session.search_c.nature = qs.parse(params).nature;
        req.session.search_c.natureShow = '';
    }
    if(!_.isEmpty(qs.parse(params).certificate)){
        // if(qs.parse(params).certificate!=='不限')
            req.session.search.certificate = qs.parse(params).certificate;
        // else delete req.session.search.certificate
        req.session.search_c.certificate = qs.parse(params).certificate;
        req.session.search_c.certificateShow = '';
    }
    if(req.session.search.name===''&&req.session.search.experience===''&&req.session.search.city===''&&req.session.search.salaryLow===''&&
        req.session.search.workAddress===''&&req.session.search.nature===''&&req.session.search.certificate===''){
        req.session.search_c.all = 'dn';
    }else{
        req.session.search_c.all = '';
    }
    console.log('in index',req.session.search )
    indexService.index(req.session.search, function(err, result){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{
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

                                callback(null, {allWorkAddrs: allWorkAddrs});
                            }
                        });
                    },
                    function(obj, callback){
                        var workAddr = [];
                        _.forEach(result, function(res){
                            res.updated = moment(res.updated).format('YYYY-MM-DD HH:mm');
                            workAddr.push(res.workAddr);
                        });
                        callback(null, {result: result, workAddr: workAddr, allWorkAddrs: obj.allWorkAddrs});
                    }
                ],
                function(err, result){
                    companyInfoService.getCompanyInfos({type:{'$in': result.workAddr}},function(err, companyInfos) {
                        _.forEach(companyInfos, function(companyInfo){
                            _.forEach(result.result, function(res){
                                if(companyInfo.type === res.workAddr){
                                    res.companyInfo = companyInfo;
                                }
                            })
                        });
                        res.render('./app/webapp/views/index', {
                            positions: result.result,
                            conditionIndex: true,
                            applicant: applicant,
                            search: req.session.search_c,
                            allWorkAddrs: result.allWorkAddrs,
                            showWorkAddrs: result.allWorkAddrs.centrals.concat(result.allWorkAddrs.primaryschools)
                        });
                    });
                });
        }
    });
}

function clearSearch(req, res, next){
    var id = req.params.id;
    switch(id){
        case '1':
            delete req.session.search.negotiable;
            delete req.session.search.salaryLow;
            delete req.session.search_c.salary;
            req.session.search_c.salaryShow = 'dn';
            break;
        case '2':
            delete req.session.search.experience;
            delete req.session.search_c.experience;
            req.session.search_c.experienceShow = 'dn';
            break;
        case '3':
            delete req.session.search.city;
            delete req.session.search_c.city;
            req.session.search_c.cityShow = 'dn';
            break;
        case '4':
            delete req.session.search.certificate;
            delete req.session.search_c.certificate;
            req.session.search_c.certificateShow = 'dn';
            break;
        case '5':
            delete req.session.search.nature;
            delete req.session.search_c.nature;
            req.session.search_c.natureShow = 'dn';
            break;
        case '6':
            delete req.session.search.name;
            delete req.session.search_c.name;
            req.session.search_c.nameShow = 'dn';
            break;
        case '7':
            delete req.session.search.workAddr;
            delete req.session.search_c.workAddress;
            req.session.search_c.workAddressShow = 'dn';
            break;
    }
    res.redirect('/index');
}

function getSuggest(req, res, next){
    indexService.getSuggest({}, function(err, datas){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{
            return res.json(datas);
        }
    });
}