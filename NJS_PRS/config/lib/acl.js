'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');
var _ = require('lodash');

/**
 * Invoke Permissions
 */
exports.invokeRolesPolicies = function () {
  // Using the memory backend
  acl = new acl(new acl.memoryBackend());

  acl.allow('管理', [
      'user:create',
      'user:findUsers',
      'user:deleteUser',
      'user:userFieldValidation',
      'user:getUser',
      'rc:activityUser:getActivityUsers',
      'rc:clubActivity:findClubActivitys',
      'rc:clubActivity:upsertClubActivity',
      'rc:clubActivity:deleteClubActivity',
      'rc:h5Template:getH5TemplatesByUser',
      'rc:h5Template:selectTemplateById',
      'rc:h5Template:deleteTemplateById',
      'rc:h5Template:createTplByH5',
      'rc:h5Template:getH5Url',
      'rc:recreationclub:findRecreationClubs',
      'rc:recreationclub:upsertRecreationClub',
      'rc:recreationclub:deleteRecreationClub',
      'rc:signupField:findFields',
      'rc:signupField:findSignupFields',
      'rc:signupField:upsertSignupField',
      'rc:signupField:deleteSignupField',
      'position:getPositions',
      'position:upsertPosition',
      'position:deletePosition',
      'position:getWorkAddr',
      'position:publishJob',
      'position:stopPublishJob',
      'dictionary:getDictionarys',
      'dictionary:upsertDictionary',
      'dictionary:deleteDictionary',
      'company:getCompanys',
      'company:upsertCompany',
      'company:deleteCompany',
      'company:changeCompanySegmentLayout',
      'companyInfo:getCompanyInfos',
      'companyInfo:upsertCompanyInfo',
      'progress:upsertProgress',
      'progress:getProgress'
  ], '*');

  acl.allow('普通', [
      'user:findUsers',
      'rc:activityUser:getActivityUsers',
      'rc:clubActivity:findClubActivitys',
      'rc:clubActivity:upsertClubActivity',
      'rc:clubActivity:deleteClubActivity',
      'rc:h5Template:getH5TemplatesByUser',
      'rc:h5Template:selectTemplateById',
      'rc:h5Template:deleteTemplateById',
      'rc:h5Template:createTplByH5',
      'rc:h5Template:getH5Url',
      'rc:recreationclub:findRecreationClubs',
      'rc:recreationclub:upsertRecreationClub',
      'rc:signupField:findFields',
      'rc:signupField:findSignupFields',
      'rc:signupField:upsertSignupField',
      'rc:signupField:deleteSignupField',
      'position:getPositions',
      'position:upsertPosition',
      'position:deletePosition',
      'position:getWorkAddr',
      'position:publishJob',
      'position:stopPublishJob',
      'dictionary:getDictionarys',
      'dictionary:upsertDictionary',
      'dictionary:deleteDictionary',
      'company:getCompanys',
      'company:upsertCompany',
      'company:deleteCompany',
      'company:changeCompanySegmentLayout',
      'companyInfo:getCompanyInfos',
      'companyInfo:upsertCompanyInfo',
      'progress:upsertProgress',
      'progress:getProgress'
  ], '*');

};

/**
 * Check If Policy Allows
 */
exports.isAllowed = function (resource) {
  return function (req, res, next) {
    var userInfo;
    if (req.session && req.session.userInfo) {
      userInfo = JSON.parse(req.session.userInfo);
    }
    var roles = (userInfo) ? userInfo.role : ['guest'];

    // Check for user roles
    acl.areAnyRolesAllowed(roles, resource, '*', function (err, isAllowed) {
      if (err) {
        // An authorization error occurred
        return res.status(500).send('Unexpected authorization error');
      } else {
        if (isAllowed) {
          // Access granted! Invoke next middleware
          return next();
        } else {
          return res.status(403).json({
            message: 'User is not authorized'
          });
        }
      }
    });
  }
};

/**
 * get Permissions by role
 */
exports.whatResources = function (roles, callback) {
  acl.whatResources(roles, function(err, result){
      if(err){
          return callback(err, result);
      }else{
          var policies = {
            roles : roles,
            permissions : _.keys(result)
          };
          return callback(null, policies);
      }
  });
};
