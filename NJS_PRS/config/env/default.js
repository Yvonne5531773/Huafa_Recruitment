'use strict';

module.exports = {
  app: {
    title: 'NJS_PRS'
  },
  port: process.env.PORT || 110,
  host: process.env.HOST || '0.0.0.0',
  staticPath: './public',
  viewPath: './',
  templateEngine: 'swig',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    // maxAge: 24 * (60 * 60 * 1000),
    maxAge: 60 * 60 * 1000,
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
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
    csp: { /* Content Security Policy object */ },
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },
  favicon: 'favicon.ico',
  assets: {
    server: {
      allJS: ['server.js', 'config/**/*.js', 'app/**/*.js'],
      routes: ['app/**/routes/**/*.js', 'client/wechat/routes/*.js']
    },
    client: {
      lib: {
        css: [
          // bower:css
            'public/lib/bootstrap/dist/css/bootstrap-theme.css',
            'public/lib/angular-ui-grid/ui-grid.min.css',
            'public/lib/AngularJS-Toaster/toaster.css',
            'public/lib/font-awesome/css/font-awesome.min.css',
            'public/lib/AdminLTE/dist/css/AdminLTE.min.css',
            'public/lib/AdminLTE/dist/css/skins/skin-blue.min.css',
            'public/lib/bootstrap/dist/css/bootstrap.css',
            'public/lib/angular-ui-select/dist/select.min.css',
            'public/lib/datetimepicker/build/jquery.datetimepicker.min.css',
            'public/css/company.css',
            'public/css/resume-preview.css',
            'public/css/external.css',
            'public/lib/bootstrap/dist/css/bootstrap-theme.css',
            'public/lib/jquery-confirm2/dist/jquery-confirm.min.css',
            'public/lib/ng-dialog/css/ngDialog.css',
            'public/lib/ng-dialog/css/ngDialog-theme-default.css',
            'public/lib/select2/dist/css/select2.css',
            'public/lib/select2-bootstrap-theme/dist/select2-bootstrap.css',
            'public/customize_lib/jRange/jquery.range.css',
            'public/lib/handsontable/dist/handsontable.full.css'
          // endbower
        ],
        js: [
          // bower:js
          //'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
            'public/lib/jquery/dist/jquery.min.js',
            'public/lib/angular/angular.js',
            'public/lib/angular-resource/angular-resource.js',
            'public/lib/angular-animate/angular-animate.js',
            'public/lib/angular-messages/angular-messages.js',
            'public/lib/angular-sanitize/angular-sanitize.js',
            'public/lib/angular-ui-router/release/angular-ui-router.js',
            'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
            'public/lib/angular-ui-grid/ui-grid.js',
            'public/lib/angular-cookies/angular-cookies.min.js',
            'public/lib/datetimepicker/build/jquery.datetimepicker.full.min.js',
            'public/lib/pdfmake/build/pdfmake.js',
            'public/lib/pdfmake/build/vfs_fonts.js',
            'public/customize_lib/ueditor/ueditor.config.js',
            'public/customize_lib/ueditor/ueditor.all.js',
            'public/customize_lib/angular-ueditor/dist/angular-ueditor.js',
            'public/customize_lib/jRange/jquery.range.js',
            'public/lib/AngularJS-Toaster/toaster.js',
            'public/lib/AdminLTE/bootstrap/js/bootstrap.min.js',
            'public/lib/AdminLTE/dist/js/app.min.js',
            'public/lib/AdminLTE/plugins/morris/morris.js',
            'public/lib/AdminLTE/plugins/knob/jquery.knob.js',
            'public/lib/AdminLTE/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js',
            'public/lib/AdminLTE/plugins/slimScroll/jquery.slimscroll.min.js',
            'public/lib/AdminLTE/plugins/fastclick/fastclick.js',
            'public/lib/AdminLTE/plugins/sparkline/jquery.sparkline.min.js',
            'public/lib/angular-ui-select/dist/select.min.js',
            'public/lib/jquery-confirm2/dist/jquery-confirm.min.js',
            'public/lib/echarts/dist/echarts.min.js',
            'public/lib/ng-file-upload/ng-file-upload.min.js',
            'public/lib/ng-file-upload-shim/ng-file-upload-shim.min.js',
            'public/lib/ng-dialog/js/ngDialog.min.js',
            'public/lib/select2/dist/js/select2.full.js',
            'public/lib/ng-lodash/build/ng-lodash.js',
            'public/lib/handsontable/dist/handsontable.full.js',
            'public/lib/ngHandsontable/dist/ngHandsontable.js'
          // endbower
        ]
      },
      css: [
        'client/**/css/*.css'
      ],
      js: [
        'client/maintain/core/app/config.js',
        'client/maintain/core/app/init.js',
        'client/maintain/*/*.js',
        'client/maintain/*/**/*.js'
      ],
      img: [
        'client/**/*/img/**/*.jpg',
        'client/**/*/img/**/*.png',
        'client/**/*/img/**/*.gif',
        'client/**/*/img/**/*.svg'
      ],
      views: [
          'client/*/views/**/*.html',
          'client/*/views/*.html'
      ],
      templates: ['build/templates.js']
    }
  }
};
