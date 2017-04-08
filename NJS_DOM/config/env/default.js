'use strict';

module.exports = {
  app: {
    title: 'NJS_DOM',
  },
  contextPath: '/njs_dom',
  db: {
    promise: global.Promise
  },
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  staticPath : './public',
  viewPath: './',
  templateEngine: 'swig',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.app
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'MEAN',
  // sessionKey is set to the generic sessionId key used by PHP applications
  // for obsecurity reasons
  //sessionKey: 'sessionId',
  //sessionCollection: 'sessions',
  // Lusca config
  csrf: {
    csrf: false,
    csp: { /* Content Security Policy object */},
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },
  favicon:'favicon.ico',
  assets:{
    server :{
      allJS: ['server.js', 'config/**/*.js', 'server/**/*.js'],
      models: 'server/*/models/**/*.js',
      routes: ['server/!(core)/routes/**/*.js', 'server/core/routes/**/*.js']
    }
  }
};
