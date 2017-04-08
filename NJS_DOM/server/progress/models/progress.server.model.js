
'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');


var ProgressSchema = new Schema({

    applicant: {
        type: Schema.Types.ObjectId, ref: 'Applicant'
    },
    position: {
        type: Schema.Types.ObjectId, ref: 'Position'
    },
    viewed: {
        type: Date
    },
    accepted: {
        type: Date
    },
    interviewTime:{
        type: Date
    },
    interviewAddress:{
        type: String
    },
    name: {
        type: String
    },
    contact: {
        type: String
    },
    contactPhone: {
        type: String
    },
    content: {
        type: String
    }
});

mongoose.model('Progress', ProgressSchema);
