/**
 * Created by CHENLA2 on 12/19/2016.
 */

'use strict'


var _ = require('lodash');
var weChat = require('../utils/weChat.util');
var commonUserService = require('../services/commonUser.app.service');

exports.getUserInfo = getUserInfo;

function getUserInfo () {
  return function (req, res, next) {
    // Hardcode user info for loading test.
    // req.session.userInfo = JSON.stringify({'_id':'585bc24793000654ec5244de', 'userId':'CHENLA2', name: '陈伦波', email: 'lambert.l.b.chen@oocl.com'});
    
    var code = _.result(req, 'query.code');
    if (!_.isEmpty(req.session.userInfo)) {
      return next();
    } else if (_.isEmpty(code)) {
      return res.render('client/wechat/views/unAccess');
    }
    weChat.getUserInfo(code, function (err, userInfo) {
      if (_.isEmpty(userInfo))
        return res.render('client/wechat/views/unAccess');
      else {
        commonUserService.updateCommonUserByUserInfo(userInfo, function (err, commonUser) {
          if (err) {
            return;
          }
          commonUser.role = 'guest';
          req.session.userInfo = JSON.stringify(commonUser);
          return next();
        });
      }
    });
  }
}