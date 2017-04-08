'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  chalk = require('chalk'),
  path = require('path'),
  mongoose = require('mongoose');

// Load the mongoose models
module.exports.loadModels = function (callback) {
  // Globbing model files
  config.files.server.models.forEach(function (modelPath) {
    require(path.resolve(modelPath));
  });

  if (callback) callback();
};

// Initialize Mongoose
module.exports.connect = function (cb) {
  var _this = this;

  var db = mongoose.connect(config.db.uri, config.db.options, function (err) {
    // Log Error
    if (err) {
      console.error(chalk.red('Could not connect to MongoDB!'));
      console.log(err);
    } else {

      mongoose.Promise = config.db.promise;

      // Enabling mongoose debug mode if required
      mongoose.set('debug', config.db.debug);

      // Call callback FN
      if (cb) cb(db);
    }
  });
};

module.exports.disconnect = function (cb) {
  mongoose.disconnect(function (err) {
    console.info(chalk.yellow('Disconnected from MongoDB.'));
    cb(err);
  });
};

module.exports.initLoginUser = function(){
  var User = mongoose.model('Loginuser');
  var query = User.findOne({userid:'admin'});
  query.exec(function (err, orginalUser) {
    if (err) {
      return next(err);
    } else if (!orginalUser) {
      var user = new User({
        userid      : 'admin',
        accountType : 'local',
        role        : '管理',
        password    : 'admin4'
      });
      user.save(function (err) {
        if (err) {
          return console.log(err);
        } else {
          return console.log(user);
        }
      });
    }
  });
}