/**
 * Created by LICA4 on 11/15/2016.
 */

var moment = require('moment');
var fs = require('fs');

moment.locale('zh-cn');

exports.base64_encode = function(file, dFile) {
    var bitmap = '';
    if(fs.existsSync(file)) {
        bitmap = fs.readFileSync(file);
    }else{
        bitmap = fs.readFileSync(dFile);
    }
    return new Buffer(bitmap).toString('base64');
}

exports.base64_decode = function(base64str, file) {
    var bitmap = new Buffer(base64str, 'base64');
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}
