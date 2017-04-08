

'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CompanySchema = new Schema({
    created: {
        type: Date, default: Date.now
    },
    title: {
        type: String, default: '', trim: true, required: 'Title cannot be blank'
    },
    subTitle: {
        type: String, default: '', trim: true
    },
    content: {
        type: String
    },
    type:{
        type: String
    },
    sequence :{
        type: Number
    },
    isFlow : {
        type : Boolean, default : true
    },
    scale: {
        type: String, default: ''
    },
    name: {
        type: String, default: '', trim: true
    },
    address: {
        type: String, default: '', trim: true
    }
});

mongoose.model('Company', CompanySchema);
