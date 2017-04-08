'use strict';
var express = require('express');
var core = require('../controllers/core.app.controller');

module.exports = function (app, contextPath) {
  // Root routing
  var router = express.Router(); 

  // Define error pages
  router.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  router.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  router.route('/login').get(core.renderLogin);
  router.route('/').get(core.renderLogin);
  
  // Define application route
  router.route('/platform/*').get(core.renderIndex);

  //login
  //app.route('/login').get(core.renderLogin);
  app.use('/maintain', router);
};
