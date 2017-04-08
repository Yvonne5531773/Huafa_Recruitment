

'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WorkSchema = new Schema({
    created: {
        type: Date, default: Date.now
    },
    updated: {
        type: Date
    },
    company: {
        type: String, default: ''
    },
    position: {
        type: String, default: '', trim: true
    },
    yearStart: {
        type: String
    },
    yearEnd: {
        type: String
    },
    monthStart: {
        type: String
    },
    monthEnd: {
        type: String
    }
});

mongoose.model('Work', WorkSchema);
