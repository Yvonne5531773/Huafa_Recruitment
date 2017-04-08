'use strict';

module.exports = {
  url :{
    dom : 'http://dom:3000',
    h5: {
      host: 'h5-slide.cloud.dachuanqi.cn',
      url: 'http://h5-slide.cloud.dachuanqi.cn/#/scene/create/'
    }
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: process.env.LOG_FORMAT || 'combined',
    fileLogger: {
      directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
      fileName: process.env.LOG_FILE || 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  upload: {
    dir: 'public/upload/'
  },
    workAddr:
        [
            {
                type: 0,
                tag: '本部',
                name: ['华发教育公司']
            },
            {
                type: 1,
                tag: '幼稚园',
                name: ['珠海容闳国际幼稚园', '珠海高新区容闳幼儿园', '珠海斗门容闳国际幼稚园', '珠海市横琴中心幼儿园']
            },
            {
                type: 2,
                tag: '小学',
                name: ['珠海容闳学校', '珠海市横琴新区第一小学']
            },
            {
                type: 3,
                tag: '中学',
                name: ['珠海市南屏丰华路容闳书院(中学)', '珠海市横琴新区第一中学']
            },
            {
                type: 4,
                tag: '高中',
                name: ['珠海德威国际高中']
            },
            {
                type: 5,
                tag: '培训部',
                name: ['华发对外交流培训学校']
            }
        ]
};