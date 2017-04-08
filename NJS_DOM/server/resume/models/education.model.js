

'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EducationSchema = new Schema({
    created: {
        type: Date, default: Date.now
    },
    updated: {
        type: Date
    },
    degree: {
        type: String, default: ''
    },
    school: {
        type: String, default: '', trim: true
    },
    began: {
        type: String
    },
    ended: {
        type: String
    },
    profession: {
        type: String, default: ''
    },
    nature: {
        type: String, default: ''
    }
});

mongoose.model('Education', EducationSchema);
