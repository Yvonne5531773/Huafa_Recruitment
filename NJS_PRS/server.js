'use strict';

/**
 * Module dependencies.
 */
var app = require('./config/lib/app');
var weChat = require('./app/wechat/utils/weChat.util');

app.start();

weChat.getAccessToken();
setInterval(weChat.getAccessToken, 3600*1000);
