/**
 * Created by CHENLA2 on 11/10/2016.
 */

var myRoute = (function () {

  var loadClubActivities = function (clubId) {
    var url = "activities?cid=" + clubId;
    F7.mainView().router.loadPage(url);
  };

  var loadClubDetails = function (clubId) {
    var url = "clubDetails?cid=" + clubId;
    F7.mainView().router.loadPage(url);
  };

  var loadActivityDetail = function (activityId) {
    var url = "activityDetails?aid=" + activityId;
    console.log('url: ' + url);
    F7.mainView().router.loadPage(url);
  };

  var registerActivity = function (activityId) {
    var url = "signActivity?aid=" + activityId;
    F7.mainView().router.loadPage(url);
  };

  // Lambert : please remove below method "focusClub" as it is not belong to Route method.
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

      },
      function (error) {
        console.log(error);
        F7.instance().alert('关注失败', 'Ooops', function () {
          // F7.mainView().router.back();
        });
      }
    )
  };

  return {
    loadClubActivities: loadClubActivities,
    registerActivity: registerActivity,
    loadActivityDetail: loadActivityDetail,
    loadClubDetails: loadClubDetails,
    focusClub: focusClub
  }

})();