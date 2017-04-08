'use strict';

var mongoose = require('mongoose');
var Company = mongoose.model('Company');

module.exports.changeCompanyLayout = function (req, res) {

  var segmentType = req.body.segmentType;
  var isFlow = req.body.isFlow;
    Company.update({'type' : segmentType},{$set: { 'isFlow': isFlow }},{multi: true},function(err, result){
    if(err){
      return res.status(400).json(err);
    }else{
      return res.status(200).json(result);
    }
  });
};