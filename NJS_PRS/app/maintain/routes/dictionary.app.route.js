'use strict';

var acl = require('../../../config/lib/acl');
var dictionaryController = require('../controllers/dictionary.app.controller');

module.exports = function (app) {

    app.route('/api/dictionary/getDictionarys')
        .post(acl.isAllowed('dictionary:getDictionarys'), dictionaryController.getDictionarys);

    app.route('/api/dictionary')
        .post(acl.isAllowed('dictionary:upsertDictionary'), dictionaryController.upsertDictionary);

    app.route('/api/dictionary/deleteDictionary')
        .post(acl.isAllowed('dictionary:deleteDictionary'), dictionaryController.deleteDictionary);
};