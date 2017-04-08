

'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CompanyInfoSchema = new Schema({
    created: {
        type: Date, default: Date.now
    },
    scale: {
        type: String, default: ''
    },
    type: {
        type: String, default: '', trim: true
    },
    address: {
        type: String, default: '', trim: true
    },
    icon: {
        type: String,
        default: 'images/school.png'
    },
    tele: {
        type: String, default: '', trim: true
    },
    company: [{
        type: Schema.Types.ObjectId, ref: 'Company'
    }]
});

mongoose.model('CompanyInfo', CompanyInfoSchema);
