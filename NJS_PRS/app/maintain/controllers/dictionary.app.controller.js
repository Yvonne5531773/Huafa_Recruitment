'use strict';

var dictionaryService = require('../services/dictionary.app.service');
var logger = require('../../../config/lib/logger');

exports.getDictionarys = getDictionarys;
exports.upsertDictionary = upsertDictionary;
exports.deleteDictionary = deleteDictionary;

function getDictionarys(req, res, next){
    var criteria = req.body;
    dictionaryService.getDictionarys(criteria, function(err, datas){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{
            return res.json(datas);
        }
    });
}

function upsertDictionary(req, res, next){
    var dictionary = req.body;
    dictionaryService.upsertDictionary(dictionary, function(err, result){
        if (err) {
            logger.error(err);
            return res.json([]);
        }else{
            return res.json(result);
        }
    });
}

function deleteDictionary(req, res, next){
    var _id = req.body._id;
    dictionaryService.deleteDictionary(_id, function(err, result){
        if (err) {
            return res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
}