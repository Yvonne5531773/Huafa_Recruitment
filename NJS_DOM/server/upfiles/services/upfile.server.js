'use strict';


var upfileModel = require('../models/upfile.model.js').UpfileModel;


exports.deleteUpfiles = function (upfiles, callback) {

    callback = callback || _.noop;

    var ids = upfiles.map(function (m) {
        return m._id;
    });
    upfileModel.remove({_id: {$in : ids} }, callback);
};