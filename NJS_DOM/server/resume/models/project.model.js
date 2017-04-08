

'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    created: {
        type: Date, default: Date.now
    },
    updated: {
        type: Date
    },
    name: {
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
    },
    description: {
        type: String, default: ''
    }
});

mongoose.model('Project', ProjectSchema);
