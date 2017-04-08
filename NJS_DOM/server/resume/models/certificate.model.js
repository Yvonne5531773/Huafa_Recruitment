

'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CertificateSchema = new Schema({
    created: {
        type: Date, default: Date.now
    },
    updated: {
        type: Date
    },
    name: {
        type: String, default: '', trim: true
    },
    nature: {
        type: String, default: '', trim: true
    },
    gotYear: {
        type: String
    },
    gotMonth: {
        type: String
    }
});

mongoose.model('Certificate', CertificateSchema);
