'use strict';

module.exports = {
  url :{
    dom : 'http://localhost:3000',
    h5: {
      host: 'lica4-w7',
      url: 'http://lica4-w7:3300/#/scene/create/',
      port: 3300
    }
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  upload: {
    dir: 'public/upload/'
  }
};
