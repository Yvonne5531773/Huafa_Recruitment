'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DictionarySchema = new Schema({
  category : {
    type: String, require: true
  },
  key: {
      type: String, require : true
  },
  value: {
      type: String, trim: true, require : true
  },
  icon : {
    type : String, require : false
  }
});

function dictionaryInit() {
  var Dictionary = mongoose.model('Dictionary');
  var dictTypePosition = new Dictionary({
    category : '字典类型',
    key : 'POSITION_TYPE',
    value : '职位管理-职位类型'
  }),
    dictTypeWelfare = new Dictionary({
      category : '字典类型',
      key : 'WELFARE_TYPE',
      value : '职位管理-职位福利'
    }),
    dictTypeCompanyCentral = new Dictionary({
      category : '字典类型',
      key : 'HR_CENTRAL_TYPE',
      value : '用人单位-本部'
    }),
      dictTypeCompanyPreschool = new Dictionary({
          category : '字典类型',
          key : 'HR_PRESCHOOL_TYPE',
          value : '用人单位-幼稚园'
      }),
      dictTypeCompanyPrimaryschool = new Dictionary({
          category : '字典类型',
          key : 'HR_PRIMARYSCHOOL_TYPE',
          value : '用人单位-小学'
      }),
      dictTypeCompanyMiddleschool = new Dictionary({
          category : '字典类型',
          key : 'HR_MIDDLESCHOOL_TYPE',
          value : '用人单位-中学'
      }),
      dictTypeCompanyHighschool = new Dictionary({
          category : '字典类型',
          key : 'HR_HIGHSCHOOL_TYPE',
          value : '用人单位-高中'
      }),
      dictTypeCompanyTrainschool = new Dictionary({
          category : '字典类型',
          key : 'HR_TRAINSCHOOL_TYPE',
          value : '用人单位-培训学校'
      }),
    dictTypeCompanyScale = new Dictionary({
        category : '字典类型',
        key : 'SCALE_TYPE',
        value : '用人单位-规模'
    });
    Dictionary.find({
      category : '字典类型',
      key : 'POSITION_TYPE',
      value : '职位管理-职位类型'
    }).then(result => {
      if (result.length ==0)
        dictTypePosition.save();
    });
    Dictionary.find({
      category : '字典类型',
      key : 'WELFARE_TYPE',
      value : '职位管理-职位福利'
    }).then(result => {
      if (result.length ==0)
        dictTypeWelfare.save();
    });
    Dictionary.find({
      category : '字典类型',
      key : 'HR_CENTRAL_TYPE',
      value : '用人单位-本部'
    }).then(result => {
      if (result.length ==0)
          dictTypeCompanyCentral.save();
    });
    Dictionary.find({
        category : '字典类型',
        key : 'HR_PRESCHOOL_TYPE',
        value : '用人单位-幼稚园'
    }).then(result => {
        if (result.length ==0)
            dictTypeCompanyPreschool.save();
    });
    Dictionary.find({
        category : '字典类型',
        key : 'HR_PRIMARYSCHOOL_TYPE',
        value : '用人单位-小学'
    }).then(result => {
        if (result.length ==0)
            dictTypeCompanyPrimaryschool.save();
    });
    Dictionary.find({
        category : '字典类型',
        key : 'HR_MIDDLESCHOOL_TYPE',
        value : '用人单位-中学'
    }).then(result => {
        if (result.length ==0)
            dictTypeCompanyMiddleschool.save();
    });
    Dictionary.find({
        category : '字典类型',
        key : 'HR_HIGHSCHOOL_TYPE',
        value : '用人单位-高中'
    }).then(result => {
        if (result.length ==0)
            dictTypeCompanyHighschool.save();
    });
    Dictionary.find({
        category : '字典类型',
        key : 'HR_TRAINSCHOOL_TYPE',
        value : '用人单位-培训学校'
    }).then(result => {
        if (result.length ==0)
            dictTypeCompanyTrainschool.save();
    });
    Dictionary.find({
        category : '字典类型',
        key : 'SCALE_TYPE',
        value : '用人单位-规模'
    }).then(result => {
        if (result.length ==0)
            dictTypeCompanyScale.save();
    });
}

mongoose.model('Dictionary', DictionarySchema);
dictionaryInit();
