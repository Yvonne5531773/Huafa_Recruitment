

'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResumeSchema = new Schema({
    resumename: {type: String, default: '', trim: true},
    created: {type: Date, default: Date.now},
    updated: {type: Date},
    name: {type: String, default: '', trim: true},
    icon: {type: String},
    gender: {type: String, default: ''},
    nation: {type: String, default: ''},
    birthed: {type: Date},
    origin:{type: String, default: ''},
    domicile:{type: String, default: ''},
    politic :{type: String, default: ''},
    experience: {type: String, default: ''},
    status: {type: String},
    height : {type : Number},
    weight: {type: Number},
    married: {type: String},
    idCard: {type: String},
    phone: {type: String, default: ''},
    address: {type: String, default: ''},
    email: {type: String, default: ''},
    health: {type: String},
    child: {type: String},
    workunit: {type: String},
    post: {type: String},
    honor: {type: String},
    strength: {type: String},
    prize: {type: String},
    education: [{type: Schema.Types.ObjectId, ref: 'Education'}],
    work: [{type: Schema.Types.ObjectId, ref: 'Work'}],
    project: [{type: Schema.Types.ObjectId, ref: 'Project'}],
    family: [{type: Schema.Types.ObjectId, ref: 'Family'}],
    certificate: [{type: Schema.Types.ObjectId, ref: 'Certificate'}]
});

mongoose.model('Resume', ResumeSchema);
