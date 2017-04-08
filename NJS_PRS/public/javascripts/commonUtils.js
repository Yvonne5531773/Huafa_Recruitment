/**
 * Created by CHENLA2 on 12/20/2016.
 */
var myUtils = (function () {

  var isFocus=function(clubId){
    commonFunction.loadDataWithAjax(
      interfaces.myRecreationClub.getIsFocus + clubId,
      null,
      null,
      {
        showLoading : true,
        myApp :  F7.instance()
      },
      function(data){
        console.log('getIsFocus');
        console.log(data);
        if(data.length!=0){
          console.log('Run getIsFocus');
          $('.favorImg').attr("src","./images/demo/focused.png");
          $('.favorWord').css("color","#df5945").text('已关注');
        }
      },
      function(error){
        // param.vm.items([]);
        // F7.instance().alert('Can not get data', 'Ooops', function () {
        //     F7.mainView().router.back();
        // });
      }
    )
  };

  var focusClub = function (clubId) {
    commonFunction.loadDataWithAjax(
      interfaces.myRecreationClub.focusClub,
      null,
      {
        clubId : clubId
      },
      {
        callType: "POST",
        showLoading: true,
        myApp: F7.instance()
      },
      function (data) {
        console.log("favor club is OK with data: " + data);
        $('.favorImg').attr('src', './images/demo/focused.png');
        $('.favorWord').css("color","#df5945").text('已关注');
        myClubList.refreshFocusClubs();
      },
      function (error) {
        console.log(error);
        F7.instance().alert('关注失败', 'Ooops', function () {
          // F7.mainView().router.back();
        });
      }
    )
  };

  var cancelFocus=function(clubId){
    commonFunction.loadDataWithAjax(
      interfaces.myRecreationClub.cancelFocus + clubId,
      null,
      null,
      {
        showLoading : true,
        myApp :  F7.instance()
      },
      function(data){
        console.log(data);
        if(data.length!=0){
          console.log('Run cancelFocus');
          $('.favorImg').attr("src","./images/demo/unfocused.png");
          $('.favorWord').css("color","#fff").text('关注');
        }
        myClubList.refreshFocusClubs();
      },
      function(error){
        // param.vm.items([]);
        // F7.instance().alert('Can not get data', 'Ooops', function () {
        //     F7.mainView().router.back();
        // });
      }
    )
  };

  var switchFocus = function (clubId) {
    if ($('.favorWord').text() === '关注') {
      focusClub(clubId);
    } else {
      cancelFocus(clubId);
    }
  };

  function getOperationTime(date) {
    var updateDate = new Date(date);
    if (!updateDate) {
      return '';
    }
    var month = updateDate.getMonth() < 10 ? '0' + updateDate.getMonth() : updateDate.getMonth();
    month ++;
    var day = updateDate.getDate() < 10 ? '0' + updateDate.getDate() : updateDate.getDate();
    var hour = updateDate.getHours() < 10 ? '0' + updateDate.getHours() : updateDate.getHours();
    var minute = updateDate.getMinutes() < 10 ? '0' + updateDate.getMinutes() : updateDate.getMinutes();
    //   var second = updateDate.getSeconds() < 10 ? '0' + updateDate.getSeconds() : updateDate.getSeconds();
    var time = updateDate.getFullYear() + '/' + month + '/' + day + ' ' + hour + ':' + minute;
    //   + ':' + second;
    return time;
  };

  return {
    isFocus : isFocus,
    cancelFocus: cancelFocus,
    switchFocus: switchFocus,
    getOperationTime: getOperationTime
  }
})();
