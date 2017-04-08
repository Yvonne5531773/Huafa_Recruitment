

'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FamilySchema = new Schema({
    created: {
        type: Date, default: Date.now
    },
    updated: {
        type: Date
    },
    name: {
        type: String, default: '', trim: true
    },
    relation: {
        type: String
    },
    company: {
        type: String
    },
    position: {
        type: String
    },
    domicile: {
        type: String
    }
});

mongoose.model('Family', FamilySchema);
