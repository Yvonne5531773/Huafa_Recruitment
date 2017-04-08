var myActivityDetails = (function () {

    var param = {
        vm: null
    };

    var onPageInit = function (page) {
        initViewModel();
        if (page.query && page.query.aid) {
            getActivityDetails(page.query.aid);
            getActivityUsers(page.query.aid);
        }
    };

    var initViewModel = function () {
        param.vm = new myActivityDetailsViewModel();
        ko.applyBindings(param.vm, document.getElementById('myActivityDetails'));

    };

    var getActivityDetails = function (activityId) {
        commonFunction.loadDataWithAjax(
            interfaces.myRecreationClub.getActivityDetails + activityId,
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
                param.vm.activityDetail(data);
            },
            function (error) {
                param.vm.activityDetail({});
                F7.instance().alert('Can not get data', 'Ooops', function () {
                    F7.mainView().router.back();
                });
            }
        )
    }

    var getActivityUsers = function (activityId) {
        commonFunction.loadDataWithAjax(
            interfaces.myRecreationClub.getActivityUsers + activityId,
            null,
            null,
            {
                showLoading: true,
                myApp: F7.instance()
            },
            function (data) {
                console.log(data);
                param.vm.users(data);
            },
            function (error) {
                console.log(data);
                param.vm.users({});
                // F7.instance().alert('Can not get data', 'Ooops', function () {
                //     F7.mainView().router.back();
                // });
            }
        )
    }

    return {
        onPageInit: onPageInit
    }
})();

var myActivityDetailsViewModel = function () {
    var self = this;
    self.activityDetail = ko.observableArray();
    self.users = ko.observableArray();
};
