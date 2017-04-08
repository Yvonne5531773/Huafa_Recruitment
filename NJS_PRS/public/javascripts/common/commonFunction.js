/**
 * Created by CHENLA2 on 10/27/2016.
 */

var commonFunction = (function(){
    var loadDataWithAjax = function(url,headerData,postData,param,callBackSucceed,callBackFailed) {
        if(param.showLoading){
            if(param.loadingText){
                if(param.myApp){
                    param.myApp.showIndicator();
                }
            }
            else {
                if(param.myApp){
                    param.myApp.showIndicator();
                }
            }
        }
        jQuery.support.cors = true;
        console.log("url: " + url);
        return $.ajax({
            type : (param.callType != null)?(param.callType||'GET'):'GET',
            url :  url,
            //contentType : (param.contentType != null)?(param.contentType||'application/json'):'application/json',
            //dataType : (param.dataType != null)?(param.dataType||'json'):'json',
            cache : false,
            data: postData,
            headers: headerData,
            success : function(data, textStatus, request) {
                if(param.showLoading){
                    if(param.myApp){
                        param.myApp.hideIndicator();
                    }
                }
                if(data.success == false){
                    if(callBackFailed){
                        callBackFailed(data.error);
                    }
                    return;
                }
                if (callBackSucceed){
                    callBackSucceed(data);
                }
            },
            error : function(XMLHttpRequest,textStatus, errorThrown) {
                if(param.showLoading){
                    if(param.myApp){
                        param.myApp.hideIndicator();
                    }
                }
                if(textStatus == "abort"){
                    return;
                };
                if(callBackFailed){
                    callBackFailed();
                }
            }
        });
    };

    var callbackValidate = function(data, instance){
        if(data.errorMsg){
            instance.alert('Can not get data', 'Ooops');
            return true;
        } else{
            return false;
        }
    };

    var base64_encode = function(file) {
        var bitmap = fs.readFileSync(file);
        return new Buffer(bitmap).toString('base64');
    }

    var base64_decode = function(base64str, file) {
        var bitmap = new Buffer(base64str, 'base64');
        fs.writeFileSync(file, bitmap);
        console.log('******** File created from base64 encoded string ********');
    }

    return {
        loadDataWithAjax : loadDataWithAjax,
        callbackValidate : callbackValidate,
        base64_encode: base64_encode,
        base64_decode: base64_decode
    }
})();
