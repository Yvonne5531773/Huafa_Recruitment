/**
 * Created by lica4 on 11/20/2016.
 */
'use strict';
var path = require('path'),
    _ = require('lodash'),
    h5TemplateService = require('../services/h5template.app.service'),
    tool = require('../common/tool'),
    moment = require('moment')


module.exports.getH5TemplatesByUser = function (req, res, next) {
    var data = req.body;
    h5TemplateService.getH5TemplatesByUser(data, function(err, result){
        if(result) {
            var templates = result.templates;
            if (templates && templates.length > 0) {
                templates.forEach(function (template, i) {
                    var cover = template.name + '_' + template._id + '.jpg'
                    var path = 'public/images/templates/' + cover;
                    tool.base64_decode(template.cover, path);
                    template.cover = path.substr(path.indexOf('/'));
                })
            }
            result.templates = templates;
        }
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
};

module.exports.selectTemplateById = function (req, res, next) {
    var data = req.body
    h5TemplateService.selectTemplateById(data, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
};

module.exports.deleteTemplateById = function (req, res, next) {
    var data = req.body
    h5TemplateService.deleteTemplateById(data, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
};

module.exports.createTplByH5 = function (req, res, next) {

    h5TemplateService.synUserToLoginH5ByWS(req.body.user);
    h5TemplateService.synToCreateH5ByWS(req.body);
};

module.exports.getH5Url = function (req, res, next) {

    h5TemplateService.getH5Url(function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
}


