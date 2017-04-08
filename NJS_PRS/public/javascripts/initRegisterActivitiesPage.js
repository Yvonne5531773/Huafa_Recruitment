/**
 * Created by CHENLA2 on 12/06/2016.
 */
var myFastRegister = (function () {

  var param = {
    vm: null
  };

  var onPageInit = function (page) {
    initViewModel();
    if (page.query && page.query.aid) {
      getActivities(page.query.aid);
    }
  };

  var initViewModel = function () {
    param.vm = new myFastRegisterViewModel();
    ko.applyBindings(param.vm, document.getElementById('myFastRegister'));

  };

  var getActivities = function (activityId) {
    commonFunction.loadDataWithAjax(
      interfaces.myRecreationClub.registerActivity + activityId,
      null,
      null,
      {
        showLoading: true,
        myApp: F7.instance()
      },
      function (data) {
        if (commonFunction.callbackValidate(data, F7.instance())) {
          return F7.mainView().router.back();
        }
        param.vm.items(data);
        console.log(data);
      },
      function (error) {
        param.vm.items([]);
        F7.instance().alert('Can not get data', 'Ooops', function () {
          F7.mainView().router.back();
        });
      }
    )

  };

  var saveData = function () {
    var saveData = {data: param.vm.items()};
    commonFunction.loadDataWithAjax(
      interfaces.myRecreationClub.saveRegisterActivity,
      null,
      saveData,
      {
        callType: "POST",
        showLoading: true,
        myApp: F7.instance()
      },
      function (data) {
        console.log('myFastRegister-->saveData: ' + data);
        F7.instance().alert('恭喜洪荒之力爆发', '报名成功', function () {
          F7.mainView().router.back();
        });
      },
      function (error) {
        F7.instance().alert('拿不到数据，待会儿再试试啦~', '哎呀呀', function () {
          F7.mainView().router.back();
        });
      }
    )
  };

  return {
    onPageInit: onPageInit,
    saveData: saveData
  }
})();

var myFastRegisterViewModel = function () {
  var self = this;
  self.items = ko.observableArray();
};
