/**
 * Created by SUKE3 on 11/10/2016.
 */

var myClubList = (function () {

    var param = {
        vm: null
    };

    var onPageInit = function (page) {
        initViewModel();
        getMyFocusClubs();
        getActivities();
    };

    var initViewModel = function () {
        param.vm = new myClubViewModel();
        ko.applyBindings(param.vm, document.getElementById('myClubList'));

    };

    var getMyFocusClubs = function () {
        commonFunction.loadDataWithAjax(
          interfaces.myRecreationClub.getMyFocusClubs + '10086',
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
              param.vm.clubs(data.myFocusClubs.favouriteClub);
              param.vm.noFocusClubs(data.notFocusClubs);
              console.log('==(favouriteClub) ==>: getMyFocusClubs: ' + data.myFocusClubs);
              $('#tab1').find('.swiper-container')[0].swiper.update();
          },
          function (error) {
              param.vm.clubs([]);
              F7.instance().alert('Can not get data', 'Ooops', function () {
                  F7.mainView().router.back();
              });
          }
        );

    };

    var getActivities = function () {
        commonFunction.loadDataWithAjax(
            interfaces.myRecreationClub.getPublishedActivities,
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
                for(var i=0;i<data.length;i++){
                    switch (data[i].status){
                        case "1":data[i].status="正在报名";break;
                        case "2":data[i].status="截止报名";break;
                        case "3":data[i].status="进行中";break;
                        case "4":data[i].status="已结束";break;
                        default :data[i].status="未知";break;
                    }
                }
                param.vm.items(data);
            },
            function (error) {
                param.vm.items([]);
                F7.instance().alert('Can not get data', 'Ooops', function () {
                    F7.mainView().router.back();
                });
            }
        )

    };

    return {
        onPageInit: onPageInit
    }
})();

var myClubViewModel = function () {
    var self = this;
    self.clubs = ko.observableArray();
    self.clubs_Lambert = ko.observableArray();
    self.noFocusClubs = ko.observableArray();
    self.items = ko.observableArray();
};
